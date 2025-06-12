using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.UseCaseInterface.AIInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Bi_system.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudentAnalysisController : ControllerBase
    {
        private readonly IStudentDataAnalysisService _studentDataAnalysisService;

        public StudentAnalysisController(IStudentDataAnalysisService studentDataAnalysisService)
        {
            _studentDataAnalysisService = studentDataAnalysisService;
        }

        [HttpGet("at-risk")]
        public async Task<ActionResult<List<StudentRiskDTO>>> GetStudentsAtRisk(CancellationToken cancellationToken)
        {
            var teacherId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (teacherId == 0)
            {
                return Unauthorized();
            }

            var studentsAtRisk = await _studentDataAnalysisService.GetStudentsAtRiskAsync(teacherId, cancellationToken);
            return Ok(studentsAtRisk);
        }
    }
} 