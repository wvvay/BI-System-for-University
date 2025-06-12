using Bi_system.Application.DTOs.StudentDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.Student
{
    public interface IGroupService
    {
        Task<GroupDTO?> GetGroupByIdAsync(int groupId);
        Task AddGroupAsync(CreateGroupDTO createGroupDTO);
    }
}
