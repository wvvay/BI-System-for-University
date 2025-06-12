using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingImplementation;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.StudentImplementation
{
    public class AcademicPerformanceService(IAcademicPerformanceRepository academicPerformanceRepository,
                                            IAcademicPerformanceResultRepository academicPerformanceResultRepository,
                                            IUserRepository userRepository,
                                            IAcademicPerformanceMapper academicPerformanceMapper,
                                            ISubjectRepository subjectRepository): IAcademicPerformanceService
    {
        public async Task AddAcademicPerformanceAsync(CreateAcademicPerformanceDTO createAcademicPerformanceDTO)
        {
            // Поиск пользователя
            var user = await userRepository.GetByEmailAsync(createAcademicPerformanceDTO.Email);
            if (user == null)
                throw new Exception("Пользователь с таким email не найден");

            var subject = await subjectRepository.GetByNameAsync(createAcademicPerformanceDTO.SubjectName);
            if (subject == null)
                throw new Exception("Предмет с таким названием не найден");

            // Маппинг и установка внешних ключей
            var academicPerformance = academicPerformanceMapper.MapToEntity(createAcademicPerformanceDTO);
            academicPerformance.UserId = user.UserId;
            academicPerformance.SubjectId = subject.SubjectId;

            await academicPerformanceRepository.AddAsync(academicPerformance);
        }

        public async Task<List<AcademicPerformanceDTO>> ExecuteAsync(int userId, CancellationToken cancellationToken)
        {
            var academicPerformance = await academicPerformanceRepository.GetByUserIdAsync(userId, cancellationToken);
            return academicPerformance.Select(academicPerformanceMapper.MapToDto).ToList();
        }

        public async Task<List<AcademicPerformanceForTeacherDTO>> GetForTeacherAsync(int teacherUserId, CancellationToken cancellationToken)
        {
            var performances = await academicPerformanceRepository.GetAllForTeacherUserIdAsync(teacherUserId, cancellationToken);
            return performances.Select(academicPerformanceMapper.MapToForTeacherDto).ToList();

            //var performances = await academicPerformanceRepository.GetAllForTeacherUserIdAsync(teacherUserId, cancellationToken);

            //const double maxScorePerSubject = 100.0;

            //double averageStudentScore = performances.Any()
            //    ? Math.Round(
            //        performances
            //            .GroupBy(p => p.UserId)
            //            .Select(g =>
            //                g.GroupBy(p => p.Subject.SubjectName)
            //                 .Average(s => (s.Sum(p => p.Score) / maxScorePerSubject) * 100))
            //            .Average(),
            //        2)
            //    : 0;

            //// Маппинг + установка среднего балла
            //var result = performances
            //    .Select(p =>
            //    {
            //        var dto = academicPerformanceMapper.MapToForTeacherDto(p);
            //        dto.AverageStudentScore = (int)averageStudentScore;
            //        return dto;
            //    })
            //    .ToList();

            //return result;
        }
        public async Task<List<AcademicPerformanceResultDTO>> ExecuteResultAsync(int userId, CancellationToken cancellationToken)
        {
            var academicPerformanceResult = await academicPerformanceResultRepository.GetByUserIdAsync(userId, cancellationToken);
            return academicPerformanceResult.Select(academicPerformanceMapper.MapToDto).ToList();
        }

        public async Task<List<AcademicPerformanceResultForTeacherDTO>> GetForTeacherResultAsync(int teacherUserId, CancellationToken cancellationToken)
        {
            var performancesResult = await academicPerformanceResultRepository.GetAllForTeacherUserIdAsync(teacherUserId, cancellationToken);
            return performancesResult.Select(academicPerformanceMapper.MapToForTeacherDto).ToList();
        }


        public async Task AddAcademicPerformanceResultAsync(CreateAcademicPerformanceResultDTO createAcademicPerformanceResultDTO)
        {
            // Поиск пользователя
            var user = await userRepository.GetByEmailAsync(createAcademicPerformanceResultDTO.Email);
            if (user == null)
                throw new Exception("Пользователь с таким email не найден");

            var subject = await subjectRepository.GetByNameAsync(createAcademicPerformanceResultDTO.SubjectName);
            if (subject == null)
                throw new Exception("Предмет с таким названием не найден");

            // Маппинг и установка внешних ключей
            var academicPerformanceResult = academicPerformanceMapper.MapToEntity(createAcademicPerformanceResultDTO);
            academicPerformanceResult.UserId = user.UserId;
            academicPerformanceResult.SubjectId = subject.SubjectId;

            await academicPerformanceResultRepository.AddAsync(academicPerformanceResult);
        }

    }
}
