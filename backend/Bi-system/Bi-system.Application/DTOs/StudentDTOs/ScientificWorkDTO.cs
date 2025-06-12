using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.DTOs.StudentDTOs
{
    public class ScientificWorkDTO
    {
        public string NamePublication { get; set; } = string.Empty;
        public int YearPublication { get; set; }
        public string CategoryPublication { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;

    }
}
