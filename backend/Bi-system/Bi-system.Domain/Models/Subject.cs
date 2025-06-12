using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models
{
    public class Subject
    {
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;

        public ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
        public ICollection<AcademicPerformance> AcademicPerformances { get; set; } = new List<AcademicPerformance>();
        public ICollection<AcademicPerformanceResult> AcademicPerformanceResults { get; set; } = new List<AcademicPerformanceResult>();

    }
}
