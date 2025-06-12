using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models
{
    public class AcademicPerformanceResult
    {
        public int AcademicPerformanceResultId { get; set; }
        public int UserId { get; set; }
        public int SubjectId { get; set; }
        public DateTimeOffset Date { get; set; }
        public int Result { get; set; }
        public int Semester { get; set; }

        public User User { get; set; } = null!;
        public Subject Subject { get; set; } = null!;
    }
}
