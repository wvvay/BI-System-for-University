using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseInterface.QRcodeInterface
{
    public interface IAttendanceQrService
    {
        Task<string> MarkAttendanceAsync(string token, string studentEmail);
        Task<string> GenerateToken(string subject, DateTimeOffset date, int semester);
    }
}
