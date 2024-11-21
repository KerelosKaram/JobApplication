using System.Text.Json;
using API.Data;
using Microsoft.AspNetCore.Mvc;

namespace JobApplicationTest.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobApplicationController : ControllerBase
    {
        private readonly AppDbContext _ctx;

        public JobApplicationController(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitForm([FromForm] JobApplicationDto jobApplicationDto, [FromForm] string WorkExperiences)
        {
            Console.WriteLine(WorkExperiences);
            if (jobApplicationDto == null)
            {
                return BadRequest("Form data is not submitted.");
            }

            try
            {
                // Manually deserialize WorkExperiences from JSON string to List<WorkExperienceDto>
                if (!string.IsNullOrEmpty(WorkExperiences))
                {
                    var workExperiences = new List<WorkExperienceDto>();
                    var experiencesArray = JsonSerializer.Deserialize<List<JsonElement>>(WorkExperiences);

                    foreach (var item in experiencesArray)
                    {
                        workExperiences.Add(new WorkExperienceDto
                        {
                            Company = item.GetProperty("company").GetString(),
                            Position = item.GetProperty("position").GetString(),
                            StartDate = DateTime.Parse(item.GetProperty("startDate").GetString()).Date,
                            
                            // Use Nullable<DateTime> (DateTime?)
                              EndDate = item.TryGetProperty("endDate", out var endDate) && endDate.ValueKind != JsonValueKind.Null 
                                ? DateTime.Parse(endDate.GetString()) .Date
                                : (DateTime?)null,
                            
                            Salary = int.Parse(item.GetProperty("salary").GetString()),
                            ReasonForLeaving = item.GetProperty("reasonForLeaving").GetString(),

                            // Set CurrentEmployer based on whether EndDate has a value
                            CurrentEmployed = item.TryGetProperty("endDate", out var endDateCheck) && endDateCheck.ValueKind != JsonValueKind.Null 
                                ? "No" 
                                : "Yes"
                        });
                    }

                    // Assign the deserialized WorkExperiences to jobApplicationDto
                    jobApplicationDto.WorkExperiences = workExperiences;
                }

                // File upload handling (if applicable)
                string cvFilePath = null;
                if (jobApplicationDto.CvFile != null && jobApplicationDto.CvFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    cvFilePath = Path.Combine(uploadsFolder, $"{Guid.NewGuid()}_{jobApplicationDto.CvFile.FileName}");
                    using (var stream = new FileStream(cvFilePath, FileMode.Create))
                    {
                        await jobApplicationDto.CvFile.CopyToAsync(stream);
                    }
                }

                // Map the JobApplicationDto to JobApplication entity
                var jobApplication = new JobApplication
                {
                    PositionApplied = jobApplicationDto.PositionApplied,
                    FullName = jobApplicationDto.FullName,
                    Address = jobApplicationDto.Address,
                    BirthDate = jobApplicationDto.BirthDate,
                    Phone = jobApplicationDto.Phone,
                    Email = jobApplicationDto.Email,
                    MartialStatus = jobApplicationDto.MartialStatus,
                    StartDate = jobApplicationDto.StartDate,
                    IdNo = jobApplicationDto.IdNo,
                    ExpectedSalary = jobApplicationDto.ExpectedSalary,
                    MilitaryStatus = jobApplicationDto.MilitaryStatus,
                    University = jobApplicationDto.University,
                    Degree = jobApplicationDto.Degree,
                    Major = jobApplicationDto.Major,
                    PostGraduationStudies = jobApplicationDto.PostGraduationStudies,
                    Languages = jobApplicationDto.Languages,
                    Courses = jobApplicationDto.Courses,
                    SourceOfKnowledgeAboutTheCompany = jobApplicationDto.SourceOfKnowledgeAboutTheCompany,
                    WorkedHereBefore = jobApplicationDto.WorkedHereBefore,
                    ChronicDiseases = jobApplicationDto.ChronicDiseases,
                    RelativesWorkingInTheCompany = jobApplicationDto.RelativesWorkingInTheCompany,
                    CvFilePath = cvFilePath // Store the file path
                };

                // If there are work experiences, map them as well
                if (jobApplicationDto.WorkExperiences != null && jobApplicationDto.WorkExperiences.Any())
                {
                    jobApplication.WorkExperiences = jobApplicationDto.WorkExperiences.Select(weDto => new WorkExperience
                    {
                        Company = weDto.Company,
                        Position = weDto.Position,
                        StartDate = weDto.StartDate,
                        EndDate = weDto.EndDate,
                        Salary = weDto.Salary,
                        ReasonForLeaving = weDto.ReasonForLeaving,
                        CurrentEmployed = weDto.CurrentEmployed,
                    }).ToList();
                }

                // Add the JobApplication entity to the database
                _ctx.JobApplications.Add(jobApplication);
                await _ctx.SaveChangesAsync();

                return Ok(new { Message = "Job application submitted successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
