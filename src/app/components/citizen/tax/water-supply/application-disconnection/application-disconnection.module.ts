import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { ApplicationDisconnectionComponent } from './Components/application-disconnection/application-disconnection.component';
import { ApplicationDisconnectionService } from './Services/application-disconnection.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { WaterTaxDetailComponent } from './Components/water-tax-detail/water-tax-detail.component';
import { WaterBillDetailComponent } from './Components/water-bill-detail/water-bill-detail.component';
import { ApplicationDisconnectionDataSharingService } from './Services/application-disconnection-data-sharing.service';
import { PropertyTaxDetailComponent } from './Components/property-tax-detail/property-tax-detail.component';
import { PropertyBillDetailComponent } from './Components/property-bill-detail/property-bill-detail.component';
import { PropertyDetailComponent } from './Components/property-detail/property-detail.component';
import { ApplicationDisconnectionFormComponent } from './Components/application-disconnection-form/application-disconnection-form.component';
import { ApprovalComponent } from './Components/approval/approval.component';
import { NewWaterConnectionEntryDataSharingService } from '../new-water-connection-entry/Services/new-water-connection-entry-data-sharing.service';
import { NewWaterConnectionEntryService } from '../new-water-connection-entry/Services/new-water-connection-entry.service';


const routes: Routes = [
  { path: '', component: ApplicationDisconnectionComponent }
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
    ApplicationDisconnectionComponent,
    ApplicationDisconnectionFormComponent,
    WaterBillDetailComponent,
    WaterTaxDetailComponent,
    PropertyDetailComponent,
    PropertyBillDetailComponent,
    PropertyTaxDetailComponent,
    ApprovalComponent
    
  ],
  providers: [
    ApplicationDisconnectionService,
    ApplicationDisconnectionDataSharingService,
    NewWaterConnectionEntryService
  ]
})
export class ApplicationDisconnectionModule { }
