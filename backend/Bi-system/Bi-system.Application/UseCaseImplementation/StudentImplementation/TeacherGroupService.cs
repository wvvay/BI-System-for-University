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
    public class TeacherGroupService (ITeacherGroupRepository teacherGroupRepository,
                                      IUserRepository userRepository,
                                      IGroupRepository groupRepository,
                                      ITeacherGroupMapper teacherGroupMapper,
                                      ITeacherRepository teacherRepository): ITeacherGroupService
    {
        public async Task AddAsync(CreateTeacherGroupDTO createTeacherGroupDTO)
        {
            // Поиск пользователя
            var user = await userRepository.GetByEmailAsync(createTeacherGroupDTO.Email);
            if (user == null)
                throw new Exception("Пользователь с таким email не найден");

            // Поиск преподавателя
            var teacher = await teacherRepository.GetByUserIdAsync(user.UserId, CancellationToken.None);
            if (teacher == null)
                throw new Exception("Преподаватель с таким пользователем не найден");

            // Поиск группы
            var group = await groupRepository.GetByNameAsync(createTeacherGroupDTO.GroupName);
            if (group == null)
                throw new Exception("Группа с таким названием не найдена");

            // Маппинг и установка внешних ключей
            var teacherGroup = teacherGroupMapper.MapToEntity(createTeacherGroupDTO);
            teacherGroup.TeacherId = teacher.TeacherId;
            teacherGroup.GroupId = group.GroupId;

            await teacherGroupRepository.AddAsync(teacherGroup);
        }

        public async Task<TeacherGroupDTO?> GetByIdAsync(int teacherGroupId)
        {
            var teacherGroup = await teacherGroupRepository.GetByIdAsync(teacherGroupId);
            return teacherGroup == null ? null : teacherGroupMapper.MapToDto(teacherGroup);
        }
    }
}
