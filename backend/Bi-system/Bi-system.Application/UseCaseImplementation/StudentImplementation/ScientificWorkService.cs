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
using System.Threading;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.StudentImplementation
{
    public class ScientificWorkService(IScientificWorkMapper scientificWorkMapper,
                                        IUserRepository userRepository,
                                        IScientificWorkRepository scientificWorkRepository) 
                                        : IScientificWorkService
    {
        public async Task AddScientificWorkAsync(CreateScientificWorkDTO createScientificWorkDTO)
        {
            // Поиск пользователя
            var user = await userRepository.GetByEmailAsync(createScientificWorkDTO.Email);
            if (user == null)
                throw new Exception("Пользователь с таким email не найден");

            // Маппинг и установка внешних ключей
            var scientificWork = scientificWorkMapper.MapToEntity(createScientificWorkDTO);
            scientificWork.UserId = user.UserId;


            await scientificWorkRepository.AddAsync(scientificWork);
        }

        public async Task<List<ScientificWorkDTO>> ExecuteAsync(int userId, CancellationToken cancellationToken)
        {
            var works = await scientificWorkRepository.GetByUserIdAsync(userId, cancellationToken);
            return works.Select(scientificWorkMapper.MapToDto).ToList();
        }
    }
}
