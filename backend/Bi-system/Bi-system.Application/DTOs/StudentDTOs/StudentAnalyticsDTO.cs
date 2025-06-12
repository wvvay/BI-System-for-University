using System;
using System.Collections.Generic;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class StudentAnalyticsDTO
    {
        // Основная информация о студенте
        public StudentDTO StudentInfo { get; set; } = null!;

        // Средний балл по предметам и семестрам
        public List<SubjectAverageScoreDTO> SubjectAverages { get; set; } = new();

        // Динамика успеваемости
        public List<PerformanceTrendDTO> PerformanceTrends { get; set; } = new();

        // Слабые места (предметы с низкими оценками)
        public List<WeakSubjectDTO> WeakSubjects { get; set; } = new();

        // Сравнение с одногруппниками
        public GroupComparisonDTO GroupComparison { get; set; } = new();

        // Посещаемость
        public AttendanceAnalyticsDTO AttendanceAnalytics { get; set; } = new();

        // Публикации
        public PublicationAnalyticsDTO PublicationAnalytics { get; set; } = new();
    }

    public class SubjectAverageScoreDTO
    {
        public string SubjectName { get; set; } = string.Empty;
        public int Semester { get; set; }
        public double AverageScore { get; set; }
    }

    public class PerformanceTrendDTO
    {
        public string SubjectName { get; set; } = string.Empty;
        public int Semester { get; set; }
        public double Score { get; set; }
        public double PreviousScore { get; set; }
        public double ChangePercentage { get; set; }
    }

    public class WeakSubjectDTO
    {
        public string SubjectName { get; set; } = string.Empty;
        public double AverageScore { get; set; }
        public double GroupAverageScore { get; set; }
        public double DifferencePercentage { get; set; }
    }

    public class GroupComparisonDTO
    {
        public double StudentAverageScore { get; set; }
        public double GroupAverageScore { get; set; }
        public int StudentRank { get; set; }
        public int TotalStudents { get; set; }
        public double Percentile { get; set; }
    }

    public class AttendanceAnalyticsDTO
    {
        public double OverallAttendancePercentage { get; set; }
        public List<SubjectAttendanceDTO> SubjectAttendance { get; set; } = new();
        public List<AbsenceDTO> Absences { get; set; } = new();
    }

    public class SubjectAttendanceDTO
    {
        public string SubjectName { get; set; } = string.Empty;
        public double AttendancePercentage { get; set; }
        public int TotalClasses { get; set; }
        public int AttendedClasses { get; set; }
    }

    public class AbsenceDTO
    {
        public DateTimeOffset Date { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public int Semester { get; set; }
    }

    public class PublicationAnalyticsDTO
    {
        public int TotalPublications { get; set; }
        public List<YearlyPublicationDTO> PublicationsByYear { get; set; } = new();
        public List<CategoryPublicationDTO> PublicationsByCategory { get; set; } = new();
        public double GroupAveragePublications { get; set; }
    }

    public class YearlyPublicationDTO
    {
        public int Year { get; set; }
        public int PublicationCount { get; set; }
    }

    public class CategoryPublicationDTO
    {
        public string Category { get; set; } = string.Empty;
        public int PublicationCount { get; set; }
    }
} 