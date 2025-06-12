using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using Bi_system.Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace Bi_system.Infrastructure.RepositoryImplementation
{
    public class ScientificWorkRepository : IScientificWorkRepository
    {
        private readonly BiDbContext _context;

        public ScientificWorkRepository(BiDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(ScientificWork scientificWork)
        {
            await _context.ScientificWorks.AddAsync(scientificWork);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ScientificWork>> GetByUserIdAsync(int userId, CancellationToken cancellationToken)
        {
            return await _context.ScientificWorks
                .Where(s => s.UserId == userId)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<ScientificWork>> GetAllForGroupAsync(int groupId, CancellationToken cancellationToken)
        {
            return await _context.ScientificWorks
                .Include(s => s.User)
                    .ThenInclude(u => u.Student)
                .Where(s => s.User.Student.GroupId == groupId)
                .ToListAsync(cancellationToken);
        }
    }
}
