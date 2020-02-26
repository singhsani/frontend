import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ApplicationReconnectionComponent } from './Components/application-reconnection/application-reconnection.component';
import { ApplicationReconnectionService } from './Services/application-reconnection.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { ApplicationReconnectionDataSharingService } from './Services/application-reconnection-data-sharing.service';
import { PropertyTaxDetailComponent } from './Components/property-tax-detail/property-tax-detail.component';
import { PropertyBillDetailComponent } from './Components/property-bill-detail/property-bill-detail.component';
import { PropertyDetailComponent } from './Components/property-detail/property-detail.component';
import { WaterTaxDetailComponent } from './Components/water-tax-detail/water-tax-detail.component';
import { WaterBillDetailComponent } from './Components/water-bill-detail/water-bill-detail.component';
import { ApplicationReconnectionFormComponent } from './Components/application-reconnection-Form/application-reconnection-form.component';
import { ApprovalComponent } from './Components/approval/approval.component';


const routes: Routes = [
  { path: '', component: ApplicationReconnectionComponent }
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
    ApplicationReconnectionComponent,
    ApplicationReconnectionFormComponent,
    WaterBillDetailComponent,
    WaterTaxDetailComponent,
    PropertyDetailComponent,
    PropertyBillDetailComponent,
    PropertyTaxDetailComponent,
    ApprovalComponent
    
  ],
  providers: [
    ApplicationReconnectionService,
    ApplicationReconnectionDataSharingService
  ]
})
export class ApplicationReconnectionModule { }
