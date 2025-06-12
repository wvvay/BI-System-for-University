using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class TeacherKPIDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string Post { get; set; } = string.Empty;
        public int Experience { get; set; }
        public int TotalTeachingHours { get; set; }
        public int ExtraHours { get; set; }
        public double AverageStudentScore { get; set; }
        public double AverageStudentAttendance { get; set; }
        public int ScientificPublicationCount { get; set; }
        public int CountSubject {  get; set; }
        public int CountGroup { get; set; }

    }
}
