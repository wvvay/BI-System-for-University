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
    public class SubjectController (ISubjectService subjectService): ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var subject = await subjectService.GetByIdAsync(id);

            if (subject == null)
            {
                return NotFound();
            }
            return Ok(subject);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSubjectDTO createSubjectDTO)
        {
            // Проверка на null
            if (createSubjectDTO == null)
            {
                return BadRequest("Тело запроса не может быть пустым.");
            }

            await subjectService.AddGroupAsync(createSubjectDTO);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createSubjectDTO.SubjectName },
                createSubjectDTO
             );

        }
    }
}
