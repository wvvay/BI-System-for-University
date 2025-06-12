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
    public class AcademicPerformanceResultRepository(BiDbContext context) : IAcademicPerformanceResultRepository
    {
        public async Task AddAsync(AcademicPerformanceResult academicPerformanceResult)
        {
            await context.AcademicPerformancesResults.AddAsync(academicPerformanceResult);
            await context.SaveChangesAsync();
        }

        public async Task<List<AcademicPerformanceResult>> GetAllForTeacherUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            // Получаем список всех предметов, которые ведет преподаватель
            var subjectIds = await context.TeacherSubjects
                .Where(ts => ts.Teacher.UserId == userId)
                .Select(ts => ts.SubjectId)
                .ToListAsync(cancellationToken);

            // Получаем список всех групп, которые ведет преподаватель
            var groupIds = await context.TeacherGroups
                .Where(tg => tg.Teacher.UserId == userId)
                .Select(tg => tg.GroupId)
                .ToListAsync(cancellationToken);

            // Фильтруем успеваемость по предметам и группам, которые ведет преподаватель
            var academicPerformancesResult = await context.AcademicPerformancesResults
                .Include(ap => ap.Subject)
                .Include(ap => ap.User)
                    .ThenInclude(u => u.Student)
                        .ThenInclude(s => s.Group)
                .Where(ap =>
                    subjectIds.Contains(ap.SubjectId) && // Фильтруем по предметам
                    groupIds.Contains(ap.User.Student.GroupId)) // Фильтруем по группам
                .ToListAsync(cancellationToken);

            return academicPerformancesResult;
        }

        public async Task<List<AcademicPerformanceResult>> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            return await context.AcademicPerformancesResults
                .Include(a => a.Subject)
                .Where(s => s.UserId == userId)
                .ToListAsync(cancellationToken);
        }
    }
}
