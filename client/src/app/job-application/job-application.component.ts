import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { JobApplicationService } from '../services/job-application.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.scss']
})
export class JobApplicationComponent implements OnInit {
  jobApplicationForm: FormGroup;
  militaryStatuses: string[] = ['Exempt', 'Completed', 'Postponed', 'Not Completed'];
  martialStatuses: string[] = ['Single', 'Married', 'Widowed', 'Separated', 'Divorced'];
  sourceOfKnowledgeAboutTheCompany: string[] = ['LinkedIn', 'Indeed', 'Facebook', 'Referred by a current employee', 'Job fair', 'Career event', 'Job posting from a specific community or group', 'Other'];
  availableLanguages: string[] = ['English', 'Arabic', 'French', 'Spanish', 'German'];
  selectedLanguages: string[] = [];
  currentEmployerIndex: number = -1; // Track the index of the experience marked as "Currently Employed"
  uploadedCV: File | null = null; // Holds the uploaded CV file
  cvError: string | null = null; // Add the cvError property
  uploadedFileName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private jobApplicationService: JobApplicationService,
    private router: Router
  ) {
    this.jobApplicationForm = this.fb.group({
      positionApplied: ['', Validators.required],//
      fullName: ['', Validators.required],//
      address: ['', Validators.required],//
      birthDate: ['', Validators.required],//
      phone: ['', Validators.required],//
      email: ['', Validators.required],//
      martialStatus: ['', Validators.required],//
      startDate: [null, Validators.required],//
      idNo: ['', Validators.required],//
      expectedSalary: [''],//
      militaryStatus: ['', Validators.required],//
      university: ['', Validators.required],//
      degree: ['', Validators.required],//
      major: ['', Validators.required],//
      postGraduationStudies: [''],//
      languages: [''],//
      courses: [''],//
      sourceOfKnowledgeAboutTheCompany: [''],//
      workedHereBefore: [''],//
      chronicDiseases: [''],//
      relativesWorkingInTheCompany: [''],//
      workExperiences: this.fb.array([this.createExperience()]), // Initialize with one experience form group
      cv: ['']
    });
  }

  onWorkedAtCompanyChange(isYes: boolean): void {
    const companyDetailsControl = this.jobApplicationForm.get('companyDetails');
    
    if (isYes) {
      companyDetailsControl?.setValidators([Validators.required]);
    } else {
      companyDetailsControl?.clearValidators();
    }
    
    companyDetailsControl?.updateValueAndValidity();
  }

  ngOnInit(): void {
    // Retain existing initialization
  }

  get workExperiences() {
    return this.jobApplicationForm.get('workExperiences') as FormArray;
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

  onMilitaryStatusChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const militaryStatusDetailsControl = this.jobApplicationForm.get('militaryStatusDetails');
    
    if (isChecked) {
      militaryStatusDetailsControl?.setValidators([Validators.required]);
    } else {
      militaryStatusDetailsControl?.clearValidators();
    }
    
    militaryStatusDetailsControl?.updateValueAndValidity();
  }

  onCVUpload(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    this.cvError = null; // Reset error
    this.uploadedFileName = null; // Clear previous file name

    if (!file) {
      this.uploadedCV = null;
      return;
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      this.cvError = 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.cvError = 'File size exceeds 5 MB.';
      return;
    }

    this.uploadedCV = file;
    this.uploadedFileName = file.name;
  }

  onSubmit(): void {
    if (this.jobApplicationForm.valid) {
      const applicationData = this.jobApplicationForm.value;
  
      const formData = new FormData();
      formData.append('PositionApplied', applicationData.positionApplied || '');
      formData.append('FullName', applicationData.fullName || '');
      formData.append('Address', applicationData.address || '');
      formData.append('Phone', applicationData.phone || '');
      formData.append('Email', applicationData.email || '');
      formData.append('MartialStatus', applicationData.martialStatus || '');
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
      formData.append('SourceOfKnowledgeAboutTheCompany', applicationData.sourceOfKnowledgeAboutTheCompany || '');
      formData.append('WorkedHereBefore', applicationData.workedHereBefore || '');
      formData.append('ChronicDiseases', applicationData.chronicDiseases || '');
      formData.append('RelativesWorkingInTheCompany', applicationData.relativesWorkingInTheCompany || '');
      formData.append('CvFile', this.uploadedCV || ''); // Use correct key
      formData.append('WorkExperiences', JSON.stringify(applicationData.workExperiences));
      console.log(applicationData);
      console.log(applicationData.workExperiences);
      this.jobApplicationService.submitJobApplication(formData)
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
