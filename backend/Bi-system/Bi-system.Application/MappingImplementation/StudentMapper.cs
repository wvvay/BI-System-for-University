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
    public class StudentMapper : IStudentMapper
    {
        public StudentDTO MapToDto(Student student)
        {
            return new StudentDTO
            {
                FullName = student.FullName,
                GroupName = student.Group.GroupName,
                GradebookNumber = student.GradebookNumber,
                FacultyName = student.Faculty.FacultyName,
                PhoneNumber = student.PhoneNumber,
                DayOfBirth = student.DayOfBirth,
                CourseYear = student.CourseYear,
                Course = student.Course,
                DormitoryNumber = student.DormitoryNumber,
                RoomNumber = student.RoomNumber
            };
        }

        public Student MapToEntity(CreateStudentDTO createStudentDTO)
        {
            return new Student
            {
                FullName = createStudentDTO.FullName,
                GradebookNumber = createStudentDTO.GradebookNumber,
                PhoneNumber = createStudentDTO.PhoneNumber,
                DayOfBirth = createStudentDTO.DayOfBirth,
                CourseYear = createStudentDTO.CourseYear,
                Course = createStudentDTO.Course,
                DormitoryNumber = createStudentDTO.DormitoryNumber,
                RoomNumber = createStudentDTO.RoomNumber,
            };
        }
    }
}
