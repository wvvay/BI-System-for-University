using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class CreateTeacherGroupDTO
    {
        public string Email { get; set; } = string.Empty;
        public string GroupName { get; set; } = string.Empty;
    }
}
