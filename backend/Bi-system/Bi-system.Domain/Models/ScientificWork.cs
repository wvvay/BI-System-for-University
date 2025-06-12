using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models
{
    public class ScientificWork
    {
        public int ScientificWorkId { get; set; }
        public int UserId { get; set; }
        public string NamePublication { get; set; } = string.Empty;
        public int YearPublication { get; set; }
        public string CategoryPublication { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;

        public User User { get; set; } = null!;

    }
}
