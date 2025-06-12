using Bi_system.Application.DTOs.StudentDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.StudentInterface
{
    public interface IAcademicPerformanceService
    {
        Task<List<AcademicPerformanceDTO>> ExecuteAsync(int userId, CancellationToken cancellationToken);
        Task AddAcademicPerformanceAsync(CreateAcademicPerformanceDTO createAcademicPerformanceDTO);
        Task<List<AcademicPerformanceForTeacherDTO>> GetForTeacherAsync(int teacherUserId, CancellationToken cancellationToken);



        Task<List<AcademicPerformanceResultDTO>> ExecuteResultAsync(int userId, CancellationToken cancellationToken);
        Task AddAcademicPerformanceResultAsync(CreateAcademicPerformanceResultDTO createAcademicPerformanceResultDTO);
        Task<List<AcademicPerformanceResultForTeacherDTO>> GetForTeacherResultAsync(int teacherUserId, CancellationToken cancellationToken);

    }
}
