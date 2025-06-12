using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.UseCaseImplementation.Student;
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
    public class TeacherController(ITeacherService teacherService): ControllerBase
    {
        [Authorize(Roles = "Teacher")]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyInfo(CancellationToken cancellationToken)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var teacherDto = await teacherService.ExecuteAsync(userId, cancellationToken);

            if (teacherDto == null)
                return NotFound();

            return Ok(teacherDto);
        }
        [Authorize(Roles = "Teacher")]
        [HttpGet("my-subjects")]
        public async Task<IActionResult> GetMySubjects(CancellationToken cancellationToken)
        {
            var UserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await teacherService.GetMySubjects(UserId, cancellationToken);

            if (result == null || result.Count == 0)
                return NotFound(new { message = "Нет предметов" });

            return Ok(result);
        }
        [Authorize(Roles = "Teacher")]
        [HttpGet("my-groups")]
        public async Task<IActionResult> GetMyGroups(CancellationToken cancellationToken)
        {
            var UserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await teacherService.GetMyGroups(UserId, cancellationToken);

            if (result == null || result.Count == 0)
                return NotFound(new { message = "Нет групп" });

            return Ok(result);
        }



        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] CreateTeacherDTO createTeacherDTO)
        {
            try
            {
                await teacherService.AddAsync(createTeacherDTO);
                return Ok(new { message = "Преподаватель успешно добавлен." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [Authorize(Roles = "Teacher")]
        [HttpGet("kpi")]
        public async Task<IActionResult> GetMyKpi(CancellationToken cancellationToken)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var teacherDto = await teacherService.GetKPIDTO(userId, cancellationToken);

            if (teacherDto == null)
                return NotFound();

            return Ok(teacherDto);
        }

        [Authorize(Roles = "Teacher")]
        [HttpGet("my-students")]
        public async Task<IActionResult> GetMyStudentsT(CancellationToken cancellationToken)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var students = await teacherService.GetMyStudents(userId, cancellationToken);

            if (students == null || students.Count == 0)
                return NotFound(new { message = "У вас нет прикреплённых студентов" });

            return Ok(students);
        }
    }
}
