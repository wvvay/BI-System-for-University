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
    public class SubjectMapper : ISubjectMapper
    {
        public SubjectDTO MapToDto(Subject subject)
        {
            return new SubjectDTO
            {
                SubjectId = subject.SubjectId,
                SubjectName = subject.SubjectName,
            };
        }

        public Subject MapToEntity(CreateSubjectDTO createSubjectDTO)
        {
            return new Subject
            {
                
                SubjectName = createSubjectDTO.SubjectName,
            };
        }
    }
}
