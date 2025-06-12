using Bi_system.Application.DTOs.DeviceDTOs;
using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingImplementation;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.DeviceInterface;
using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.DeviceSessionImplementation
{
    public class DeviceSessionService(IDeviceSessionMapper deviceSessionMapper,
                                      IDeviceSessionRepository deviceSessionRepository,
                                      IUserRepository userRepository) : IDeviceSessionService
    {
        public async Task AddDeviceAsync(CreateDeviceSessionDTO createDeviceSessionDTO)
        {
            // Поиск пользователя
            var user = await userRepository.GetByEmailAsync(createDeviceSessionDTO.Email);
            if (user == null)
                throw new Exception("Пользователь с таким email не найден");

            var device = deviceSessionMapper.MapToEntity(createDeviceSessionDTO);
            device.UserId = user.UserId;

            await deviceSessionRepository.AddAsync(device);

        }


        public async Task<bool> GetBoolDeviceByIdAsync(string deviceId, int userId, CancellationToken cancellationToken)
        {
            var deviceBool = await deviceSessionRepository.GetSessionAsync(deviceId, userId, cancellationToken);
            return deviceBool;
        }

        public async Task ClearExpiredSessionsAsync()
        {
            await deviceSessionRepository.DeleteExpiredSessionsAsync();
        }
    }
}
