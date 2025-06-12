using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class StudentDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string GroupName { get; set; } = string.Empty;
        public string GradebookNumber { get; set; } = string.Empty;
        public string FacultyName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTimeOffset DayOfBirth { get; set; }
        public int CourseYear { get; set; }
        public int Course { get; set; }
        public string DormitoryNumber { get; set; } = string.Empty;
        public int RoomNumber { get; set; }

    }
}
