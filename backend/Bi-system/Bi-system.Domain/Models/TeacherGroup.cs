using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models
{
    public class TeacherGroup
    {
        public int TeacherGroupId { get; set; }
        public int TeacherId { get; set; }
        public int GroupId { get; set; }

        public Teacher Teacher { get; set; } = null!;
        public Group Group { get; set; } = null!;
    }
}
