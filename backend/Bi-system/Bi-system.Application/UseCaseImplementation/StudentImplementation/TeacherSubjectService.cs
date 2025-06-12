using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingImplementation;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.StudentImplementation
{
    public class TeacherSubjectService(ITeacherSubjectMapper teacherSubjectMapper,
                                       ITeacherSubjectRepository teacherSubjectRepository,
                                       IUserRepository userRepository,
                                       ISubjectRepository subjectRepository,
                                       ITeacherRepository teacherRepository
                                       ): ITeacherSubjectService
    {
        public async  Task AddAsync(CreateTeacherSubjectDTO createTeacherSubjectDTO)
        {
            // Поиск пользователя
            var user = await userRepository.GetByEmailAsync(createTeacherSubjectDTO.Email);
            if (user == null)
                throw new Exception("Пользователь с таким email не найден");

            // Поиск преподавателя
            var teacher = await teacherRepository.GetByUserIdAsync(user.UserId, CancellationToken.None);
            if (teacher == null)
                throw new Exception("Преподаватель с таким пользователем не найден");

            // Поиск предмета
            var subject = await subjectRepository.GetByNameAsync(createTeacherSubjectDTO.SubjectName);
            if (subject == null)
                throw new Exception("Предмет с таким названием не найден");

            // Маппинг и установка внешних ключей
            var teacherSubject = teacherSubjectMapper.MapToEntity(createTeacherSubjectDTO);
            teacherSubject.TeacherId = teacher.TeacherId;
            teacherSubject.SubjectId = subject.SubjectId;

            await teacherSubjectRepository.AddAsync(teacherSubject);
        }

        public async Task<TeacherSubjectDTO?> GetByIdAsync(int teacherSubjectId)
        {
            var teacherSubject = await teacherSubjectRepository.GetByIdAsync(teacherSubjectId);
            return teacherSubject == null ? null : teacherSubjectMapper.MapToDto(teacherSubject);
        }
    }
}
