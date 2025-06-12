using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using Bi_system.Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Infrastructure.RepositoryImplementation
{
    public class GroupRepository(BiDbContext context) : IGroupRepository
    {
        public async Task AddAsync(Group group)
        {
            await context.Groups.AddAsync(group);
            await context.SaveChangesAsync();
        }

        public async Task<Group?> GetByIdAsync(int groupId)
        {
            return await context.Groups
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.GroupId == groupId);
        }
        public async Task<Group?> GetByNameAsync(string groupName)
        {
            return await context.Groups.FirstOrDefaultAsync(g => g.GroupName == groupName);
        }
    }
}
