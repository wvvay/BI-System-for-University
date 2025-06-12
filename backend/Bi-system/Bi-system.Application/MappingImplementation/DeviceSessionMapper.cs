using Bi_system.Application.DTOs.DeviceDTOs;
using Bi_system.Application.MappingInterface;
using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.MappingImplementation
{
    public class DeviceSessionMapper : IDeviceSessionMapper
    {
        public DeviceSession MapToEntity(CreateDeviceSessionDTO createDeviceSessionDTO)
        {
            return new DeviceSession
            {
                DeviceId = createDeviceSessionDTO.DeviceId,
                Latitude = createDeviceSessionDTO.Latitude,
                Longitude = createDeviceSessionDTO.Longitude,
                LoginTime = createDeviceSessionDTO.LoginTime,
            };
        }
    }
}
