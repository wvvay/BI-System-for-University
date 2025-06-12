using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.QRcode
{
    public class GenerateTokenRequest
    {
        public string SubjectName { get; set; } = string.Empty;
        public DateTimeOffset Date { get; set; }
        public int Semester { get; set; }
    }
}
