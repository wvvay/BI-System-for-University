using Bi_system.Application.MappingImplementation;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseImplementation.AIImplementation;
using Bi_system.Application.UseCaseImplementation.Student;
using Bi_system.Application.UseCaseImplementation.StudentImplementation;
using Bi_system.Application.UseCaseInterface.AIInterface;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Bi_system.Domain.RepositoryInterface;
using Bi_system.Infrastructure.DatabaseContext;
using Bi_system.Infrastructure.RepositoryImplementation;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Bi_system.Domain.Models;

namespace Bi_system.Infrastructure.DependencyInjection;

public static class ServiceContainer
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        Env.Load();
        // Получение переменных из ENV
        var postgresUser = Environment.GetEnvironmentVariable("POSTGRES_USER");
        var postgresPassword = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
        var postgresDb = Environment.GetEnvironmentVariable("POSTGRES_DB");
        var postgresServer = Environment.GetEnvironmentVariable("POSTGRES_SERVER");
        var postgresPort = Environment.GetEnvironmentVariable("POSTGRES_PORT");
         
        var connectionString = $"Host={postgresServer};Port={postgresPort};Database={postgresDb};Username={postgresUser};Password={postgresPassword}";
        // Add Database Service
        services.AddDbContext<BiDbContext>(
            opt => opt.UseNpgsql(connectionString,
            b => b.MigrationsAssembly("Bi-system.Infrastructure")));

        services.AddAsyncInitializer<DbInit>();

        // Регистрация мапперов
        services.AddScoped<IStudentMapper, StudentMapper>();
        services.AddScoped<ITeacherMapper, TeacherMapper>();
        services.AddScoped<IAcademicPerformanceMapper, AcademicPerformanceMapper>();
        services.AddScoped<ITeacherSubjectMapper, TeacherSubjectMapper>();
        services.AddScoped<ITeacherGroupMapper, TeacherGroupMapper>();

        // Регистрация сервисов
        services.AddScoped<IStudentService, StudentService>();
        services.AddScoped<ITeacherService, TeacherService>();
        services.AddScoped<IAcademicPerformanceService, AcademicPerformanceService>();
        services.AddScoped<IAttendanceService, AttendanceService>();
        services.AddScoped<IStudentDataAnalysisService, StudentDataAnalysisService>();

        // Регистрация репозиториев
        services.AddScoped<IStudentRepository, StudentRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IGroupRepository, GroupRepository>();
        services.AddScoped<IFacultyRepository, FacultyRepository>();
        services.AddScoped<ISubjectRepository, SubjectRepository>();
        services.AddScoped<IScientificWorkRepository, ScientificWorkRepository>();
        services.AddScoped<IAcademicPerformanceRepository, AcademicPerformanceRepository>();
        services.AddScoped<IAcademicPerformanceResultRepository, AcademicPerformanceResultRepository>();
        services.AddScoped<IAttendancesRepository, AttendanceRepository>();
        services.AddScoped<ITeacherSubjectRepository, TeacherSubjectRepository>();
        services.AddScoped<ITeacherGroupRepository, TeacherGroupRepository>();
        services.AddScoped<ITeacherRepository, TeacherRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IDeviceSessionRepository, DeviceSessionRepository>();

        return services;    
    }
}
