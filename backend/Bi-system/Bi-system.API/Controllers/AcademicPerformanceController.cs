using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.UseCaseImplementation.Student;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Bi_system.Domain.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bi_system.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AcademicPerformanceController(IAcademicPerformanceService academicPerformanceService) : ControllerBase
    {
        [Authorize(Roles = "Student")]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyAcademicPerformance(CancellationToken cancellationToken)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var academicPerformance = await academicPerformanceService.ExecuteAsync(userId, cancellationToken);

            if (academicPerformance == null)
                return NotFound();

            return Ok(academicPerformance);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpGet("teacher")]
        public async Task<IActionResult> GetAcademicPerformanceForTeacher(CancellationToken cancellationToken)
        {
            var teacherUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await academicPerformanceService.GetForTeacherAsync(teacherUserId, cancellationToken);

            if (result == null || result.Count == 0)
                return NotFound(new { message = "Нет оценок по предметам преподавателя." });

            return Ok(result);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPost("add")]
        public async Task<IActionResult> CreateAcademicPerformance([FromBody] CreateAcademicPerformanceDTO createAcademicPerformanceDTO)
        {
            try
            {
                await academicPerformanceService.AddAcademicPerformanceAsync(createAcademicPerformanceDTO);
                return Ok(new { message = "Успешно добавлен." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }




        [Authorize(Roles = "Student")]
        [HttpGet("me-Result")]
        public async Task<IActionResult> GetMyAcademicPerformanceResult(CancellationToken cancellationToken)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var academicPerformance = await academicPerformanceService.ExecuteResultAsync(userId, cancellationToken);

            if (academicPerformance == null)
                return NotFound();

            return Ok(academicPerformance);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpGet("teacher-Result")]
        public async Task<IActionResult> GetAcademicPerformanceResultForTeacher(CancellationToken cancellationToken)
        {
            var teacherUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await academicPerformanceService.GetForTeacherResultAsync(teacherUserId, cancellationToken);

            if (result == null || result.Count == 0)
                return NotFound(new { message = "Нет оценок по предметам преподавателя." });

            return Ok(result);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPost("add-result")]
        public async Task<IActionResult> CreateAcademicPerformanceResult([FromBody] CreateAcademicPerformanceResultDTO createAcademicPerformanceResultDTO)
        {
            try
            {
                await academicPerformanceService.AddAcademicPerformanceResultAsync(createAcademicPerformanceResultDTO);
                return Ok(new { message = "Успешно добавлен." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}
