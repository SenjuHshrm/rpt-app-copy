import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandAssessmentComponent } from './land-assessment/land-assessment.component';
import { BuildingAssessmentComponent } from './building-assessment/building-assessment.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { ReassessmentsComponent } from './reassessments/reassessments.component';
import { LandReassessmentComponent } from './land-reassessment/land-reassessment.component';
import { BuildingReassessmentComponent } from './building-reassessment/building-reassessment.component';
import { FaasRecComponent } from './faas-rec/faas-rec.component';
import { LandTaxComponent } from './land-tax/land-tax.component';
import { ClearanceComponent } from './clearance/clearance.component';
import { RPTOPComponent } from './rptop/rptop.component';
import { ArrearsComponent } from './arrears/arrears.component';
import { MachAssessmentComponent } from './mach-assessment/mach-assessment.component';
import { MachReassessmentComponent } from './mach-reassessment/mach-reassessment.component';
import { PrintingComponent } from './printing/printing.component';
import { SegregationComponent } from './segregation/segregation.component';
import { SubdivisionComponent } from './subdivision/subdivision.component';
import { NotFoundComponent } from './not-found/not-found.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/:username', component: LandingPageComponent },
  { path: 'user/:username/assessments', component: AssessmentsComponent },
  { path: 'user/:username/assessments/land', component: LandAssessmentComponent },
  { path: 'user/:username/assessments/building', component: BuildingAssessmentComponent },
  { path: 'user/:username/assessments/machinery', component: MachAssessmentComponent },
  { path: 'user/:username/reassessments', component: ReassessmentsComponent },
  { path: 'user/:username/reassessments/land', component: LandReassessmentComponent },
  { path: 'user/:username/reassessments/building', component: BuildingReassessmentComponent },
  { path: 'user/:username/reassessments/machinery', component: MachReassessmentComponent },
  { path: 'user/:username/faas-records', component: FaasRecComponent },
  { path: 'user/:username/land-tax', component: LandTaxComponent },
  { path: 'user/:username/land-tax/clearance', component: ClearanceComponent },
  { path: 'user/:username/land-tax/rptop', component: RPTOPComponent },
  { path: 'user/:username/land-tax/arrears', component: ArrearsComponent },
  { path: 'user/:username/print/:file', component: PrintingComponent },
  { path: 'user/:username/segregation', component: SegregationComponent },
  { path: 'user/:username/subdivision', component: SubdivisionComponent },

	{ path: 'path/404', component: NotFoundComponent },
	{ path: '**', redirectTo: '/path/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  LoginComponent,
  RegisterComponent,
  LandingPageComponent,
  LandAssessmentComponent,
  AssessmentsComponent,
  BuildingAssessmentComponent,
  ReassessmentsComponent,
  LandReassessmentComponent,
  BuildingReassessmentComponent,
  FaasRecComponent,
  LandTaxComponent,
  ClearanceComponent,
  RPTOPComponent,
  ArrearsComponent,
  MachAssessmentComponent,
  MachReassessmentComponent,
  PrintingComponent,
  SegregationComponent,
  SubdivisionComponent,
	NotFoundComponent
]
