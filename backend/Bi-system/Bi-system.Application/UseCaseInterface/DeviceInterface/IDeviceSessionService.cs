using Bi_system.Application.DTOs.DeviceDTOs;
using Bi_system.Application.DTOs.StudentDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.DeviceInterface
{
    public interface IDeviceSessionService
    {
        Task<bool> GetBoolDeviceByIdAsync(string deviceId, int userId, CancellationToken cancellationToken);
        Task AddDeviceAsync(CreateDeviceSessionDTO createDeviceSessionDTO);

        Task ClearExpiredSessionsAsync();
    }
}
