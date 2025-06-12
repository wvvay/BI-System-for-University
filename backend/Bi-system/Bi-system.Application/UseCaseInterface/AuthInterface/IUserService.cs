using Bi_system.Application.DTOs.AuthDTOs;
using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.AuthInterface
{
    public interface IUserService
    {
        Task<bool> ChangePasswordAsync(string email, string newPassword, CancellationToken cancellationToken);
    }
}
