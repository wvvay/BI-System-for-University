using Bi_system.Application.DTOs.StudentDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.StudentInterface
{
    public interface IAttendanceService
    {
        Task<List<AttendanceDTO>> ExecuteAsync(int userId, CancellationToken cancellationToken);
        Task AddAttendanceAsync(CreateAttendanceDTO createAttendanceDTO);

        Task<List<AttendanceForTeacherDTO>> GetForTeacherAsync(int teacherUserId, CancellationToken cancellationToken);
        Task<List<AttendanceForTeacherDTO>> GetForTeacherTodayAsync(int teacherUserId, CancellationToken cancellationToken);

    }
}
