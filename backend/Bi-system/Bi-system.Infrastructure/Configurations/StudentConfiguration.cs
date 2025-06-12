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
    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {
            builder.HasKey(s => s.StudentId);

            builder.Property(s => s.FullName).IsRequired().HasMaxLength(200);
            builder.Property(s => s.GradebookNumber).IsRequired().HasMaxLength(20);
            builder.Property(s => s.PhoneNumber).HasMaxLength(20);
            builder.Property(s => s.DormitoryNumber).HasMaxLength(10);
            builder.Property(s => s.RoomNumber).HasMaxLength(10);
            builder.Property(s => s.CourseYear).IsRequired();

            builder.HasOne(s => s.User)
                   .WithOne(u => u.Student)
                   .HasForeignKey<Student>(s => s.UserId);

            builder.HasOne(s => s.Group)
                   .WithMany(g => g.Students)
                   .HasForeignKey(s => s.GroupId);

            builder.HasOne(s => s.Faculty)
                   .WithMany(f => f.Students)
                   .HasForeignKey(s => s.FacultyId);
        }
    }
}
