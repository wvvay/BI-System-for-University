using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models;

public class User
{
    public int UserId { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }

    public Student Student { get; set; } = null!;
    public Teacher Teacher { get; set; } = null!;
    public DeviceSession DeviceSession { get; set; }= null!;
    public ICollection<AcademicPerformance> AcademicPerformances { get; set; } = [];
    public ICollection<AcademicPerformanceResult> AcademicPerformanceResults { get; set; } = [];
    public ICollection<Attendance> Attendances { get; set; } = [];
    public ICollection<ScientificWork> ScientificWorks { get; set; } = [];
}
