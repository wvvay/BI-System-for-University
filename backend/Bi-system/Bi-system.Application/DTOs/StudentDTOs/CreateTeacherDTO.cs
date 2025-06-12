using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class CreateTeacherDTO
    { 
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Education { get; set; } = string.Empty;
        public string FacultyName { get; set; } = string.Empty;
        public string Post { get; set; } = string.Empty;
        public int Experience { get; set; }
    }
}
