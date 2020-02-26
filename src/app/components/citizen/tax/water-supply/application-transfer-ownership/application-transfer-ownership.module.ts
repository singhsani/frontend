import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ApplicationTransferOwnershipComponent } from './Components/application-transfer-ownership/application-transfer-ownership.component';
import { ApplicationTransferOwnershipService } from './Services/application-transfer-ownership.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { WaterBillDetailComponent } from './Components/water-bill-detail/water-bill-detail.component';
import { WaterTaxDetailComponent } from './Components/water-tax-detail/water-tax-detail.component';
import { PropertyDetailComponent } from './Components/property-detail/property-detail.component';
import { PropertyBillDetailComponent } from './Components/property-bill-detail/property-bill-detail.component';
import { PropertyTaxDetailComponent } from './Components/property-tax-detail/property-tax-detail.component';
import { ApplicationTransferOwnershipDataSharingService } from './Services/application-transfer-ownership-data-sharing.service';
import { ApprovalComponent } from './Components/approval/approval.component';
import { ApplicationTransferOwnershipFormComponent } from './Components/application-transfer-ownership-form/application-transfer-ownership-form.component';


const routes: Routes = [
  { path: '', component: ApplicationTransferOwnershipComponent }
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
    ApplicationTransferOwnershipComponent,
    ApplicationTransferOwnershipFormComponent,
    WaterBillDetailComponent,
    WaterTaxDetailComponent,
    PropertyDetailComponent,
    PropertyBillDetailComponent,
    PropertyTaxDetailComponent,
    ApprovalComponent
    
  ],
  providers: [
    ApplicationTransferOwnershipService,
    ApplicationTransferOwnershipDataSharingService
  ]
})
export class ApplicationTransferOwnershipModule { }
