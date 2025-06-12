using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingInterface;
using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.MappingImplementation
{
    public class TeacherSubjectMapper : ITeacherSubjectMapper
    {
        public TeacherSubjectDTO MapToDto(TeacherSubject teacherSubject)
        {
            return new TeacherSubjectDTO
            {
                FullName = teacherSubject.Teacher.FullName,
                SubjectName = teacherSubject.Subject.SubjectName,
            };
        }

        public TeacherSubject MapToEntity(CreateTeacherSubjectDTO createTeacherSubjectDTO)
        {

            return new TeacherSubject
            {

            };
        }
    }
}
