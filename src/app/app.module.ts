import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { MatDialogModule, MatRadioModule, MatNativeDateModule, MatDatepickerModule, MatCheckboxModule, MatTableModule, MatSelectModule, MatInputModule, MatGridListModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule } from '@angular/material';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandAssessmentComponent } from './land-assessment/land-assessment.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { BuildingAssessmentComponent } from './building-assessment/building-assessment.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReassessmentsComponent } from './reassessments/reassessments.component';
import { LandReassessmentComponent } from './land-reassessment/land-reassessment.component';
import { BuildingReassessmentComponent } from './building-reassessment/building-reassessment.component';
import { FaasRecComponent, DialogFaasRecTD, DialogFaasRecF } from './faas-rec/faas-rec.component';
import { LandTaxComponent } from './land-tax/land-tax.component';
import { RPTOPComponent } from './rptop/rptop.component';
import { ClearanceComponent, DialogClearance, DialogClearancePipe } from './clearance/clearance.component';
import { MachAssessmentComponent } from './mach-assessment/mach-assessment.component';
import { MachReassessmentComponent } from './mach-reassessment/mach-reassessment.component';
import { PrintingComponent } from './printing/printing.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    MainNavComponent,
    LandingPageComponent,
    LandAssessmentComponent,
    AssessmentsComponent,
    BuildingAssessmentComponent,
    ReassessmentsComponent,
    LandReassessmentComponent,
    BuildingReassessmentComponent,
    FaasRecComponent,
    LandTaxComponent,
    RPTOPComponent,
    ClearanceComponent,
    DialogClearance,
    MachAssessmentComponent,
    MachReassessmentComponent,
    PrintingComponent,
    DialogClearancePipe,
    DialogFaasRecF,
    DialogFaasRecTD
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    FlexLayoutModule,
    MatRadioModule,
    FormsModule,
    MatDialogModule,
  ],
  providers: [
    MatDatepickerModule,
  ],
  entryComponents: [
    ClearanceComponent,
    DialogClearance,
    FaasRecComponent,
    DialogFaasRecF,
    DialogFaasRecTD
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
