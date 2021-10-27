import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewWaterConnectionEntryComponent } from './Components/new-water-connection-entry/new-water-connection-entry.component';
import { ConsumerDetailComponent } from './Components/consumer-detail/consumer-detail.component';
import { PropertyDetailComponent } from './Components/property-detail/property-detail.component';
import { PropertyApprovalComponent } from './Components/property-approval/property-approval.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewWaterConnectionEntryService } from './Services/new-water-connection-entry.service';
import { NewWaterConnectionEntryDataSharingService } from './Services/new-water-connection-entry-data-sharing.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { DocumentUploadComponent } from './Components/document-upload/document-upload.component';
import {MatTooltipModule} from '@angular/material/tooltip';
const routes: Routes = [
  { path: '', component: NewWaterConnectionEntryComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    MatTooltipModule
  ],
  declarations: [
    NewWaterConnectionEntryComponent,
    ConsumerDetailComponent,
    PropertyDetailComponent,
    PropertyApprovalComponent,
    DocumentUploadComponent
  ],
  providers: [
    
    NewWaterConnectionEntryService,
    NewWaterConnectionEntryDataSharingService
  ],
})
export class NewWaterConnectionEntryModule { }
