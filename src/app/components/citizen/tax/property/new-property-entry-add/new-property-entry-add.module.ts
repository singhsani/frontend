import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPropertyEntryAddComponent } from './Components/new-property-entry-add/new-property-entry-add.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewPropertyEntryAddService } from './Services/new-property-entry-add.service';
import { NewPropertyEntryAddDataSharingService } from './Services/new-property-entry-add-data-sharing.service';
import { AddressDetailComponent } from './Components/address-detail/address-detail.component';
import { OwnerDetailComponent } from './Components/owner-detail/owner-detail.component';
import { OccupierDetailComponent } from './Components/occupier-detail/occupier-detail.component';
import { UnitDetailComponent } from './Components/unit-detail/unit-detail.component';
import { ApprovalComponent } from './Components/approval/approval.component';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { PropertyDocumentUploadAddComponent } from './Components/property-document-upload-add/property-document-upload-add.component';
const routes: Routes = [
  { path: '', component: NewPropertyEntryAddComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedComponentModule,
    ReactiveFormsModule
  ],
  declarations: [
    NewPropertyEntryAddComponent,
    AddressDetailComponent,
    OwnerDetailComponent,
    OccupierDetailComponent,
    UnitDetailComponent,
    ApprovalComponent,
    PropertyDocumentUploadAddComponent
  ],
  providers: [

    NewPropertyEntryAddService,
    NewPropertyEntryAddDataSharingService
  ],
})
export class NewPropertyEntryAddModule { }
