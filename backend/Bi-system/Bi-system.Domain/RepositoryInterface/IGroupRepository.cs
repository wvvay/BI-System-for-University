using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface IGroupRepository
    {
        Task<Group?> GetByIdAsync(int groupId);
        Task AddAsync(Group group);

        Task<Group?> GetByNameAsync(string groupName);
    }
}
