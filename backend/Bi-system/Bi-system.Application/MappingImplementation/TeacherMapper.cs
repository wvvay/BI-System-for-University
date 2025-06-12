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
    public class TeacherMapper : ITeacherMapper
    {
        public TeacherDTO MapToDto(Teacher teacher)
        {
            return new TeacherDTO
            {
                FullName = teacher.FullName,
                FacultyName = teacher.Faculty.FacultyName,
                Education = teacher.Education,
                Experience = teacher.Experience,
                Post = teacher.Post,
            };
        }

        public Teacher MapToEntity(CreateTeacherDTO createTeacherDTO)
        {
            return new Teacher
            {
                FullName = createTeacherDTO.FullName,
                Education = createTeacherDTO.Education,
                Experience = createTeacherDTO.Experience,
                Post = createTeacherDTO.Post,
            };
        }

        public TeacherKPIDTO MapToTeacherKpiDto(Teacher teacher)
        {
            return new TeacherKPIDTO
            {
                FullName = teacher.FullName,
                Experience = teacher.Experience,
                Post = teacher.Post,
                TotalTeachingHours = teacher.TotalTeachingHours,
                ExtraHours = teacher.ExtraHours,
            };
        }
    }
}
