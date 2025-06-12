using Bi_system.Application.DTOs.StudentDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.StudentInterface
{
    public interface IStudentService
    {
        Task<StudentDTO?> ExecuteAsync(int userId, CancellationToken cancellationToken);
        Task AddStudentAsync(CreateStudentDTO createStudentDTO);
    }
}
