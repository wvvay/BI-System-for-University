using Bi_system.Application.DTOs.StudentDTOs;
using Bi_system.Application.MappingImplementation;
using Bi_system.Application.MappingInterface;
using Bi_system.Application.UseCaseInterface.Student;
using Bi_system.Application.UseCaseInterface.StudentInterface;
using Bi_system.Domain.RepositoryInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bi_system.Application.UseCaseImplementation.StudentImplementation
{
    public class FacultyService(IFacultyRepository facultyRepository,
                            IFacultyMapper facultyMapper) : IFacultyService
    {

        public async Task AddGroupAsync(CreateFacultyDTO createFacultyDTO)
        {
            var faculty = facultyMapper.MapToEntity(createFacultyDTO);
            await facultyRepository.AddAsync(faculty);
        }

        public async Task<FacultyDTO?> GetByIdAsync(int facultyId)
        {
            var faculty = await facultyRepository.GetByIdAsync(facultyId);
            return faculty == null ? null : facultyMapper.MapToDto(faculty);
        }

    }
}
