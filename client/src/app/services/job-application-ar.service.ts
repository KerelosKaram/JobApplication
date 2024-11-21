import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationArService {
  private apiUrl = 'https://localhost:5000/api/jobapplicationar'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // Submit a job application
  submitJobApplication(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
