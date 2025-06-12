using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.AIInterface;
using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.AIImplementation
{
    public class StudentDataAnalysisService : IStudentDataAnalysisService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IStudentMapper _studentMapper;
        private readonly IAcademicPerformanceRepository _academicPerformanceRepository;
        private readonly IAcademicPerformanceResultRepository _academicPerformanceResultRepository;
        private readonly IAttendancesRepository _attendanceRepository;
        private readonly IScientificWorkRepository _scientificWorkRepository;
        private readonly ITeacherRepository _teacherRepository;

        private const double MIN_AVERAGE_SCORE = 3.0;
        private const double MIN_ATTENDANCE_RATE = 0.7;

        public StudentDataAnalysisService(
            IStudentRepository studentRepository,
            IStudentMapper studentMapper,
            IAcademicPerformanceRepository academicPerformanceRepository,
            IAcademicPerformanceResultRepository academicPerformanceResultRepository,
            IAttendancesRepository attendanceRepository,
            IScientificWorkRepository scientificWorkRepository,
            ITeacherRepository teacherRepository)
        {
            _studentRepository = studentRepository;
            _studentMapper = studentMapper;
            _academicPerformanceRepository = academicPerformanceRepository;
            _academicPerformanceResultRepository = academicPerformanceResultRepository;
            _attendanceRepository = attendanceRepository;
            _scientificWorkRepository = scientificWorkRepository;
            _teacherRepository = teacherRepository;
        }

        public async Task<List<StudentRiskDTO>> GetStudentsAtRiskAsync(int teacherId, CancellationToken cancellationToken)
        {
            var students = await _teacherRepository.GetAllStudentForTeacher(teacherId, cancellationToken);
            var result = new List<StudentRiskDTO>();

            // Получаем список предметов преподавателя
            var teacherSubjects = await _academicPerformanceRepository.GetAllForTeacherUserIdAsync(teacherId, cancellationToken);
            var teacherSubjectIds = teacherSubjects
                .Select(ap => ap.SubjectId)
                .Distinct()
                .ToList();

            foreach (var student in students)
            {
                var academicPerformances = await _academicPerformanceRepository.GetByUserIdAsync(student.UserId, cancellationToken);
                var attendances = await _attendanceRepository.GetByUserIdAsync(student.UserId, cancellationToken);

                // Фильтруем только предметы преподавателя
                var teacherStudentPerformances = academicPerformances
                    .Where(ap => teacherSubjectIds.Contains(ap.SubjectId))
                    .ToList();

                var teacherStudentAttendances = attendances
                    .Where(a => teacherSubjectIds.Contains(a.SubjectId))
                    .ToList();

                var averageScore = teacherStudentPerformances.Any() 
                    ? teacherStudentPerformances.Average(ap => ap.Score) 
                    : 0;

                var totalClasses = teacherStudentAttendances.Count;
                var attendedClasses = teacherStudentAttendances.Count(a => a.Status == "+");
                var attendanceRate = totalClasses > 0 
                    ? (double)attendedClasses / totalClasses 
                    : 0;

                var riskFactors = new List<string>();
                var subjectRisks = new List<SubjectRiskDTO>();

                // Анализ по предметам преподавателя
                var performancesBySubject = teacherStudentPerformances
                    .GroupBy(ap => ap.Subject.SubjectName)
                    .ToList();

                var attendancesBySubject = teacherStudentAttendances
                    .GroupBy(a => a.Subject.SubjectName)
                    .ToList();

                foreach (var subjectGroup in performancesBySubject)
                {
                    var subjectName = subjectGroup.Key;
                    var subjectPerformances = subjectGroup.ToList();
                    var subjectAttendances = attendancesBySubject
                        .FirstOrDefault(g => g.Key == subjectName)?
                        .ToList() ?? new List<Attendance>();

                    var subjectAverageScore = subjectPerformances.Any()
                        ? subjectPerformances.Average(p => p.Score)
                        : 0;

                    var subjectTotalClasses = subjectAttendances.Count;
                    var subjectAttendedClasses = subjectAttendances.Count(a => a.Status == "+");
                    var subjectAttendanceRate = subjectTotalClasses > 0
                        ? (double)subjectAttendedClasses / subjectTotalClasses
                        : 0;

                    var subjectRiskFactors = new List<string>();

                    if (subjectAverageScore < MIN_AVERAGE_SCORE)
                    {
                        subjectRiskFactors.Add($"Низкий средний балл: {subjectAverageScore:F2}");
                    }

                    if (subjectAttendanceRate < MIN_ATTENDANCE_RATE)
                    {
                        subjectRiskFactors.Add($"Низкая посещаемость: {subjectAttendanceRate:P0}");
                    }

                    // Анализ динамики оценок по предмету
                    var recentScores = subjectPerformances
                        .OrderByDescending(ap => ap.Date)
                        .Take(5)
                        .ToList();

                    if (recentScores.Count >= 2)
                    {
                        var scoreTrend = recentScores
                            .Select((ap, index) => new { Score = ap.Score, Index = index })
                            .ToList();

                        var isDeclining = scoreTrend
                            .Skip(1)
                            .All(x => x.Score < scoreTrend[x.Index - 1].Score);

                        if (isDeclining)
                        {
                            subjectRiskFactors.Add("Отрицательная динамика оценок");
                        }
                    }

                    if (subjectRiskFactors.Any())
                    {
                        subjectRisks.Add(new SubjectRiskDTO
                        {
                            SubjectName = subjectName,
                            AverageScore = subjectAverageScore,
                            AttendanceRate = subjectAttendanceRate,
                            RiskFactors = subjectRiskFactors
                        });
                    }
                }

                if (averageScore < MIN_AVERAGE_SCORE)
                {
                    riskFactors.Add($"Низкий средний балл: {averageScore:F2}");
                }

                if (attendanceRate < MIN_ATTENDANCE_RATE)
                {
                    riskFactors.Add($"Низкая посещаемость: {attendanceRate:P0}");
                }

                if (riskFactors.Any() || subjectRisks.Any())
                {
                    result.Add(new StudentRiskDTO
                    {
                        StudentId = student.StudentId,
                        FullName = student.FullName,
                        GroupName = student.Group.GroupName,
                        AverageGrade = averageScore,
                        AttendanceRate = attendanceRate,
                        SubjectRisks = subjectRisks,
                        RiskFactors = riskFactors,
                        LastUpdateDate = DateTimeOffset.UtcNow
                    });
                }
            }

            return result;
        }

        public async Task<StudentAnalyticsDTO> GetStudentAnalyticsAsync(int userId, CancellationToken cancellationToken)
        {
            var student = await _studentRepository.GetByUserIdAsync(userId, cancellationToken);
            if (student == null)
                throw new Exception("Студент не найден");

            var analytics = new StudentAnalyticsDTO
            {
                StudentInfo = _studentMapper.MapToDto(student)
            };

            // Получаем все оценки студента
            var performances = await _academicPerformanceRepository.GetByUserIdAsync(userId, cancellationToken);
            var results = await _academicPerformanceResultRepository.GetByUserIdAsync(userId, cancellationToken);

            // Получаем оценки одногруппников
            var groupPerformances = await _academicPerformanceRepository.GetAllForTeacherUserIdAsync(userId, cancellationToken);
            var groupResults = await _academicPerformanceResultRepository.GetAllForTeacherUserIdAsync(userId, cancellationToken);

            // Анализ средних баллов по предметам и семестрам
            analytics.SubjectAverages = CalculateSubjectAverages(performances, results);

            // Анализ динамики успеваемости
            analytics.PerformanceTrends = CalculatePerformanceTrends(performances, results);

            // Выявление слабых мест
            analytics.WeakSubjects = IdentifyWeakSubjects(performances, results, groupPerformances, groupResults);

            // Сравнение с одногруппниками
            analytics.GroupComparison = CompareWithGroup(performances, results, groupPerformances, groupResults);

            // Анализ посещаемости
            var attendances = await _attendanceRepository.GetByUserIdAsync(userId, cancellationToken);
            analytics.AttendanceAnalytics = AnalyzeAttendance(attendances);

            // Анализ публикаций
            var publications = await _scientificWorkRepository.GetByUserIdAsync(userId, cancellationToken);
            var groupPublications = await _scientificWorkRepository.GetAllForGroupAsync(student.GroupId, cancellationToken);
            analytics.PublicationAnalytics = AnalyzePublications(publications, groupPublications);

            return analytics;
        }

        private List<SubjectAverageScoreDTO> CalculateSubjectAverages(
            List<AcademicPerformance> performances,
            List<AcademicPerformanceResult> results)
        {
            var averages = new List<SubjectAverageScoreDTO>();

            // Группируем по предметам и семестрам
            var groupedPerformances = performances
                .GroupBy(p => new { p.Subject.SubjectName, p.Semester })
                .Select(g => new SubjectAverageScoreDTO
                {
                    SubjectName = g.Key.SubjectName,
                    Semester = g.Key.Semester,
                    AverageScore = g.Any() ? g.Average(p => p.Score) : 0
                });

            var groupedResults = results
                .GroupBy(r => new { r.Subject.SubjectName, r.Semester })
                .Select(g => new SubjectAverageScoreDTO
                {
                    SubjectName = g.Key.SubjectName,
                    Semester = g.Key.Semester,
                    AverageScore = g.Any() ? g.Average(r => r.Result) : 0
                });

            averages.AddRange(groupedPerformances);
            averages.AddRange(groupedResults);

            return averages;
        }

        private List<PerformanceTrendDTO> CalculatePerformanceTrends(
            List<AcademicPerformance> performances,
            List<AcademicPerformanceResult> results)
        {
            var trends = new List<PerformanceTrendDTO>();

            // Анализируем динамику по семестрам
            var performanceBySemester = performances
                .OrderBy(p => p.Semester)
                .GroupBy(p => p.Subject.SubjectName)
                .Select(g =>
                {
                    var scores = g.OrderBy(p => p.Semester).ToList();
                    var trends = new List<PerformanceTrendDTO>();

                    for (int i = 1; i < scores.Count; i++)
                    {
                        var current = scores[i];
                        var previous = scores[i - 1];
                        var changePercentage = previous.Score != 0 
                            ? ((current.Score - previous.Score) / previous.Score) * 100 
                            : 0;

                        trends.Add(new PerformanceTrendDTO
                        {
                            SubjectName = current.Subject.SubjectName,
                            Semester = current.Semester,
                            Score = current.Score,
                            PreviousScore = previous.Score,
                            ChangePercentage = changePercentage
                        });
                    }

                    return trends;
                })
                .SelectMany(t => t);

            trends.AddRange(performanceBySemester);

            return trends;
        }

        private List<WeakSubjectDTO> IdentifyWeakSubjects(
            List<AcademicPerformance> performances,
            List<AcademicPerformanceResult> results,
            List<AcademicPerformance> groupPerformances,
            List<AcademicPerformanceResult> groupResults)
        {
            var weakSubjects = new List<WeakSubjectDTO>();

            // Определяем средние баллы по предметам для студента
            var studentAverages = performances
                .GroupBy(p => p.Subject.SubjectName)
                .Select(g => new
                {
                    SubjectName = g.Key,
                    AverageScore = g.Any() ? g.Average(p => p.Score) : 0
                });

            // Определяем средние баллы по предметам для группы
            var groupAverages = groupPerformances
                .GroupBy(p => p.Subject.SubjectName)
                .Select(g => new
                {
                    SubjectName = g.Key,
                    AverageScore = g.Any() ? g.Average(p => p.Score) : 0
                });

            // Находим предметы, где балл студента значительно ниже среднего по группе
            foreach (var studentAvg in studentAverages)
            {
                var groupAvg = groupAverages.FirstOrDefault(g => g.SubjectName == studentAvg.SubjectName);
                if (groupAvg != null && groupAvg.AverageScore != 0)
                {
                    var differencePercentage = ((groupAvg.AverageScore - studentAvg.AverageScore) / groupAvg.AverageScore) * 100;
                    if (differencePercentage > 10) // Если разница более 10%
                    {
                        weakSubjects.Add(new WeakSubjectDTO
                        {
                            SubjectName = studentAvg.SubjectName,
                            AverageScore = studentAvg.AverageScore,
                            GroupAverageScore = groupAvg.AverageScore,
                            DifferencePercentage = differencePercentage
                        });
                    }
                }
            }

            return weakSubjects;
        }

        private GroupComparisonDTO CompareWithGroup(
            List<AcademicPerformance> performances,
            List<AcademicPerformanceResult> results,
            List<AcademicPerformance> groupPerformances,
            List<AcademicPerformanceResult> groupResults)
        {
            var studentAverageScore = performances.Any() 
                ? performances.Average(p => p.Score) 
                : 0;

            var groupAverageScore = groupPerformances.Any()
                ? groupPerformances.Average(p => p.Score)
                : 0;

            // Определяем ранг студента в группе
            var studentScores = groupPerformances
                .GroupBy(p => p.UserId)
                .Select(g => g.Average(p => p.Score))
                .OrderByDescending(s => s)
                .ToList();

            var studentRank = studentScores.Any() 
                ? studentScores.IndexOf(studentAverageScore) + 1 
                : 1;
            var totalStudents = studentScores.Count;
            var percentile = totalStudents > 0 
                ? (double)studentRank / totalStudents * 100 
                : 100;

            return new GroupComparisonDTO
            {
                StudentAverageScore = studentAverageScore,
                GroupAverageScore = groupAverageScore,
                StudentRank = studentRank,
                TotalStudents = totalStudents,
                Percentile = percentile
            };
        }

        private AttendanceAnalyticsDTO AnalyzeAttendance(List<Attendance> attendances)
        {
            var analytics = new AttendanceAnalyticsDTO();

            if (!attendances.Any())
                return analytics;

            // Общий процент посещаемости
            analytics.OverallAttendancePercentage = attendances
                .Average(a => a.Status == "+" ? 100 : 0);

            // Анализ по предметам
            analytics.SubjectAttendance = attendances
                .GroupBy(a => a.Subject.SubjectName)
                .Select(g => new SubjectAttendanceDTO
                {
                    SubjectName = g.Key,
                    TotalClasses = g.Count(),
                    AttendedClasses = g.Count(a => a.Status == "+"),
                    AttendancePercentage = g.Any() 
                        ? (double)g.Count(a => a.Status == "+") / g.Count() * 100 
                        : 0
                })
                .ToList();

            // Анализ пропусков
            analytics.Absences = attendances
                .Where(a => a.Status != "+")
                .Select(a => new AbsenceDTO
                {
                    Date = a.Date,
                    SubjectName = a.Subject.SubjectName,
                    Semester = a.Semester
                })
                .ToList();

            return analytics;
        }

        private PublicationAnalyticsDTO AnalyzePublications(
            List<ScientificWork> publications,
            List<ScientificWork> groupPublications)
        {
            var analytics = new PublicationAnalyticsDTO
            {
                TotalPublications = publications.Count
            };

            // Анализ по годам
            analytics.PublicationsByYear = publications
                .GroupBy(p => p.YearPublication)
                .Select(g => new YearlyPublicationDTO
                {
                    Year = g.Key,
                    PublicationCount = g.Count()
                })
                .ToList();

            // Анализ по категориям
            analytics.PublicationsByCategory = publications
                .GroupBy(p => p.CategoryPublication)
                .Select(g => new CategoryPublicationDTO
                {
                    Category = g.Key,
                    PublicationCount = g.Count()
                })
                .ToList();

            // Среднее количество публикаций в группе
            var uniqueStudents = groupPublications.Select(p => p.UserId).Distinct().Count();
            analytics.GroupAveragePublications = uniqueStudents > 0
                ? (double)groupPublications.Count / uniqueStudents
                : 0;

            return analytics;
        }
    }
}

