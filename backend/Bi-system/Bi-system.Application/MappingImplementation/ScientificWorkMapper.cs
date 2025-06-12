using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingInterface;
using Bi_system.Domain.Models;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.MappingImplementation
{
    public class ScientificWorkMapper : IScientificWorkMapper
    {
        public ScientificWorkDTO MapToDto(ScientificWork scientificWork)
        {
            return new ScientificWorkDTO
            {
                CategoryPublication = scientificWork.CategoryPublication,
                NamePublication = scientificWork.NamePublication,
                YearPublication = scientificWork.YearPublication,
                Link = scientificWork.Link,
            };
        }

        public ScientificWork MapToEntity(CreateScientificWorkDTO createScientificWorkDTO)
        {
            return new ScientificWork
            {
                CategoryPublication = createScientificWorkDTO.CategoryPublication,
                NamePublication = createScientificWorkDTO.NamePublication,
                YearPublication = createScientificWorkDTO.YearPublication,
                Link = createScientificWorkDTO.Link,
            };
        }
    }
}
