using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class AcademicPerformanceDTO
    {
        public string SubjectName { get; set; } = string.Empty;
        public DateTimeOffset Date { get; set; }
        public int Score { get; set; }
        public int Semester { get; set; }
    }
}
