using Bi_system.Application.DTOs.AI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.AIInterface
{
    public interface IAIChatService
    {
        Task<ChatResponseDto> GetAIResponseAsync(ChatRequestDto request, int userId);
    }
}
