﻿using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingInterface;
using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.MappingImplementation
{
    public class TeacherGroupMapper : ITeacherGroupMapper
    {

        public TeacherGroupDTO MapToDto(TeacherGroup teacherGroup)
        {
            return new TeacherGroupDTO
            {
                FullName = teacherGroup.Teacher.FullName,
                GroupName = teacherGroup.Group.GroupName,
            };
        }

        public TeacherGroup MapToEntity(CreateTeacherGroupDTO createTeacherGroupDTO)
        {
            return new TeacherGroup
            {

            };
        }
    }
}
