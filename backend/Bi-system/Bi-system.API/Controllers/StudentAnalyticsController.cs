using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.UseCaseInterface.AIInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Bi_system.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudentAnalyticsController : ControllerBase
    {
        private readonly IStudentDataAnalysisService _studentDataAnalysisService;

        public StudentAnalyticsController(IStudentDataAnalysisService studentDataAnalysisService)
        {
            _studentDataAnalysisService = studentDataAnalysisService;
        }

        [HttpGet("/getallinfo")]
        public async Task<ActionResult<StudentAnalyticsDTO>> GetStudentAnalytics(CancellationToken cancellationToken)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var analytics = await _studentDataAnalysisService.GetStudentAnalyticsAsync(userId, cancellationToken);
                return Ok(analytics);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
} 