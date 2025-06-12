using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.MappingInterface
{
    public interface IAcademicPerformanceMapper
    {
        AcademicPerformanceDTO MapToDto(AcademicPerformance academicPerformance);
        AcademicPerformanceForTeacherDTO MapToForTeacherDto(AcademicPerformance academicPerformance);
        AcademicPerformance MapToEntity(CreateAcademicPerformanceDTO createAcademicPerformanceDTO);


        AcademicPerformanceResultDTO MapToDto(AcademicPerformanceResult academicPerformanceResult);
        AcademicPerformanceResultForTeacherDTO MapToForTeacherDto(AcademicPerformanceResult academicPerformanceResult);
        AcademicPerformanceResult MapToEntity(CreateAcademicPerformanceResultDTO createAcademicPerformanceResultDTO);
    }
}
