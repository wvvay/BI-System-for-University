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
    public class TeacherGroupRepository(BiDbContext context): ITeacherGroupRepository
    {
        public async Task AddAsync(TeacherGroup teacherGroup)
        {
            await context.TeacherGroups.AddAsync(teacherGroup);
            await context.SaveChangesAsync();
        }

        public async Task<TeacherGroup?> GetByIdAsync(int teacherGroupId)
        {
            return await context.TeacherGroups
                .AsNoTracking()
                .Include(ts => ts.Teacher)
                .Include(ts => ts.Group)
                .FirstOrDefaultAsync(s => s.TeacherGroupId == teacherGroupId);
        }

        public async Task<List<TeacherGroup>> GetTeacherGroupsAsync(int teacherId)
        {
            return await context.TeacherGroups
                .AsNoTracking()
                .Where(t => t.TeacherId == teacherId)
                .Include(ts => ts.Group)
                .Include(ts => ts.Teacher)
                .ToListAsync();
        }
    }
}
