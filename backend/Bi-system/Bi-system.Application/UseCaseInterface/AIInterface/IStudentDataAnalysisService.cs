using Bi_system.Application.DTOs.StudentDTOs;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.AIInterface
{
    public interface IStudentDataAnalysisService
    {
        Task<StudentAnalyticsDTO> GetStudentAnalyticsAsync(int userId, CancellationToken cancellationToken);
        Task<List<StudentRiskDTO>> GetStudentsAtRiskAsync(int teacherId, CancellationToken cancellationToken);
    }
}
