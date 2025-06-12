using Bi_system.Application.DTOs.AI;
using Bi_system.Application.UseCaseInterface.AIInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bi_system.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly IAIChatService _chatService;

        public AIController(IAIChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> ChatWithAI([FromBody] ChatRequestDto request, CancellationToken cancellationToken)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _chatService.GetAIResponseAsync(request, userId);
            return Ok(response);
        }
    }
}
