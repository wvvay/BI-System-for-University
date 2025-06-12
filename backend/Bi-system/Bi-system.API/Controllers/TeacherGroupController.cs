using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.UseCaseImplementation.StudentImplementation;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bi_system.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherGroupController (ITeacherGroupService teacherGroupService): ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var group = await teacherGroupService.GetByIdAsync(id);

            if (group == null)
            {
                return NotFound();
            }
            return Ok(group);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTeacherGroupDTO createTeacherGroupDTO)
        {
            // Проверка на null
            if (createTeacherGroupDTO == null)
            {
                return BadRequest("Тело запроса не может быть пустым.");
            }

            await teacherGroupService.AddAsync(createTeacherGroupDTO);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createTeacherGroupDTO.Email },
                createTeacherGroupDTO
             );

        }
    }
}
