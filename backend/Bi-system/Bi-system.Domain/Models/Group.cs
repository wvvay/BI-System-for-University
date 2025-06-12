using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models
{
    public class Group
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public int CourseYear { get; set; }

        public ICollection<Student> Students { get; set; } = new List<Student>();
        public ICollection<TeacherGroup> TeacherGroups { get; set; } = new List<TeacherGroup>();

    }
}
