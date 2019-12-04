import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ApplicationChangeUsageComponent } from './Components/application-change-usage/application-change-usage.component';
import { ApplicationChangeUsageService } from './Services/application-change-usage.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { ApplicationChangeUsageDataSharingService } from './Services/application-change-usage-data-sharing.service';
import { PropertyTaxDetailComponent } from './Components/property-tax-detail/property-tax-detail.component';
import { PropertyBillDetailComponent } from './Components/property-bill-detail/property-bill-detail.component';
import { PropertyDetailComponent } from './Components/property-detail/property-detail.component';
import { WaterTaxDetailComponent } from './Components/water-tax-detail/water-tax-detail.component';
import { WaterBillDetailComponent } from './Components/water-bill-detail/water-bill-detail.component';
import { ApplicationChangeUsageFormComponent } from './Components/application-change-usage-form/application-change-usage-form.component';
import { ApprovalComponent } from './Components/approval/approval.component';


const routes: Routes = [
  { path: '', component: ApplicationChangeUsageComponent }
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
    ApplicationChangeUsageComponent,
    WaterBillDetailComponent,
    WaterTaxDetailComponent,
    PropertyDetailComponent,
    PropertyBillDetailComponent,
    PropertyTaxDetailComponent,
    ApplicationChangeUsageFormComponent,
    ApprovalComponent
    
  ],
  providers: [
    ApplicationChangeUsageService,
    ApplicationChangeUsageDataSharingService
  ]
})
export class ApplicationChangeUsageModule { }
