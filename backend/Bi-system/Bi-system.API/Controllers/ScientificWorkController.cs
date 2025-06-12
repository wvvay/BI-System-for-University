using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.UseCaseImplementation.Student;
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
    public class ScientificWorkController(IScientificWorkService scientificWorkService): ControllerBase
    {
        [Authorize(Roles = "Teacher,Student")]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyScientificWorks(CancellationToken cancellationToken)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var scientificWorkDto = await scientificWorkService.ExecuteAsync(userId, cancellationToken);

            if (scientificWorkDto == null)
                return NotFound();

            return Ok(scientificWorkDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateScientificWork([FromBody] CreateScientificWorkDTO createScientificWorkDTO)
        {
            try
            {
                await scientificWorkService.AddScientificWorkAsync(createScientificWorkDTO);
                return Ok(new { message = "Научная работа успешно добавлена." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

}
