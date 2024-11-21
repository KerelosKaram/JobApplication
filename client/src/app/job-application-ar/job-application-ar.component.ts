import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobApplicationArService } from '../services/job-application-ar.service';

@Component({
  selector: 'app-job-application-ar',
  templateUrl: './job-application-ar.component.html',
  styleUrls: ['./job-application-ar.component.scss']
})
export class JobApplicationArComponent {
  jobApplicationFormAr: FormGroup;
  militaryStatuses: string[] = ['إعفاء', 'إنتهاء', 'مؤجل', 'غير مكتمل'];
  availableLanguages: string[] = ['إنجليزي', 'عربي', 'فرنسي', 'إسباني', 'ألماني'];
  martialStatuses: string[] = ["أعزب", "متزوج", "مطلق", "أرمل"];
  driverLicenses: string[] = ["لا يوجد", "رخصة قيادة خاصة", "رخصة قيادة مهنية - درجة أولى", "رخصة قيادة مهنية - درجة ثانية", "رخصة قيادة مهنية - درجة ثالثة", "رخصة قيادة دراجة نارية", "رخصة قيادة مركبات ثقيلة", "رخصة قيادة مؤقتة", "رخصة قيادة دولية"];
  sourceOfKnowledgeAboutTheCompany: string[] = ['لينكدإن', 'إنديد', 'فيسبوك', 'تم الإحالة من موظف حالي', 'معرض التوظيف', 'حدث مهني', 'إعلان وظيفة من مجموعة محددة', 'أخرى'];
  selectedLanguages: string[] = [];
  currentEmployerIndex: number = -1; // Track the index of the experience marked as "Currently Employed"

  constructor(
    private fb: FormBuilder,
    private jobApplicationArService: JobApplicationArService,
    private router: Router
  ) {
    this.jobApplicationFormAr = this.fb.group({
      positionApplied: ['', Validators.required],//
      fullName: ['', Validators.required],//
      address: ['', Validators.required],//
      phone: ['', Validators.required],//
      email: [''],//
      birthDate: ['', Validators.required],//
      martialStatus: ['', Validators.required],//
      startDate: [null, Validators.required],//
      idNo: ['', Validators.required],//
      expectedSalary: [''],//
      militaryStatus: ['', Validators.required],//
      degree: ['', Validators.required],//
      major: ['', Validators.required],//
      languages: [''],//
      courses: [''],//
      driverLicense: [''],//
      sourceOfKnowledgeAboutTheCompany: [''],//
      workedHereBefore: [''],//
      chronicDiseases: [''],//
      relativesWorkingInTheCompany: [''],//
      workExperiences: this.fb.array([this.createExperience()]), // Initialize with one experience form group
    });
  }

  ngOnInit(): void {
    // Retain existing initialization
  }

  get workExperiences() {
    return this.jobApplicationFormAr.get('workExperiences') as FormArray;
  }

  createExperience(): FormGroup {
    return this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      salary: [''],
      reasonForLeaving: [''],
      currentEmployer: [false] // Add "Currently Employed" toggle
    });
  }

  addExperience(): void {
    this.workExperiences.push(this.createExperience());
  }

  removeExperience(index: number): void {
    this.workExperiences.removeAt(index);
    if (this.currentEmployerIndex === index) {
      this.currentEmployerIndex = -1;
    }
  }

  toggleCurrentEmployer(index: number): void {
    if (this.currentEmployerIndex === index) {
      this.currentEmployerIndex = -1;
    } else {
      this.currentEmployerIndex = index;
    }

    this.workExperiences.controls.forEach((experience, i) => {
      const endDateControl = experience.get('endDate');
      const currentEmployerControl = experience.get('currentEmployer');
      if (i === this.currentEmployerIndex) {
        endDateControl?.disable();
        endDateControl?.setValue('');
        currentEmployerControl?.setValue(true);
      } else {
        endDateControl?.enable();
        currentEmployerControl?.setValue(false);
      }
    });
  }

  toggleLanguage(language: string): void {
    const index = this.selectedLanguages.indexOf(language);
    if (index === -1) {
      this.selectedLanguages.push(language);
    } else {
      this.selectedLanguages.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.jobApplicationFormAr.valid) {
      const applicationData = this.jobApplicationFormAr.value;
  
      const formData = new FormData();
      formData.append('PositionApplied', applicationData.positionApplied || '');
      formData.append('FullName', applicationData.fullName || '');
      formData.append('Address', applicationData.address || '');
      formData.append('Phone', applicationData.phone || '');
      formData.append('MartialStatus', applicationData.martialStatus || '');
      formData.append('Email', applicationData.email || '');
      formData.append('StartDate', applicationData.startDate || '');
      formData.append('IdNo', applicationData.idNo || '');
      formData.append('ExpectedSalary', applicationData.expectedSalary || '');
      formData.append('MilitaryStatus', applicationData.militaryStatus || '');
      formData.append('University', applicationData.university || '');
      formData.append('Degree', applicationData.degree || '');
      formData.append('Major', applicationData.major || '');
      formData.append('PostGraduationStudies', applicationData.postGraduationStudies || '');
      formData.append('Languages', this.selectedLanguages.join(',')); // Ensure it's a comma-separated string
      formData.append('Courses', applicationData.courses || '');
      formData.append('DriverLicense', applicationData.driverLicense || '');
      formData.append('SourceOfKnowledgeAboutTheCompany', applicationData.sourceOfKnowledgeAboutTheCompany || '');
      formData.append('WorkedHereBefore', applicationData.workedHereBefore || '');
      formData.append('ChronicDiseases', applicationData.chronicDiseases || '');
      formData.append('RelativesWorkingInTheCompany', applicationData.relativesWorkingInTheCompany || '');
      formData.append('WorkExperiences', JSON.stringify(applicationData.workExperiences));
      console.log(applicationData.workExperiences);
      this.jobApplicationArService.submitJobApplication(formData)
        .subscribe(
          response => {
            console.log('Application submitted successfully:', response);
            this.router.navigate(['/job-application/success']);
          },
          error => {
            console.error('Error submitting application:', error);
            if (error.error && error.error.errors) {
              Object.keys(error.error.errors).forEach(key => {
                console.error(`${key}: ${error.error.errors[key].join(', ')}`);
              });
            }
          }
        );
    } else {
      console.error('Form is invalid. Ensure all required fields are filled.');
    }
  }
}
