using Microsoft.Extensions.DependencyInjection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Bi_system.Application.UseCaseInterface.Student;
using Bi_system.Application.UseCaseImplementation.Student;
using Bi_system.Application.UseCaseInterface.Auth;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.MappingImplementation;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Bi_system.Application.UseCaseImplementation.StudentImplementation;
using Bi_system.Application.UseCaseImplementation.QRcodeImplementation;
using Bi_system.Application.UseCaseInterface.QRcodeInterface;
using Bi_system.Application.UseCaseImplementation.AuthImplementation;
using Bi_system.Application.UseCaseInterface.AuthInterface;
using Bi_system.Application.UseCaseInterface.DeviceInterface;
using Bi_system.Application.UseCaseImplementation.DeviceSessionImplementation;
using Bi_system.Application.UseCaseImplementation.AIImplementation;
using Bi_system.Application.UseCaseInterface.AIInterface;

namespace Bi_system.Application.DependencyInjection;

public static class ServiceContainer
{
    public static IServiceCollection AddApplicationService
        (this IServiceCollection services)
    {
        DotNetEnv.Env.Load();
        services.AddScoped<IStudentMapper, StudentMapper>();
        services.AddScoped<IStudentService, StudentService>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        services.AddScoped<IGroupMapper, GroupMapper>();
        services.AddScoped<IGroupService, GroupService>();

        services.AddScoped<IFacultyMapper, FacultyMapper>();
        services.AddScoped<IFacultyService, FacultyService>();

        services.AddScoped<ISubjectMapper, SubjectMapper>();
        services.AddScoped<ISubjectService, SubjectService>();

        services.AddScoped<IScientificWorkService, ScientificWorkService>();
        services.AddScoped<IScientificWorkMapper, ScientificWorkMapper>();

        services.AddScoped<IAcademicPerformanceMapper, AcademicPerformanceMapper>();
        services.AddScoped<IAcademicPerformanceService, AcademicPerformanceService>();
        
        services.AddScoped<IAttendanceMapper, AttendanceMapper>();
        services.AddScoped<IAttendanceService, AttendanceService>();

        services.AddScoped<ITeacherMapper, TeacherMapper>();
        services.AddScoped<ITeacherService, TeacherService>();

        services.AddScoped<ITeacherSubjectMapper, TeacherSubjectMapper>();
        services.AddScoped<ITeacherSubjectService, TeacherSubjectService>();

        services.AddScoped<ITeacherGroupMapper, TeacherGroupMapper>();
        services.AddScoped<ITeacherGroupService, TeacherGroupService>();

        services.AddScoped<IAttendanceQrService, AttendanceQrService>();
        
        services.AddScoped<IUserService, UserService>();

        services.AddScoped<IDeviceSessionMapper, DeviceSessionMapper>();
        services.AddScoped<IDeviceSessionService, DeviceSessionService>();

        services.AddHostedService<DeviceSessionCleanupService>();
        services.AddHttpClient<IAIChatService, AIChatService>(client =>
        {
            client.Timeout = TimeSpan.FromMinutes(5);
        });

        var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
        var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
        var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");

        // Проверка наличия всех переменных окружения
        if (string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtAudience) || string.IsNullOrEmpty(jwtKey))
        {
            throw new InvalidOperationException("JWT settings are not properly configured in the environment variables.");
        }

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });

        return services;
    }
}