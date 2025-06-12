using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Domain.Models
{
    public class QrPayload
    {
        public string SubjectName { get; set; }
        public DateTimeOffset Date { get; set; }
        public int Semester {  get; set; }
    }
}
