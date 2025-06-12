using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.UseCaseImplementation.Student;
using Bi_system.Application.UseCaseInterface.Student;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Bi_system.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    
    public class GroupController(IGroupService groupService): ControllerBase
    {

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var group = await groupService.GetGroupByIdAsync(id);

            if (group == null) { 
                return NotFound();
            }
            return Ok(group);
        }

        //[Authorize(Roles ="Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateGroupDTO createGroupDTO)
        {
            // Проверка на null
            if (createGroupDTO == null)
            {
                return BadRequest("Тело запроса не может быть пустым.");
            }

            await groupService.AddGroupAsync(createGroupDTO);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createGroupDTO.GroupName},
                createGroupDTO
             );
                
        }

    }
}
