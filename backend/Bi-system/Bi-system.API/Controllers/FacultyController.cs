using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.UseCaseImplementation.Student;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bi_system.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class FacultyController(IFacultyService facultyService): ControllerBase
    {

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var faculty = await facultyService.GetByIdAsync(id);

            if (faculty == null)
            {
                return NotFound();
            }
            return Ok(faculty);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFacultyDTO createFacultyDTO)
        {
            // Проверка на null
            if (createFacultyDTO == null)
            {
                return BadRequest("Тело запроса не может быть пустым.");
            }

            await facultyService.AddGroupAsync(createFacultyDTO);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createFacultyDTO.FacultyName },
                createFacultyDTO
             );

        }
    }
}
