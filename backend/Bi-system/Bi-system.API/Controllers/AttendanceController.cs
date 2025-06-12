using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.UseCaseImplementation.StudentImplementation;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bi_system.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController(IAttendanceService attendanceService) : ControllerBase
    {
        [Authorize(Roles = "Teacher,Student")]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyAttendance(CancellationToken cancellationToken)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var attendance = await attendanceService.ExecuteAsync(userId, cancellationToken);

            if (attendance == null)
                return NotFound();

            return Ok(attendance);
        }

        [Authorize(Roles = "Teacher")]
        [HttpGet("teacher")]
        public async Task<IActionResult> GetAttendanceForTeacher(CancellationToken cancellationToken)
        {
            var teacherUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await attendanceService.GetForTeacherAsync(teacherUserId, cancellationToken);

            if (result == null || result.Count == 0)
                return NotFound(new { message = "Нет посещаемости по предметам преподавателя." });

            return Ok(result);
        }

        [Authorize(Roles = "Teacher")]
        [HttpGet("teacher-today-attendance")]
        public async Task<IActionResult> GetAttendanceForTeacherToday(CancellationToken cancellationToken)
        {
            var teacherUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await attendanceService.GetForTeacherTodayAsync(teacherUserId, cancellationToken);

            if (result == null || result.Count == 0)
                return NotFound(new { message = "Нет посещаемости по предметам преподавателя." });

            return Ok(result);
        }
        [Authorize(Roles = "Teacher,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateAttendance([FromBody] CreateAttendanceDTO createAttendanceDTO)
        {
            try
            {
                await attendanceService.AddAttendanceAsync(createAttendanceDTO);
                return Ok(new { message = "Успешно добавлен." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
