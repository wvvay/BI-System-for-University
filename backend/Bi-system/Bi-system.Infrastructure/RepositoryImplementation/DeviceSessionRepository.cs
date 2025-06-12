using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using Bi_system.Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Infrastructure.RepositoryImplementation
{
    public class DeviceSessionRepository (BiDbContext context): IDeviceSessionRepository
    {
        public async Task AddAsync(DeviceSession deviceSession)
        {
            var existing = await context.DeviceSessions
                .FirstOrDefaultAsync(ds => ds.DeviceId == deviceSession.DeviceId);

            if (existing != null)
            {
                throw new Exception("Сессия с этим устройством уже существует");
            }

            await context.DeviceSessions.AddAsync(deviceSession);
            await context.SaveChangesAsync();
        }

        public async Task DeleteExpiredSessionsAsync()
        {
            var expirationTime = DateTimeOffset.UtcNow.AddMinutes(-10);

            var expiredSessions = await context.DeviceSessions
                .Where(ds => ds.LoginTime < expirationTime)
                .ToListAsync();

            context.DeviceSessions.RemoveRange(expiredSessions);
            await context.SaveChangesAsync();
        }

        public async Task<bool> GetSessionAsync(string deviceId, int userId, CancellationToken cancellationToken)
        {
            // Есть ли сессия с таким устройством и этим пользователем
            var sessionExists = await context.DeviceSessions
                .AnyAsync(ds => ds.DeviceId == deviceId && ds.UserId == userId, cancellationToken);

            // Есть ли сессия с таким устройством, но другим пользователем
            var sessionWithOtherUserExists = await context.DeviceSessions
                .AnyAsync(ds => ds.DeviceId == deviceId && ds.UserId != userId, cancellationToken);

            // Вернуть true, только если устройство привязано к нужному пользователю и не к другому
            return sessionExists && !sessionWithOtherUserExists;
        }
    }
}
