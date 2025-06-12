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
    public class AcademicPerformanceResultConfiguration : IEntityTypeConfiguration<AcademicPerformanceResult>
    {
        public void Configure(EntityTypeBuilder<AcademicPerformanceResult> builder)
        {
            builder.HasKey(a => a.AcademicPerformanceResultId);

            builder.Property(ap => ap.Date).IsRequired();
            builder.Property(ap => ap.Result).IsRequired();

            builder.HasOne(ap => ap.User)
                   .WithMany(u => u.AcademicPerformanceResults)
                   .HasForeignKey(ap => ap.UserId);

            builder.HasOne(ap => ap.Subject)
                   .WithMany(s => s.AcademicPerformanceResults)
                   .HasForeignKey(ap => ap.SubjectId);
        }
    }
}
