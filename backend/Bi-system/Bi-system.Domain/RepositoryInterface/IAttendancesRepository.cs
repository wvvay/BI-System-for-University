using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface IAttendancesRepository
    {
        Task<List<Attendance>> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
        Task AddAsync(Attendance attendance);

        Task<List<Attendance>> GetAllForTeacherUserIdAsync(int userId, CancellationToken cancellationToken);

        Task<bool> ExistsWithinTimeframeAsync(int userId, int subjectId, DateTimeOffset dateTime, TimeSpan timeframe);


        Task<List<Attendance>> GetAllAttendanceForTeacherTodayAsync(int userId, CancellationToken cancellationToken);
    }
}
