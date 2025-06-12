using System;
using System.Collections.Generic;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class StudentRiskDTO
    {
        public int StudentId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string GroupName { get; set; } = string.Empty;
        public double AverageGrade { get; set; }
        public double AttendanceRate { get; set; }
        public List<SubjectRiskDTO> SubjectRisks { get; set; } = new();
        public List<string> RiskFactors { get; set; } = new();
        public DateTimeOffset LastUpdateDate { get; set; }
    }

    public class SubjectRiskDTO
    {
        public string SubjectName { get; set; } = string.Empty;
        public double AverageScore { get; set; }
        public double AttendanceRate { get; set; }
        public List<string> RiskFactors { get; set; } = new();
    }
} 