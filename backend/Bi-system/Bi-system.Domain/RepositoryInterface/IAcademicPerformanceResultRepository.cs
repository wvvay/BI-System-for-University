using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface IAcademicPerformanceResultRepository
    {
        Task<List<AcademicPerformanceResult>> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
        Task AddAsync(AcademicPerformanceResult academicPerformanceResult);
        Task<List<AcademicPerformanceResult>> GetAllForTeacherUserIdAsync(int userId, CancellationToken cancellationToken);
    }
}
