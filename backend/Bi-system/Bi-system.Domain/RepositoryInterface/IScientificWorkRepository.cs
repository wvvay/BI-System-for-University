using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace Bi_system.Domain.RepositoryInterface
{
    public interface IScientificWorkRepository
    {
        Task<List<ScientificWork>> GetByUserIdAsync(int userId, CancellationToken cancellationToken);
        Task AddAsync(ScientificWork scientificWork);
        Task<List<ScientificWork>> GetAllForGroupAsync(int groupId, CancellationToken cancellationToken);
    }
}
