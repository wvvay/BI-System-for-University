using Bi_system.Application.DependencyInjection;
using Bi_system.Application.UseCaseImplementation.DeviceSessionImplementation;
using Bi_system.Application.UseCaseInterface.DeviceInterface;
using Bi_system.Domain.RepositoryInterface;
using Bi_system.Infrastructure.DependencyInjection;
using Bi_system.Infrastructure.RepositoryImplementation;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace Bi_system.API;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals;
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });
            
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            // Добавляем документ OpenAPI с нужной информацией
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Bi-system API",
                Version = "v1",
                Description = "API для системы оценки успеваемости студентов"
            });

            // Настройка авторизации через JWT
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter your JWT token",
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });

            // Добавляем требования безопасности для всех запросов
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        builder.Services.AddApplicationService();
        builder.Services.AddInfrastructureServices();

        //Политика CORS
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", builder =>
            {
                builder
                    .WithOrigins(
                        "http://localhost:3000",  // Next.js dev server
                        "http://localhost:4000",   // Ваш текущий origin
                        "http://bi-system_frontend:4000"   // Ваш текущий origin
                    )
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        //На проде нужно будет убрать
        app.UseSwagger();
        app.UseSwaggerUI();

        //CORS
        app.UseCors("AllowAll");
        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();
        
        app.MapControllers();
        await app.InitAndRunAsync();
    }
}
