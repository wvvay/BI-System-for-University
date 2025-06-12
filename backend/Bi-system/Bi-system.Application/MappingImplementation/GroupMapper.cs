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
    public class GroupMapper : IGroupMapper
    {
        public GroupDTO MapToDto(Group group)
        {
            return new GroupDTO
            {
                GroupId = group.GroupId,
                GroupName = group.GroupName,
                CourseYear = group.CourseYear
            };
        }

        public Group MapToEntity(CreateGroupDTO createGroupDTO)
        {
            return new Group
            {
                GroupName = createGroupDTO.GroupName,
                CourseYear = createGroupDTO.CourseYear
            };
        }
    }
}
