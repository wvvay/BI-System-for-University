using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models
{
    public class AcademicPerformance
    {
        public int AcademicPerformanceId { get; set; }
        public int UserId { get; set; }
        public int SubjectId { get; set; }
        public DateTimeOffset Date { get; set; }
        public int Score { get; set; }
        public int Semester { get; set; }


        public User User { get; set; } = null!;
        public Subject Subject { get; set; } = null!;
    }
}
