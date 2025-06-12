using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models
{
    public class DeviceSession
    {
        public int DeviceSessionId { get; set; }
        public int UserId { get; set; }
        public string DeviceId { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTimeOffset LoginTime { get; set; }

        public User User { get; set; } = null!;
    }
}
