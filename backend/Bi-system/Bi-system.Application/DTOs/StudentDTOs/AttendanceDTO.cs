using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class AttendanceDTO
    {
        public string SubjectName { get; set; } = string.Empty;
        public DateTimeOffset Date { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Semester { get; set; }
    }
}
