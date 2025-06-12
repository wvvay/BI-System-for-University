using Bi_system.Domain.Models;
using Bi_system.Infrastructure.Configurations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Infrastructure.DatabaseContext
{
    public class BiDbContext : DbContext
    {
        public BiDbContext(DbContextOptions<BiDbContext> options)
            : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<TeacherSubject> TeacherSubjects { get; set; }
        public DbSet<TeacherGroup> TeacherGroups { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<AcademicPerformance> AcademicPerformances { get; set; }
        public DbSet<AcademicPerformanceResult> AcademicPerformancesResults { get; set; }
        public DbSet<ScientificWork> ScientificWorks { get; set; }
        public DbSet<Faculty> Faculty { get; set; }
        public DbSet<DeviceSession> DeviceSessions { get; set; }    

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(BiDbContext).Assembly);
        }
    }
}
