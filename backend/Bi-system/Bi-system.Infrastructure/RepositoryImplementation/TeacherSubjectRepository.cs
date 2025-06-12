using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using Bi_system.Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Bi_system.Infrastructure.RepositoryImplementation
{
    public class TeacherSubjectRepository(BiDbContext context) : ITeacherSubjectRepository
    {
        public async Task AddAsync(TeacherSubject teacherSubject)
        {
            await context.TeacherSubjects.AddAsync(teacherSubject);
            await context.SaveChangesAsync();
        }

        public async Task<TeacherSubject?> GetByIdAsync(int teacherSubjectId)
        {
            return await context.TeacherSubjects
                .AsNoTracking()
                .Include(ts => ts.Teacher)
                .Include(ts => ts.Subject)
                .FirstOrDefaultAsync(s => s.TeacherSubjectId == teacherSubjectId);
        }

        public async Task<List<TeacherSubject>> GetTeacherSubjectsAsync(int teacherId)
        {
            return await context.TeacherSubjects
                .AsNoTracking()
                .Where(u => u.TeacherId == teacherId)
                .Include(ts => ts.Subject)
                .Include(ts => ts.Teacher)
                .ToListAsync();

        }
    }
}
