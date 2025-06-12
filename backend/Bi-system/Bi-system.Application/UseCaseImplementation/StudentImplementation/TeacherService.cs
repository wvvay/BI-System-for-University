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
    public class TeacherService(ITeacherRepository teacherRepository,
                                ITeacherMapper teacherMapper,
                                ITeacherSubjectMapper teacherSubjectMapper,
                                ITeacherGroupMapper teacherGroupMapper,
                                IUserRepository userRepository,
                                IFacultyRepository facultyRepository,
                                IAcademicPerformanceRepository academicPerformanceRepository,
                                IAttendancesRepository attendancesRepository,
                                IScientificWorkRepository scientificWorkRepository,
                                ITeacherSubjectRepository teacherSubjectRepository,
                                ITeacherGroupRepository teacherGroupRepository) : ITeacherService
    {
        public async Task AddAsync(CreateTeacherDTO createTeacherDTO)
        {
            // Поиск пользователя
            var user = await userRepository.GetByEmailAsync(createTeacherDTO.Email);
            if (user == null)
                throw new Exception("Пользователь с таким email не найден");

            // Поиск факультета
            var faculty = await facultyRepository.GetByNameAsync(createTeacherDTO.FacultyName);
            if (faculty == null)
                throw new Exception("Факультет с таким названием не найден");

            // Маппинг и установка внешних ключей
            var student = teacherMapper.MapToEntity(createTeacherDTO);
            student.UserId = user.UserId;
            student.FacultyId = faculty.FacultyId;


            await teacherRepository.AddAsync(student);
        }
        public async Task<List<TeacherSubjectDTO>> GetMySubjects(int userId, CancellationToken cancellationToken)
        {
            var teacher = await teacherRepository.GetByUserIdAsync(userId, cancellationToken);
            if (teacher == null)
                throw new Exception("Преподаватель не найден");

            var teacherSubjects = await teacherSubjectRepository.GetTeacherSubjectsAsync(teacher.TeacherId);
            if (!teacherSubjects.Any())
                throw new Exception("У данного преподавателя нет прикреплённых предметов");

            return teacherSubjects.Select(teacherSubjectMapper.MapToDto).ToList();

        }

        public async Task<List<TeacherGroupDTO>> GetMyGroups(int userId, CancellationToken cancellationToken)
        {
            var teacher = await teacherRepository.GetByUserIdAsync(userId, cancellationToken);
            if (teacher == null)
                throw new Exception("Преподаватель не найден");

            var teacherGroups = await teacherGroupRepository.GetTeacherGroupsAsync(teacher.TeacherId);
            if (!teacherGroups.Any())
                throw new Exception("У данного преподавателя нет прикреплённых групп");

            return teacherGroups.Select(teacherGroupMapper.MapToDto).ToList();

        }

        public async Task<TeacherDTO?> ExecuteAsync(int userId, CancellationToken cancellationToken)
        {
            var teacher = await teacherRepository.GetByUserIdAsync(userId, cancellationToken);
            return teacher is not null ? teacherMapper.MapToDto(teacher) : null;
        }

        public async Task<TeacherKPIDTO> GetKPIDTO(int userId, CancellationToken cancellationToken)
        {
            var user = await teacherRepository.GetByUserIdAsync(userId, cancellationToken);
            if (user == null) throw new Exception("Пользователь с таким email не найден");
            
            var teacher = teacherMapper.MapToTeacherKpiDto(user);

            //var AverageStudentScore = ;
            //var AverageStudentAttendance = ;
            //var ScientificPublicationCount = ;
            //var CountSubject = ;
            //var CountGroup = ;

            //teacher.CountSubject = CountSubject;
            //teacher.CountGroup = CountGroup;
            //teacher.AverageStudentAttendance = AverageStudentAttendance;
            //teacher.AverageStudentScore = AverageStudentScore;
            //teacher.ScientificPublicationCount = ScientificPublicationCount;

            //return teacher;

            var performances = await academicPerformanceRepository.GetAllForTeacherUserIdAsync(userId, cancellationToken);
            var attendances = await attendancesRepository.GetAllForTeacherUserIdAsync(userId, cancellationToken);
            var publications = await scientificWorkRepository.GetByUserIdAsync(userId, cancellationToken);

            const double maxScorePerSubject = 100.0; // Максимальный балл за предмет
            teacher.AverageStudentScore = performances.Any()
                ? Math.Round(
                    performances
                        .GroupBy(p => p.UserId) // Группируем по студенту
                        .Select(g =>
                            g.GroupBy(p => p.Subject.SubjectName) // Группируем по предмету
                             .Average(s => (s.Sum(p => p.Score) / maxScorePerSubject) * 100)) // Процент за каждый предмет, затем среднее по предметам
                        .Average(), // Среднее по всем студентам
                    2) // Округляем до двух знаков
                : 0;

            teacher.AverageStudentAttendance = attendances.Any()
                ? Math.Round(attendances.Average(a => a.Status == "+" ? 1.0 : 0.0) * 100, 2): 0;

            teacher.ScientificPublicationCount = publications.Count;

            teacher.CountSubject = performances.Select(p => p.SubjectId).Distinct().Count();
            teacher.CountGroup = performances
                .Where(p => p.User?.Student != null)
                .Select(p => p.User.Student.GroupId)
                .Distinct()
                .Count();


            return teacher;
        }

        public async Task<List<StudentInfoDTO>> GetMyStudents(int userId, CancellationToken cancellationToken)
        {
            var students = await teacherRepository.GetAllStudentForTeacher(userId, cancellationToken);

            if (!students.Any())
                return [];

            return students.Select(s => new StudentInfoDTO
            {
                FullName = s.FullName,
                Email = s.User.Email,
            }).ToList();
        }
    }
}
