using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface IStudentRepository
    {
        Task<Student?> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
        Task AddAsync(Student student);
    }
}
