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
    public class StudentRepository(BiDbContext context) : IStudentRepository
    {
        public async Task AddAsync(Student student)
        {
            await context.Students.AddAsync(student);
            await context.SaveChangesAsync();
        }

        public async Task<Student?> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            return await context.Students
                .Include(s => s.Group)
                .Include(s => s.Faculty)
                .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
        }
    }
}
