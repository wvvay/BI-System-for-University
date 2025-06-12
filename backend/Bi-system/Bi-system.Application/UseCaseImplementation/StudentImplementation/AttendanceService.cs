using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingImplementation;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.StudentImplementation
{
    public class AttendanceService(IAttendancesRepository attendancesRepository,
                                   IAttendanceMapper attendanceMapper,
                                   IUserRepository userRepository,
                                   ISubjectRepository subjectRepository) : IAttendanceService
    {
        public async Task AddAttendanceAsync(CreateAttendanceDTO createAttendanceDTO)
        {
            // Поиск пользователя
            var user = await userRepository.GetByEmailAsync(createAttendanceDTO.Email);
            if (user == null)
                throw new Exception("Пользователь с таким email не найден");

            var subject = await subjectRepository.GetByNameAsync(createAttendanceDTO.SubjectName);
            if (subject == null)
                throw new Exception("Предмет с таким названием не найден");

            // Маппинг и установка внешних ключей
            var attendance = attendanceMapper.MapToEntity(createAttendanceDTO);
            attendance.UserId = user.UserId;
            attendance.SubjectId = subject.SubjectId;

            await attendancesRepository.AddAsync(attendance);
        }

        public async Task<List<AttendanceDTO>> ExecuteAsync(int userId, CancellationToken cancellationToken)
        {
            var attendance = await attendancesRepository.GetByUserIdAsync(userId, cancellationToken);
            return attendance.Select(attendanceMapper.MapToDto).ToList();
        }

        public async Task<List<AttendanceForTeacherDTO>> GetForTeacherAsync(int teacherUserId, CancellationToken cancellationToken)
        {
            var attendances = await attendancesRepository.GetAllForTeacherUserIdAsync(teacherUserId, cancellationToken);
            return attendances.Select(attendanceMapper.MapToForTeacherDto).ToList();
        }

        public async Task<List<AttendanceForTeacherDTO>> GetForTeacherTodayAsync(int teacherUserId, CancellationToken cancellationToken)
        {
            var attendances = await attendancesRepository.GetAllAttendanceForTeacherTodayAsync(teacherUserId, cancellationToken);
            return attendances.Select(attendanceMapper.MapToForTeacherDto).ToList();
        }
    }
}
