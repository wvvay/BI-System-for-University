using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.MappingInterface
{
    public interface ITeacherSubjectMapper
    {
        TeacherSubjectDTO MapToDto(TeacherSubject teacherSubject);
        TeacherSubject MapToEntity(CreateTeacherSubjectDTO createTeacherSubjectDTO);
    }
}
