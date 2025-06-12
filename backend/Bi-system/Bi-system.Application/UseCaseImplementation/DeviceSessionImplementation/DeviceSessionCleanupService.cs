using Bi_system.Application.UseCaseInterface.DeviceInterface;
using Bi_system.Domain.RepositoryInterface;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.DeviceSessionImplementation
{
    public class DeviceSessionCleanupService(IServiceScopeFactory scopeFactory) : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = scopeFactory.CreateScope();

                var deviceSessionRepository = scope.ServiceProvider.GetRequiredService<IDeviceSessionRepository>();

                try
                {
                    await deviceSessionRepository.DeleteExpiredSessionsAsync();
                    Console.WriteLine($"[{DateTime.UtcNow}] Удалены устаревшие сессии");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Ошибка при удалении сессий: {ex.Message}");
                }

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
