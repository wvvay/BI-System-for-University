using Bi_system.Application.UseCaseInterface.StudentInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bi_system.API.Controllers
{
    [Authorize(Roles = "Teacher,Admin,Student")]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MeController(
        IStudentService studentService,
        ITeacherService teacherService
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetMyInfo(CancellationToken cancellationToken)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (role == "Student")
            {
                var studentDto = await studentService.ExecuteAsync(userId, cancellationToken);
                if (studentDto == null)
                    return NotFound("Студент не найден.");

                return Ok(new
                {
                    role = "Student",
                    data = studentDto
                });
            }
            else if (role == "Teacher")
            {
                var teacherDto = await teacherService.ExecuteAsync(userId, cancellationToken);
                if (teacherDto == null)
                    return NotFound("Преподаватель не найден.");

                return Ok(new
                {
                    role = "Teacher",
                    data = teacherDto
                });
            }

            return Forbid("Роль не поддерживается.");
        }
    }
}
