using Bi_system.Application.DTOs.AuthDTOs;
using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingImplementation;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.AuthInterface;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BCrypt.Net.BCrypt;

namespace Bi_system.Application.UseCaseImplementation.AuthImplementation
{
    public class UserService(IUserRepository userRepository): IUserService
    {
        public async Task<bool> ChangePasswordAsync(string email, string newPassword, CancellationToken cancellationToken)
        {
            var user = await userRepository.GetByEmailAsync(email);
            if (user == null)
                throw new Exception("Пользователь с таким email не найден");
            
            user.Password = HashPassword(newPassword);

            await userRepository.UpdatePasswordAsync(user.UserId, cancellationToken, user.Password);
            return true;
        }
    }
}
