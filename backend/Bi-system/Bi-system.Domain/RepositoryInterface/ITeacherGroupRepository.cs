using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface ITeacherGroupRepository
    {
        Task<TeacherGroup?> GetByIdAsync(int teacherGroupId);
        Task AddAsync(TeacherGroup teacherGroup);
        Task<List<TeacherGroup>> GetTeacherGroupsAsync(int teacherId);
    }
}
