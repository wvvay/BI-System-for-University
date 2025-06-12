using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.DeviceDTOs
{
    public class CreateDeviceSessionDTO
    {
        public string Email { get; set; } = string.Empty;
        public string DeviceId { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTimeOffset LoginTime { get; set; }
    }
}
