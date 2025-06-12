using Bi_system.Application.DTOs.AuthDTOs;
using Bi_system.Application.UseCaseInterface.Auth;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.AuthImplementation
{
    public class AuthService(IUserRepository _userRepository,
                        IJwtTokenGenerator _tokenGenerator) : IAuthService
    {
        public async Task<LoginResponseDto?> AuthenticateAsync(LoginRequestDto request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return null;
            }

            var token = _tokenGenerator.GenerateToken(user);
            return new LoginResponseDto { Token = token };
        }
    }
}
