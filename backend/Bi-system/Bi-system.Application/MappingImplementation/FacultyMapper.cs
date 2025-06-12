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
    public class FacultyMapper : IFacultyMapper
    {
        public FacultyDTO MapToDto(Faculty faculty)
        {
            return new FacultyDTO
            {
                FacultyId = faculty.FacultyId,
                FacultyName = faculty.FacultyName,
            };
        }

        public Faculty MapToEntity(CreateFacultyDTO createFacultyDTO)
        {
            return new Faculty
            {

                FacultyName = createFacultyDTO.FacultyName,
            };
        }
    }
}
