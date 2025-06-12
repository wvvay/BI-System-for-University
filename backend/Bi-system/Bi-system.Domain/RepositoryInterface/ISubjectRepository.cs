using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface ISubjectRepository
    {
        Task<Subject?> GetByIdAsync(int subjectId);
        Task AddAsync(Subject subject);

        Task<Subject?> GetByNameAsync(string subjectName);
    }
}
