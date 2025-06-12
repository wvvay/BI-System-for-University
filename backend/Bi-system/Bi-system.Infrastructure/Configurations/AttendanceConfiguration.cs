using Bi_system.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Infrastructure.Configurations
{
    public class AttendanceConfiguration : IEntityTypeConfiguration<Attendance>
    {
        public void Configure(EntityTypeBuilder<Attendance> builder)
        {
            builder.HasKey(a => a.AttendanceId);
            builder.Property(a => a.Date).IsRequired();
            builder.Property(a => a.Status).IsRequired().HasMaxLength(50);

            builder.HasOne(ap => ap.User)
                   .WithMany(s => s.Attendances)
                   .HasForeignKey(ap => ap.UserId);


            builder.HasOne(a => a.Subject)
                   .WithMany(s => s.Attendances)
                   .HasForeignKey(a => a.SubjectId);
        }
    }
}
