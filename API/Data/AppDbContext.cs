using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class AppDbContext : DbContext
    {

        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<WorkExperience> WorkExperiences { get; set; }
        public DbSet<JobApplicationAr> JobApplicationsAr { get; set; }
        public DbSet<WorkExperienceAr> WorkExperiencesAr { get; set; }

        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        // Ensure this constructor is present
        public AppDbContext() 
        {

        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<JobApplication>()
                .HasMany(m => m.WorkExperiences)
                .WithOne(o => o.JobApplication)
                .HasForeignKey(f => f.JobApplicationId);


            // modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }
    }
}