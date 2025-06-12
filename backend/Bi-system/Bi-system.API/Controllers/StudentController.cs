using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bi_system.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController(IStudentService studentService) : ControllerBase
    {
        [Authorize(Roles = "Teacher,Student")]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyInfo(CancellationToken cancellationToken)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var studentDto = await studentService.ExecuteAsync(userId, cancellationToken);

            if (studentDto == null)
                return NotFound();

            return Ok(studentDto);
        }
        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetById(int id)
        //{
        //    var student = await studentService.GetStudentByIdAsync(id);
        //    if (student == null) { 
        //        return NotFound();
        //    }
        //    return Ok(student);
        //}

        //[HttpPost]
        //public async Task<IActionResult>
        //    Create([FromBody] CreateStudentDTO createStudentDTO)
        //{
        //    await studentService.AddStudentAsync(createStudentDTO);
        //    return CreatedAtAction(nameof(GetMyInfo), new { id = createStudentDTO.FullName}, createStudentDTO);

        //}
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] CreateStudentDTO createStudentDTO)
        {
            try
            {
                await studentService.AddStudentAsync(createStudentDTO);
                return Ok(new { message = "Студент успешно добавлен." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
