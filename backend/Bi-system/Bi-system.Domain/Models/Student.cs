using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models
{
    public class Student
    {
        public int StudentId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int GroupId { get; set; }
        public string GradebookNumber { get; set; } = string.Empty;
        public int FacultyId { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public DateTimeOffset DayOfBirth { get; set; }
        public int CourseYear { get; set; }
        public int Course { get; set; }

        public string DormitoryNumber { get; set; } = string.Empty;
        public int RoomNumber { get; set; }

        public User User { get; set; } = null!;
        public Group Group { get; set; } = null!;
        public Faculty Faculty { get; set; } = null!;

    }
}
