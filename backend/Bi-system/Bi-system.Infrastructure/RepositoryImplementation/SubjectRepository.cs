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
    public class SubjectRepository(BiDbContext context) : ISubjectRepository
    {
        public async Task AddAsync(Subject subject)
        {
           await context.Subjects.AddAsync(subject);
           await context.SaveChangesAsync();
        }

        public async Task<Subject?> GetByIdAsync(int subjectId)
        {
            return await context.Subjects
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.SubjectId == subjectId);
        }

        public async Task<Subject?> GetByNameAsync(string subjectName)
        {
            return await context.Subjects.FirstOrDefaultAsync(f => f.SubjectName == subjectName);
        }
    }
}
