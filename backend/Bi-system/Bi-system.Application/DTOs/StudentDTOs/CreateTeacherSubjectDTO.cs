﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class CreateTeacherSubjectDTO
    {
        public string Email { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
    }
}
