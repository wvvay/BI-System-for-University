using Bi_system.Application.DTOs.DeviceDTOs;
using Bi_system.Application.UseCaseInterface.DeviceInterface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bi_system.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceSessionController (IDeviceSessionService deviceSessionService): ControllerBase
    {
        [HttpPost("AddDevice")]
        public async Task<IActionResult> AddDeviceSession([FromBody] CreateDeviceSessionDTO createDeviceSessionDTO)
        {
            try
            {
                await deviceSessionService.AddDeviceAsync(createDeviceSessionDTO);
                return Ok(new { message = "Устройство успешно добавлена" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/DeviceSession/CheckSession
        [HttpGet("CheckSession")]
        public async Task<IActionResult> CheckDeviceSession([FromQuery] string deviceId, CancellationToken cancellationToken)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var exists = await deviceSessionService.GetBoolDeviceByIdAsync(deviceId, userId, cancellationToken);
                return Ok(exists);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/DeviceSession/ClearExpired
        [HttpDelete("ClearExpired")]
        public async Task<IActionResult> ClearExpiredSessions()
        {
            try
            {
                await deviceSessionService.ClearExpiredSessionsAsync();
                return NoContent(); // No content after successful deletion
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
