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
    public class DeviceSessionConfiguration: IEntityTypeConfiguration<DeviceSession>
    {
        public void Configure(EntityTypeBuilder<DeviceSession> builder)
        {
            builder.HasKey(d => d.DeviceSessionId);
            
            builder.HasIndex(d => d.DeviceId)
                .IsUnique();
            
            builder.HasOne(s => s.User)
               .WithOne(u => u.DeviceSession)
               .HasForeignKey<DeviceSession>(s => s.UserId);
        }
    }
}
