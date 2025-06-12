using Bi_system.Application.DTOs.QRcode;
using Bi_system.Application.UseCaseInterface.QRcodeInterface;
using Bi_system.Domain.Models;
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
    public class QRcodeController (IAttendanceQrService _qrService): ControllerBase
    {
        [Authorize(Roles = "Teacher,Admin,Student")]
        [HttpPost("mark")]
        public async Task<IActionResult> MarkAttendance([FromBody] TokenAttendanceDTO dto)
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;

            var result = await _qrService.MarkAttendanceAsync(dto.Token, email);

            return result == "Attendance marked successfully"
                ? Ok(result)
                : BadRequest(result);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPost("generate-token")]
        public async Task<IActionResult> GenerateQrToken([FromBody] GenerateTokenRequest request)
        {

            var token = await _qrService.GenerateToken(request.SubjectName, request.Date, request.Semester);
            return Ok(new { token });
        }
    }
}
