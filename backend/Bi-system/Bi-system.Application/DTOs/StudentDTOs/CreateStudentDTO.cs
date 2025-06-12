namespace Bi_system.Application.DTOs.StudentDTOs;

public class CreateStudentDTO
{

    public string Email { get; set; } = string.Empty; 
    public string FullName { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty; 
    public string GradebookNumber { get; set; } = string.Empty;
    public string FacultyName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTimeOffset DayOfBirth { get; set; }
    public int CourseYear { get; set; }
    public int Course { get; set; }
    public string DormitoryNumber { get; set; } = string.Empty;
    public int RoomNumber { get; set; }

}
