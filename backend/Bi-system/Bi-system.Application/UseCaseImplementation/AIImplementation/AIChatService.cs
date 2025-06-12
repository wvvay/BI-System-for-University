using Bi_system.Application.DTOs.AI;
using Bi_system.Application.UseCaseInterface.AIInterface;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.AIImplementation
{
    public class AIChatService : IAIChatService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiUrl = "https://openrouter.ai/api/v1/chat/completions";
        private readonly string _apiKey;
        private readonly string SecretKey = Environment.GetEnvironmentVariable("OPENROUTER_API_KEY") ?? throw new InvalidOperationException("SECRET_KEY is not set");
        private readonly IStudentDataAnalysisService _studentDataAnalysisService;
        private const int MaxRetries = 3;

        public AIChatService(
            HttpClient httpClient, 
            IConfiguration configuration,
            IStudentDataAnalysisService studentDataAnalysisService)
        {
            _httpClient = httpClient;
            _apiKey = SecretKey;
            _studentDataAnalysisService = studentDataAnalysisService;
        }

        public async Task<ChatResponseDto> GetAIResponseAsync(ChatRequestDto request, int userId)
        {
            string prompt = request.Message;
            
            // Если запрос связан с анализом данных студента
            if (request.Message.ToLower().Contains("проанализируй"))
            {
                try
                {
                    var analytics = await _studentDataAnalysisService.GetStudentAnalyticsAsync(userId, CancellationToken.None);
                    var analyticsJson = JsonSerializer.Serialize(analytics);
                    
                    prompt = $@"Вопрос пользователя: {request.Message}

Проанализируй следующие данные студента и дай подробный анализ его успеваемости, посещаемости и научной активности. 
Ответ должен быть структурированным и содержать конкретные рекомендации по улучшению показателей.
Данные студента: {analyticsJson}";
                }
                catch (Exception ex)
                {
                    return new ChatResponseDto
                    {
                        Answer = $"Ошибка при получении данных студента: {ex.Message}"
                    };
                }
            }

            var payload = new
            {
                model = "deepseek/deepseek-chat-v3-0324:free",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            for (int attempt = 1; attempt <= MaxRetries; attempt++)
            {
                try
                {
                    var response = await _httpClient.PostAsJsonAsync(_apiUrl, payload);

                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadFromJsonAsync<OpenRouterResponse>();
                        var answer = result?.choices?.FirstOrDefault()?.message?.content;

                        return new ChatResponseDto
                        {
                            Answer = answer ?? "[Пустой ответ от нейросети]"
                        };
                    }
                    else
                    {
                        var error = await response.Content.ReadAsStringAsync();
                        if (attempt == MaxRetries)
                        {
                            throw new ApplicationException($"AI error: {response.StatusCode} - {error}");
                        }
                        // Ждем перед следующей попыткой
                        await Task.Delay(TimeSpan.FromSeconds(attempt * 2));
                    }
                }
                catch (TaskCanceledException) when (attempt < MaxRetries)
                {
                    // Если произошел таймаут, пробуем еще раз
                    await Task.Delay(TimeSpan.FromSeconds(attempt * 2));
                    continue;
                }
                catch (Exception ex) when (attempt < MaxRetries)
                {
                    // Для других ошибок тоже пробуем повторить
                    await Task.Delay(TimeSpan.FromSeconds(attempt * 2));
                    continue;
                }
            }

            return new ChatResponseDto
            {
                Answer = "К сожалению, не удалось получить ответ от AI после нескольких попыток. Пожалуйста, попробуйте позже."
            };
        }
    }
}
