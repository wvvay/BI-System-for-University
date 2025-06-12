using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models
{
    public class Teacher
    {
        public int TeacherId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Education { get; set; } = string.Empty;
        public int FacultyId { get; set; }
        public string Post { get; set; } = string.Empty;
        public int Experience { get; set; }
        public int TotalTeachingHours { get; set; }
        public int ExtraHours { get; set; }


        public User User { get; set; } = null!;
        public Faculty Faculty { get; set; } = null!;
        public ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();
        public ICollection<TeacherGroup> TeacherGroups { get; set; } = new List<TeacherGroup>();
    }
}
