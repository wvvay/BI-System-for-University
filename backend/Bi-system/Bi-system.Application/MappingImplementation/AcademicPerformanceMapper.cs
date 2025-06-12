using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingInterface;
using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.MappingImplementation
{
    public class AcademicPerformanceMapper : IAcademicPerformanceMapper
    {
        public AcademicPerformanceForTeacherDTO MapToForTeacherDto(AcademicPerformance academicPerformance)
        {
            return new AcademicPerformanceForTeacherDTO
            {
                StudentFullName = academicPerformance.User.Student.FullName,
                GradebookNumber = academicPerformance.User.Student.GradebookNumber,
                GroupName = academicPerformance.User.Student.Group.GroupName,
                SubjectName = academicPerformance.Subject.SubjectName,
                Score = academicPerformance.Score,
                Semester = academicPerformance.Semester,
                Date = academicPerformance.Date
            };
        }
        public AcademicPerformanceDTO MapToDto(AcademicPerformance academicPerformance)
        {
            return new AcademicPerformanceDTO
            {
                SubjectName = academicPerformance.Subject.SubjectName,
                Score = academicPerformance.Score,
                Date = academicPerformance.Date,
                Semester = academicPerformance.Semester
            };
        }

        public AcademicPerformance MapToEntity(CreateAcademicPerformanceDTO createAcademicPerformanceDTO)
        {
            return new AcademicPerformance
            {
                Score = createAcademicPerformanceDTO.Score,
                Date = createAcademicPerformanceDTO.Date,
                Semester = createAcademicPerformanceDTO.Semester,
            };
        }

        public AcademicPerformanceResultDTO MapToDto(AcademicPerformanceResult academicPerformanceResult)
        {
            return new AcademicPerformanceResultDTO
            {
                SubjectName = academicPerformanceResult.Subject.SubjectName,
                Result = academicPerformanceResult.Result,
                Date = academicPerformanceResult.Date,
                Semester = academicPerformanceResult.Semester
            };
        }

        public AcademicPerformanceResultForTeacherDTO MapToForTeacherDto(AcademicPerformanceResult academicPerformanceResult)
        {
            return new AcademicPerformanceResultForTeacherDTO
            {
                StudentFullName = academicPerformanceResult.User.Student.FullName,
                GradebookNumber = academicPerformanceResult.User.Student.GradebookNumber,
                GroupName = academicPerformanceResult.User.Student.Group.GroupName,
                SubjectName = academicPerformanceResult.Subject.SubjectName,
                Result = academicPerformanceResult.Result,
                Semester = academicPerformanceResult.Semester,
                Date = academicPerformanceResult.Date
            };
        }

        public AcademicPerformanceResult MapToEntity(CreateAcademicPerformanceResultDTO createAcademicPerformanceResultDTO)
        {
            return new AcademicPerformanceResult
            {
                Result = createAcademicPerformanceResultDTO.Result,
                Date = createAcademicPerformanceResultDTO.Date,
                Semester = createAcademicPerformanceResultDTO.Semester,
            };
        }
    }
}
