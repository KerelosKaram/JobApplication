import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobApplicationComponent } from '../job-application/job-application.component';
import { SuccessComponent } from '../success/success.component';
import { JobApplicationArComponent } from '../job-application-ar/job-application-ar.component';

const routes: Routes = [
  { path: 'job-application', component: JobApplicationComponent },
  { path: 'job-application-ar', component: JobApplicationArComponent },
  { path: 'job-application/success', component: SuccessComponent },
  { path: '', redirectTo: '/job-application', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
