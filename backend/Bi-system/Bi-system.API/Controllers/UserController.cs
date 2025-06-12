using Bi_system.Application.DTOs.AuthDTOs;
using Bi_system.Application.UseCaseInterface.AuthInterface;
using Bi_system.Domain.Models;
using Bi_system.Infrastructure.RepositoryImplementation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bi_system.API.Controllers
{
    [Authorize(Roles = "Teacher,Admin,Student")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService userService): ControllerBase
    {
        [HttpPost("update-password")]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdateUserPasswordDTO dto, CancellationToken cancellationToken)
        {
            var email = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrWhiteSpace(email))
                return Unauthorized("Пользователь не авторизован.");

            var result = await userService.ChangePasswordAsync(email, dto.Password, cancellationToken);
            if (!result)
                return NotFound("Пользователь не найден.");

            return Ok("Пароль успешно обновлён");
        }
    }
}
