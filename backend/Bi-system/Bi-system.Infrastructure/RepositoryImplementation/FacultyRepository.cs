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
    public class FacultyRepository(BiDbContext context) : IFacultyRepository
    {
        public async Task AddAsync(Faculty faculty)
        {
            await context.Faculty.AddAsync(faculty);
            await context.SaveChangesAsync();
        }

        public async Task<Faculty?> GetByIdAsync(int facultyId)
        {
            return await context.Faculty
                .AsNoTracking()
                .FirstOrDefaultAsync(g => g.FacultyId == facultyId);
        }

        public async Task<Faculty?> GetByNameAsync(string facultyName)
        {
            return await context.Faculty.FirstOrDefaultAsync(f => f.FacultyName == facultyName);
        }

    }
}
