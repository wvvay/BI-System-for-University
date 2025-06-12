using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface ITeacherRepository
    {
        Task<Teacher?> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
        Task AddAsync(Teacher teacher);

        Task<List<Student>> GetAllStudentForTeacher(int userId, CancellationToken cancellationToken);

    }
}
