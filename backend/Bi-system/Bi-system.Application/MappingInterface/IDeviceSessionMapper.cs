using Bi_system.Application.DTOs.DeviceDTOs;
using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.MappingInterface
{
    public interface IDeviceSessionMapper
    {
        //DeviceSessionDTO MapToDto(DeviceSession deviceSession);
        DeviceSession MapToEntity(CreateDeviceSessionDTO createDeviceSessionDTO);
    }
}
