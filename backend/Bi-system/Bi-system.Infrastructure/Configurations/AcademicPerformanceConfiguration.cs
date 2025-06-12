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
    public class AcademicPerformanceConfiguration : IEntityTypeConfiguration<AcademicPerformance>
    {
        public void Configure(EntityTypeBuilder<AcademicPerformance> builder)
        {
            builder.HasKey(ap => ap.AcademicPerformanceId);
            builder.Property(ap => ap.Date).IsRequired();
            builder.Property(ap => ap.Score).IsRequired();

            builder.HasOne(ap => ap.User)
                   .WithMany(u => u.AcademicPerformances)
                   .HasForeignKey(ap => ap.UserId);

            builder.HasOne(ap => ap.Subject)
                   .WithMany(s => s.AcademicPerformances)
                   .HasForeignKey(ap => ap.SubjectId);
        }
    }
}
