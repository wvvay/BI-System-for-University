using Bi_system.Application.DTOs.StudentDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.StudentInterface
{
    public interface ITeacherSubjectService
    {
        Task<TeacherSubjectDTO?> GetByIdAsync(int teacherSubjectId);
        Task AddAsync(CreateTeacherSubjectDTO createTeacherSubjectDTO);
    }
}
