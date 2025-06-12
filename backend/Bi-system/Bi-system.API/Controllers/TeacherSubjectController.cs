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
    public class TeacherSubjectController(ITeacherSubjectService teacherSubjectService): ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var subject = await teacherSubjectService.GetByIdAsync(id);

            if (subject == null)
            {
                return NotFound();
            }
            return Ok(subject);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTeacherSubjectDTO createTeacherSubjectDTO)
        {
            // Проверка на null
            if (createTeacherSubjectDTO == null)
            {
                return BadRequest("Тело запроса не может быть пустым.");
            }

            await teacherSubjectService.AddAsync(createTeacherSubjectDTO);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createTeacherSubjectDTO.Email },
                createTeacherSubjectDTO
             );

        }
    }
}
