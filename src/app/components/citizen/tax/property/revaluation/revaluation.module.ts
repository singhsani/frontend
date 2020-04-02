import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RevaluationComponent } from './Components/revaluation/revaluation.component';
import { RevaluationService } from './Services/revaluation.service';
import { RevaluationSearchComponent } from './Components/revaluation-search/revaluation-search.component';
import { RevaluationTableComponent } from './Components/revaluation-table/revaluation-table.component';
import { RevaluationDetailComponent } from './Components/revaluation-detail/revaluation-detail.component';
import { RevaluationDataSharingService } from './Services/revaluation-data-sharing.service';
import { OccupierDetailComponent } from './Components/occupier-detail/occupier-detail.component';
import { PropertyEntryComponent } from './Components/property-entry/property-entry.component';
import { UnitDetailComponent } from './Components/unit-detail/unit-detail.component';
import { ApprovalComponent } from './Components/approval/approval.component';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';
import { RevaluationDocumentUploadComponent } from './Components/revaluation-document-upload/revaluation-document-upload.component';



const routes: Routes = [
  { path: '', component: RevaluationComponent }
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
    RevaluationComponent,
    RevaluationSearchComponent,
    RevaluationTableComponent,
    RevaluationDetailComponent,
    OccupierDetailComponent,
    PropertyEntryComponent,
    ApprovalComponent,
    UnitDetailComponent,
    RevaluationDocumentUploadComponent
    
  ],
  providers: [
    RevaluationService,
    RevaluationDataSharingService
  ]
})
export class RevaluationModule { }
