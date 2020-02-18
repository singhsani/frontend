import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Import all shared, core and routing module start */
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { WaterPipelineConnection } from './water-pipeline/water-pipeline-connection';
import { FilterAttachmentMRPipe } from '../certificates/marriage/filter-attachment-MR.pipe';


/* Import all shared, core and routing module end */

const routes: Routes = [
	{ path: 'waterPipeLineConnection/:id/:apiCode', component: WaterPipelineConnection },
	//{ path: 'duplicateMarriageReg/:id/:apiCode', component: MarriageDuplicateComponent },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    WaterPipelineConnection,
    FilterAttachmentMRPipe
  ]
})
export class WaterDrinageModule { }
