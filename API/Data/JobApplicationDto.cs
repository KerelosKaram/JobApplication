namespace API.Data
{
    public class JobApplicationDto
    {
        public string PositionApplied { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public DateTime BirthDate { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string MartialStatus { get; set; }
        public DateTime StartDate { get; set; }
        public int IdNo { get; set; }
        public int? ExpectedSalary { get; set; }
        public string MilitaryStatus { get; set; }
        public string University { get; set; }
        public string Degree { get; set; }
        public string Major { get; set; }
        public string? PostGraduationStudies { get; set; }
        public string? Languages { get; set; }
        public string? Courses { get; set; }
        public string? SourceOfKnowledgeAboutTheCompany { get; set; }
        public string? WorkedHereBefore { get; set; }
        public string? ChronicDiseases { get; set; }
        public string? RelativesWorkingInTheCompany { get; set; }
        public IFormFile CvFile { get; set; }
        public List<WorkExperienceDto>? WorkExperiences { get; set; } // This will be set after deserialization
    }

    public class WorkExperienceDto
    {
        public string Company { get; set; }
        public string Position { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? Salary { get; set; }
        public string ReasonForLeaving { get; set; }
        public string CurrentEmployed { get; set; }
    }

}