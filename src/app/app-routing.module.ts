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
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from "./guard/auth-guard.service";


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'user/:username/land-tax', component: LandTaxComponent },
  // { path: 'user/:username/land-tax/clearance', component: ClearanceComponent },
  // { path: 'user/:username/land-tax/rptop', component: RPTOPComponent },
  // { path: 'user/:username/land-tax/arrears', component: ArrearsComponent },
  // { path: 'user/:username/print/:file', component: PrintingComponent },
  { path: 'user/:username', component: LandingPageComponent,
    children:[
      { path: '', redirectTo: 'assessments', pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'assessments', component: AssessmentsComponent, canActivate: [AuthGuard] },
      { path: 'assessments/land', component: LandAssessmentComponent, canActivate: [AuthGuard] },
      { path: 'assessments/building', component: BuildingAssessmentComponent, canActivate: [AuthGuard] },
      { path: 'assessments/machinery', component: MachAssessmentComponent, canActivate: [AuthGuard] },
      { path: 'reassessments', component: ReassessmentsComponent, canActivate: [AuthGuard] },
      { path: 'reassessments/land', component: LandReassessmentComponent, canActivate: [AuthGuard] },
      { path: 'reassessments/building', component: BuildingReassessmentComponent, canActivate: [AuthGuard] },
      { path: 'reassessments/machinery', component: MachReassessmentComponent, canActivate: [AuthGuard] },
      { path: 'faas-records', component: FaasRecComponent, canActivate: [AuthGuard] },
      { path: 'segregation', component: SegregationComponent, canActivate: [AuthGuard] },
      { path: 'subdivision', component: SubdivisionComponent, canActivate: [AuthGuard] },
    	{ path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    ]
  },
	{ path: 'path/404', component: NotFoundComponent },
	{ path: '**', redirectTo: '/path/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// export const routingComponents = [
//   LoginComponent,
//   RegisterComponent,
//   LandingPageComponent,
//   LandAssessmentComponent,
//   AssessmentsComponent,
//   BuildingAssessmentComponent,
//   ReassessmentsComponent,
//   LandReassessmentComponent,
//   BuildingReassessmentComponent,
//   FaasRecComponent,
//   LandTaxComponent,
//   ClearanceComponent,
//   RPTOPComponent,
//   ArrearsComponent,
//   MachAssessmentComponent,
//   MachReassessmentComponent,
//   PrintingComponent,
//   SegregationComponent,
//   SubdivisionComponent,
// 	NotFoundComponent,
// 	SettingsComponent
// ]
