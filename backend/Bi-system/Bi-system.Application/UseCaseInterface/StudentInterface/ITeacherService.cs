using Bi_system.Application.DTOs.StudentDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.StudentInterface
{
    public interface ITeacherService
    {
        Task<TeacherDTO?> ExecuteAsync(int userId, CancellationToken cancellationToken);

        Task<TeacherKPIDTO> GetKPIDTO(int userId, CancellationToken cancellationToken);

        Task <List<TeacherSubjectDTO>> GetMySubjects(int userId, CancellationToken cancellationToken);
        Task<List<TeacherGroupDTO>> GetMyGroups(int userId, CancellationToken cancellationToken);

        Task AddAsync(CreateTeacherDTO createTeacherDTO);

        Task<List<StudentInfoDTO>> GetMyStudents(int userId, CancellationToken cancellationToken);


    }
}
