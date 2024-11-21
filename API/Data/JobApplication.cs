namespace API.Data
{
    public class JobApplication
    {
    public int Id { get; set; }
    public DateTime ApplicationSubmitDate { get; set; } = DateTime.Today;
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
    public ICollection<WorkExperience>? WorkExperiences { get; set; } = new List<WorkExperience>();  // Assuming WorkExperience is a class
    public string CvFilePath { get; set; }  // This will hold the file path
    }

    public class WorkExperience
    {
        public int Id { get; set; }
        public string Company { get; set; }
        public string Position { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? Salary { get; set; }
        public string ReasonForLeaving { get; set; }
        public string CurrentEmployed { get; set; }

        // Foreign key to JobApplication
        public int JobApplicationId { get; set; }
        public JobApplication JobApplication { get; set; } // Navigation property
    }
}