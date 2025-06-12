using Bi_system.Application.DTOs.AuthDTOs;
using Bi_system.Application.UseCaseInterface.Auth;
using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static BCrypt.Net.BCrypt;

namespace Bi_system.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService, IUserRepository userRepository) : ControllerBase
    {


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var result = await authService.AuthenticateAsync(request);
            if (result == null)
            {
                return Unauthorized("Неверный email или пароль.");
            }

            return Ok(result);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var existing = await userRepository.GetByEmailAsync(request.Email);
            if (existing != null)
            {
                return Conflict("Пользователь с таким email уже существует.");
            }

            var newUser = new User
            {
                Email = request.Email,
                Password = HashPassword(request.Password),
                Role = request.Role,
                CreatedAt = DateTimeOffset.UtcNow
            };

            await userRepository.AddUserAsync(newUser);
            return Ok("Пользователь успешно зарегистрирован.");
        }
    }
}
