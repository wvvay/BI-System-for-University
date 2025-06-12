using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.Student
{
    public class StudentService(IStudentRepository studentRepository,
                                IStudentMapper studentMapper,
                                IUserRepository userRepository,
                                IGroupRepository groupRepository,
                                IFacultyRepository facultyRepository) : IStudentService
    {
        public async Task AddStudentAsync(CreateStudentDTO createStudentDTO)
        {
            // Поиск пользователя
            var user = await userRepository.GetByEmailAsync(createStudentDTO.Email);
            if (user == null)
                throw new Exception("Пользователь с таким email не найден");

            // Поиск группы
            var group = await groupRepository.GetByNameAsync(createStudentDTO.GroupName);
            if (group == null)
                throw new Exception("Группа с таким названием не найдена");

            // Поиск факультета
            var faculty = await facultyRepository.GetByNameAsync(createStudentDTO.FacultyName);
            if (faculty == null)
                throw new Exception("Факультет с таким названием не найден");

            // Маппинг и установка внешних ключей
            var student = studentMapper.MapToEntity(createStudentDTO);
            student.UserId = user.UserId;
            student.GroupId = group.GroupId;
            student.FacultyId = faculty.FacultyId;


            await studentRepository.AddAsync(student);
        }


        //public async Task AddStudentAsync(CreateStudentDTO createStudentDTO)
        //{
        //    var student = studentMapper.MapToEntity(createStudentDTO);
        //    await studentRepository.AddAsync(student);
        //}

        public async Task<StudentDTO?> ExecuteAsync(int userId, CancellationToken cancellationToken)
        {
            var student = await studentRepository.GetByUserIdAsync(userId, cancellationToken);
            return student is not null ? studentMapper.MapToDto(student) : null;
        }

        //public async Task<StudentDTO?> GetStudentByIdAsync(int id)
        //{
        //    var student = await studentRepository.GetByIdAsync(id);
        //    return student == null ? null : studentMapper.MapToDto(student);
        //}
    }
}
