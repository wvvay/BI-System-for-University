using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingInterface;
using Bi_system.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.MappingImplementation
{
    public class AttendanceMapper : IAttendanceMapper
    {

        public AttendanceDTO MapToDto(Attendance attendance)
        {
            return new AttendanceDTO
            {
                SubjectName = attendance.Subject.SubjectName,
                Status = attendance.Status,
                Date = attendance.Date,
                Semester = attendance.Semester,
            };
        }

        public Attendance MapToEntity(CreateAttendanceDTO createAttendanceDTO)
        {
            return new Attendance
            {
                Status = createAttendanceDTO.Status,
                Date = createAttendanceDTO.Date,
                Semester = createAttendanceDTO.Semester
            };
        }

        public AttendanceForTeacherDTO MapToForTeacherDto(Attendance attendance)
        {
            return new AttendanceForTeacherDTO
            {
                StudentFullName = attendance.User.Student.FullName,
                GradebookNumber = attendance.User.Student.GradebookNumber,
                GroupName = attendance.User.Student.Group.GroupName,
                SubjectName = attendance.Subject.SubjectName,
                Status = attendance.Status,
                Date = attendance.Date,
                Semester = attendance.Semester,
            };
        }
    }
}
