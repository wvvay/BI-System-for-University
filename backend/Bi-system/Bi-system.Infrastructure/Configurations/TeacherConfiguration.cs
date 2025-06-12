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
    public class TeacherConfiguration : IEntityTypeConfiguration<Teacher>
    {
        public void Configure(EntityTypeBuilder<Teacher> builder)
        {
            builder.HasKey(t => t.TeacherId);

            builder.Property(t => t.FullName).IsRequired().HasMaxLength(200);
            builder.Property(t => t.Education).HasMaxLength(200);
            builder.Property(t => t.Post).HasMaxLength(100);
            builder.Property(t => t.Experience).IsRequired();

            builder.HasOne(t => t.User)
                   .WithOne(u => u.Teacher)
                   .HasForeignKey<Teacher>(t => t.UserId);

            builder.HasOne(t => t.Faculty)
                   .WithMany(f => f.Teachers)
                   .HasForeignKey(t => t.FacultyId);
        }
    }
}
