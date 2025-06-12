using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class AcademicPerformanceForTeacherDTO
    {
        public string StudentFullName { get; set; } = string.Empty;
        public string GradebookNumber { get; set; } = string.Empty;
        public string GroupName { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public int Score { get; set; }
        public int Semester { get; set; }

        public int AverageStudentScore { get; set; }
        public DateTimeOffset Date { get; set; }
    }
}
