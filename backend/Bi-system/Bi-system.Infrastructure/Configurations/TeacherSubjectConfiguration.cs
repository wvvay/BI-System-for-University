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
    public class TeacherSubjectConfiguration : IEntityTypeConfiguration<TeacherSubject>
    {
        public void Configure(EntityTypeBuilder<TeacherSubject> builder)
        {
            builder.HasKey(ts => ts.TeacherSubjectId);

            builder.HasOne(ts => ts.Teacher)
                   .WithMany(t => t.TeacherSubjects)
                   .HasForeignKey(ts => ts.TeacherId);

            builder.HasOne(ts => ts.Subject)
                   .WithMany(s => s.TeacherSubjects)
                   .HasForeignKey(ts => ts.SubjectId);
        }
    }
}
