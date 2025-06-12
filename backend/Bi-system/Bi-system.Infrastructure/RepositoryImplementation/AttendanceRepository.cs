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
    public class AttendanceRepository (BiDbContext context): IAttendancesRepository
    {
        public async Task AddAsync(Attendance attendance)
        {
            await context.Attendances.AddAsync(attendance);
            await context.SaveChangesAsync();
        }

        public async Task<bool> ExistsWithinTimeframeAsync(int userId, int subjectId, DateTimeOffset dateTime, TimeSpan timeframe)
        {
            var dateTimeUtc = new DateTimeOffset(dateTime.UtcDateTime, TimeSpan.Zero);
            var minDate = dateTimeUtc - timeframe;
            var maxDate = dateTimeUtc + timeframe;

            var result = await context.Attendances.AnyAsync(a =>
                a.UserId == userId &&
                a.SubjectId == subjectId &&
                a.Date >= minDate &&
                a.Date <= maxDate);

            return result;
        }


        public async Task<List<Attendance>> GetAllForTeacherUserIdAsync(int userId, CancellationToken cancellationToken)
        {
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
            var attendance = await context.Attendances
                .Include(ap => ap.Subject)
                .Include(ap => ap.User)
                    .ThenInclude(u => u.Student)
                        .ThenInclude(s => s.Group)
                .Where(ap =>
                    subjectIds.Contains(ap.SubjectId) && // Фильтруем по предметам
                    groupIds.Contains(ap.User.Student.GroupId)) // Фильтруем по группам
                .ToListAsync(cancellationToken);

            return attendance;
        }

        public async Task<List<Attendance>> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            return await context.Attendances
                .Include(a => a.Subject)
                .Where(s => s.UserId == userId)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Attendance>> GetAllAttendanceForTeacherTodayAsync(int userId, CancellationToken cancellationToken)
        {
            var subjectIds = await context.TeacherSubjects
                .Where(ts => ts.Teacher.UserId == userId)
                .Select(ts => ts.SubjectId)
                .ToListAsync(cancellationToken);

            var groupIds = await context.TeacherGroups
                .Where(tg => tg.Teacher.UserId == userId)
                .Select(tg => tg.GroupId)
                .ToListAsync(cancellationToken);

            // Используем DateTimeOffset в UTC с нулевым смещением
            var todayStart = new DateTimeOffset(DateTime.UtcNow.Date, TimeSpan.Zero); // Начало текущего дня в UTC
            var todayEnd = todayStart.AddDays(1); // Начало следующего дня в UTC

            var attendance = await context.Attendances
                .Include(ap => ap.Subject)
                .Include(ap => ap.User)
                    .ThenInclude(u => u.Student)
                        .ThenInclude(s => s.Group)
                .Where(ap =>
                    subjectIds.Contains(ap.SubjectId) &&
                    groupIds.Contains(ap.User.Student.GroupId) &&
                    ap.Date >= todayStart && // Сравниваем DateTimeOffset напрямую
                    ap.Date < todayEnd)     // Сравниваем DateTimeOffset напрямую
                .ToListAsync(cancellationToken);

            return attendance;
        }
    }
}
