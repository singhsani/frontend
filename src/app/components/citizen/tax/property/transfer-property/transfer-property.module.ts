import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TransferPropertyComponent } from './Components/transfer-property/transfer-property.component';
import { TransferPropertyService } from './Services/transfer-property.service';
import { TransferPropertySearchComponent } from './Components/transfer-property-search/transfer-property-search.component';
import { TransferPropertyTableComponent } from './Components/transfer-property-table/transfer-property-table.component';
import { TransferPropertyDetailComponent } from './Components/transfer-property-detail/transfer-property-detail.component';
import { TransferPropertyDataSharingService } from './Services/transfer-property-data-sharing.service';
import { PropertyOwnerComponent } from './Components/property-owner/property-owner.component';
import { PropertyInfoComponent } from './Components/property-info/property-info.component';
import { DocumentReferenceComponent } from './Components/document-reference/document-reference.component';
import { DocumentCheckListComponent } from './Components/document-check-list/document-check-list.component';
import { PropertyTransferApprovalComponent } from './Components/property-transfer-approval/property-transfer-approval.component';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';



const routes: Routes = [
  { path: '', component: TransferPropertyComponent }
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
    TransferPropertyComponent,
    TransferPropertySearchComponent,
    TransferPropertyTableComponent,
    TransferPropertyDetailComponent,
    PropertyOwnerComponent,
    PropertyInfoComponent,
    PropertyTransferApprovalComponent,
    DocumentReferenceComponent,
    DocumentCheckListComponent
    
  ],
  providers: [
    TransferPropertyService,
    TransferPropertyDataSharingService
  ]
})
export class TransferPropertyModule { }
