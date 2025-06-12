using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface ITeacherSubjectRepository
    {
        Task<TeacherSubject?> GetByIdAsync(int teacherSubjectId);
        Task AddAsync(TeacherSubject teacherSubject);

        Task<List<TeacherSubject>> GetTeacherSubjectsAsync(int teacherId);
    }
}
