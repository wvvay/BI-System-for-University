using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.QRcodeInterface;
using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.QRcodeImplementation
{
    public class AttendanceQrService(
        IAttendanceMapper attendanceMapper,
        IAttendancesRepository attendancesRepository,
        IUserRepository userRepository,
        ISubjectRepository subjectRepository
    ) : IAttendanceQrService 
    {
        private readonly string SecretKey = Environment.GetEnvironmentVariable("SECRET_KEY") ?? throw new InvalidOperationException("SECRET_KEY is not set");
        
        public async Task<string> MarkAttendanceAsync(string token, string studentEmail)
        {
            if (!ValidateToken(token, out var payload))
                return "Invalid or tampered token";

            var subjectName = payload.SubjectName;
            var date = new DateTimeOffset(payload.Date.UtcDateTime, TimeSpan.Zero);


            var user = await userRepository.GetByEmailAsync(studentEmail);
            if (user == null) return "Student not found";
            Console.WriteLine(studentEmail);
            

            var subject = await subjectRepository.GetByNameAsync(subjectName);
            Console.WriteLine(subjectName);
            if (subject == null) return "Subject not found";


            var exists = await attendancesRepository.
                ExistsWithinTimeframeAsync(user.UserId, subject.SubjectId, date, TimeSpan.FromMinutes(80));
            if (exists) return "Attendance has already been noted within 80 minutes";

            var dto = new CreateAttendanceDTO
            {
                Email = studentEmail,
                SubjectName = subjectName,
                Date = date,
                Status = "+",
                Semester = payload.Semester
            };

            var attendance = attendanceMapper.MapToEntity(dto);
            attendance.User = user;
            attendance.Subject = subject;

            await attendancesRepository.AddAsync(attendance);

            return "Attendance marked successfully";
        }

        public async Task<string> GenerateToken(string subjectName, DateTimeOffset date, int semester)
        {

            var subject = await subjectRepository.GetByNameAsync(subjectName);
            if (subject == null) return "Subject not found";

            var dateUtc = new DateTimeOffset(date.UtcDateTime, TimeSpan.Zero);
            var payload = $"{subject.SubjectName}|{dateUtc:yyyy-MM-dd HH:mm:ss}|{semester}";

            var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(SecretKey));
            var hash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(payload)));

            var token = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{payload}|{hash}"));
            return token;
        }

        public bool ValidateToken(string token, out QrPayload? payload)
        {
            payload = null;

            try
            {
                var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(token));
                var parts = decoded.Split('|');
                if (parts.Length != 4) // Т.к. теперь 4 части: subject, date, semester, hash
                    return false;

                var subject = parts[0];
                if (!DateTime.TryParseExact(parts[1], "yyyy-MM-dd HH:mm:ss", null, System.Globalization.DateTimeStyles.None, out var parsedDateTime))
                    return false;

                var parsedDate = new DateTimeOffset(parsedDateTime, TimeSpan.Zero);
                if (!int.TryParse(parts[2], out var semester))
                    return false;

                var hash = parts[3];
                var originalPayload = $"{subject}|{parsedDate:yyyy-MM-dd HH:mm:ss}|{semester}";

                var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(SecretKey));
                var expectedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(originalPayload)));

                if (hash != expectedHash)
                    return false;

                payload = new QrPayload
                {
                    SubjectName = subject,
                    Date = parsedDate,
                    Semester = semester
                };

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
