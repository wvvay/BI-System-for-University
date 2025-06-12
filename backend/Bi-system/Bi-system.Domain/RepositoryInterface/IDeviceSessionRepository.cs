using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface IDeviceSessionRepository
    {
        Task AddAsync(DeviceSession deviceSession);
        Task<bool> GetSessionAsync(string deviceId, int userId, CancellationToken cancellationToken);
        Task DeleteExpiredSessionsAsync();
    }
}
