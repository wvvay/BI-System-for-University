using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingImplementation;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.StudentImplementation
{
    public class SubjectService(ISubjectMapper subjectMapper,
                                ISubjectRepository subjectRepository): ISubjectService
    {
        public async Task AddGroupAsync(CreateSubjectDTO createSubjectDTO)
        {
            var subject = subjectMapper.MapToEntity(createSubjectDTO);
            await subjectRepository.AddAsync(subject);
        }

        public async Task<SubjectDTO?> GetByIdAsync(int subjectId)
        {
            var subject = await subjectRepository.GetByIdAsync(subjectId);
            return subject == null ? null : subjectMapper.MapToDto(subject);
        }
    }
}
