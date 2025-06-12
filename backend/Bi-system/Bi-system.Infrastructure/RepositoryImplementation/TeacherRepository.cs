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
    public class TeacherRepository (BiDbContext context) : ITeacherRepository
    {
        public async Task AddAsync(Teacher teacher)
        {
            await context.Teachers.AddAsync(teacher);
            await context.SaveChangesAsync();
        }

        public async Task<Teacher?> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            return await context.Teachers
            .AsNoTracking()
            .Include(s => s.Faculty)
            .FirstOrDefaultAsync(s => s.UserId == userId, cancellationToken);
        }

        public async Task<List<Student>> GetAllStudentForTeacher(int userId, CancellationToken cancellationToken)
        {
            var teacher = await context.Teachers
                .Include(t => t.TeacherGroups)
                    .ThenInclude(tg => tg.Group)
                        .ThenInclude(g => g.Students)
                            .ThenInclude(s => s.User)
                .FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

            if (teacher == null)
                return [];

            return teacher.TeacherGroups
                .SelectMany(tg => tg.Group.Students)
                .Distinct()
                .ToList();
        }
    }
}
