using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.Auth
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }
}
