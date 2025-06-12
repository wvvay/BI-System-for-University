using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface IFacultyRepository
    {
        Task<Faculty?> GetByIdAsync(int facultyId);
        Task AddAsync(Faculty faculty);

        Task<Faculty?> GetByNameAsync(string facultyName);
    }
}
