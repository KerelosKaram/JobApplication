import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { JobApplicationComponent } from './job-application/job-application.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SuccessComponent } from './success/success.component';
import { JobApplicationArComponent } from './job-application-ar/job-application-ar.component';

@NgModule({
  declarations: [
    AppComponent,
    JobApplicationComponent,
    JobApplicationArComponent,
    SuccessComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule, // Add ReactiveFormsModule here
    AppRoutingModule, // Add AppRoutingModule here
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
