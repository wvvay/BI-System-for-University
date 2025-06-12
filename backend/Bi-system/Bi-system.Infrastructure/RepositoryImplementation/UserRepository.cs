using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using Bi_system.Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Infrastructure.RepositoryImplementation
{
    public class UserRepository(BiDbContext context) : IUserRepository
    {
        public async Task AddUserAsync(User user)
        {
            
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task UpdatePasswordAsync(int userId, CancellationToken cancellationToken, 
                                            string newHashedPassword)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
            if (user == null) return;

            user.Password = newHashedPassword;

            await context.SaveChangesAsync(cancellationToken);

        }
    }
}
