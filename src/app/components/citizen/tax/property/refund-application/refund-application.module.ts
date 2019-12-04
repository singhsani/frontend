import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RefundApplicationComponent } from './Components/refund-application/refund-application.component';
import { RefundApplicationService } from './Services/refund-application.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { RefundApplicationDataSharingService } from './Services/refund-application-data-sharing.service';
import { RefundApplicationFormComponent } from './Components/refund-application-form/refund-application-form.component';
import { ApprovalComponent } from './Components/approval/approval.component';


const routes: Routes = [
  { path: '', component: RefundApplicationComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule
  ],
  declarations: [
    RefundApplicationComponent,
    RefundApplicationFormComponent,
    ApprovalComponent
  ],
  providers: [
    RefundApplicationService,
    RefundApplicationDataSharingService

  ]
})
export class RefundApplicationModule { }
