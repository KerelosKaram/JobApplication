using System.Text.Json;
using API.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobApplicationArController : ControllerBase
    {
        private readonly AppDbContext _ctx;

        public JobApplicationArController(AppDbContext ctx)
        {
            _ctx = ctx;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitForm([FromForm] JobApplicationAr applicationAr, [FromForm] string WorkExperiences)
        {
            if (applicationAr == null)
            {
                return BadRequest(new { message = "Application data is null."});
            }
            try
            {
                // Manually deserialize WorkExperiences from JSON string to List<WorkExperienceDto>
                if (!string.IsNullOrEmpty(WorkExperiences))
                {
                    var workExperiences = new List<WorkExperienceAr>();
                    var experiencesArray = JsonSerializer.Deserialize<List<JsonElement>>(WorkExperiences);

                    foreach (var item in experiencesArray)
                    {
                        workExperiences.Add(new WorkExperienceAr
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
                    applicationAr.WorkExperiences = workExperiences;
                }
                
                // Map the JobApplicationDto to JobApplication entity
                var jobApplicationAr = new JobApplicationAr
                {
                    PositionApplied = applicationAr.PositionApplied,
                    FullName = applicationAr.FullName,
                    Address = applicationAr.Address,
                    Phone = applicationAr.Phone,
                    Email = applicationAr.Email,
                    BirthDate = applicationAr.BirthDate,
                    MartialStatus = applicationAr.MartialStatus,
                    StartDate = applicationAr.StartDate,
                    IdNo = applicationAr.IdNo,
                    ExpectedSalary = applicationAr.ExpectedSalary,
                    MilitaryStatus = applicationAr.MilitaryStatus,
                    Degree = applicationAr.Degree,
                    Major = applicationAr.Major,
                    Languages = applicationAr.Languages,
                    Courses = applicationAr.Courses,
                    DriverLicense = applicationAr.DriverLicense,
                    SourceOfKnowledgeAboutTheCompany = applicationAr.SourceOfKnowledgeAboutTheCompany,
                    WorkedHereBefore = applicationAr.WorkedHereBefore,
                    ChronicDiseases = applicationAr.ChronicDiseases,
                    RelativesWorkingInTheCompany = applicationAr.RelativesWorkingInTheCompany,
                };

                // If there are work experiences, map them as well
                if (applicationAr.WorkExperiences != null && applicationAr.WorkExperiences.Any())
                {
                    jobApplicationAr.WorkExperiences = applicationAr.WorkExperiences.Select(weDto => new WorkExperienceAr
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
                _ctx.JobApplicationsAr.Add(jobApplicationAr);
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
