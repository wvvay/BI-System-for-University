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
    public class ScientificWorkConfiguration : IEntityTypeConfiguration<ScientificWork>
    {
        public void Configure(EntityTypeBuilder<ScientificWork> builder)
        {
            builder.HasKey(sw => sw.ScientificWorkId);
            builder.Property(sw => sw.NamePublication).IsRequired().HasMaxLength(300);
            builder.Property(sw => sw.YearPublication).IsRequired();
            builder.Property(sw => sw.CategoryPublication).HasMaxLength(100);

            builder.HasOne(sw => sw.User)
                   .WithMany(u => u.ScientificWorks)
                   .HasForeignKey(sw => sw.UserId);
        }
    }
}
