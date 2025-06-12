using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.Student;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.Student
{
    public class GroupService(IGroupRepository groupRepository, 
                            IGroupMapper groupMapper) : IGroupService
    {
        public async Task AddGroupAsync(CreateGroupDTO createGroupDTO)
        {
            var group = groupMapper.MapToEntity(createGroupDTO);
            await groupRepository.AddAsync(group);
        }

        public async Task<GroupDTO?> GetGroupByIdAsync(int groupId)
        {
            var group = await groupRepository.GetByIdAsync(groupId);
            return group == null ? null : groupMapper.MapToDto(group);
        }
    }
}
