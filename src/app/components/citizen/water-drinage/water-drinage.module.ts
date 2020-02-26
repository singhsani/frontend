import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Import all shared, core and routing module start */
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { WaterPipelineConnection } from './water-pipeline/water-pipeline-connection';
import { FilterAttachmentMRPipe } from '../certificates/marriage/filter-attachment-MR.pipe';
import { DrainagePipelineConnectionComponent } from './drainage-pipeline-connection/drainage-pipeline-connection.component';


/* Import all shared, core and routing module end */

const routes: Routes = [
	{ path: 'waterPipeLineConnection/:id/:apiCode', component: WaterPipelineConnection },
	{ path: 'drainagePipeLineConnection/:id/:apiCode', component: DrainagePipelineConnectionComponent },
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
    FilterAttachmentMRPipe,
    DrainagePipelineConnectionComponent
  ]
})
export class WaterDrinageModule { }
