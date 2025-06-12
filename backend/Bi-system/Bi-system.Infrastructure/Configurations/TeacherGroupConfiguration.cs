using Bi_system.Domain.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Infrastructure.Configurations
{
    public class TeacherGroupConfiguration : IEntityTypeConfiguration<TeacherGroup>
    {
        public void Configure(EntityTypeBuilder<TeacherGroup> builder)
        {
            builder.HasKey(ts => ts.TeacherGroupId);

            builder.HasOne(ts => ts.Teacher)
                   .WithMany(t => t.TeacherGroups)
                   .HasForeignKey(ts => ts.TeacherId);

            builder.HasOne(ts => ts.Group)
                   .WithMany(s => s.TeacherGroups)
                   .HasForeignKey(ts => ts.GroupId);
        }
    }
}
