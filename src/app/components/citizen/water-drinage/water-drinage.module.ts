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
import { TaxRebateApplicationService } from '../tax/property/tax-rebate-application/Services/tax-rebate-application.service';
import { WaterPipelineWorkCompletionComponent } from './water-pipeline-work-completion/water-pipeline-work-completion.component';
import { DrainagePipelineWorkCompletionComponent } from './drainage-pipeline-work-completion/drainage-pipeline-work-completion.component';
import { NewDrainageConnectionComponent } from './new-drainage-connection/new-drainage-connection.component';
import { DrainageDisconnectionComponent } from './drainage-disconnection/drainage-disconnection.component';
import { DrainageReconnectionComponent } from './drainage-reconnection/drainage-reconnection.component';
import { DrainageTransferConnectionComponent } from './drainage-transfer-connection/drainage-transfer-connection.component';
import { NewWaterConnectionEntryService } from '../tax/water-supply/new-water-connection-entry/Services/new-water-connection-entry.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { DrainageService } from './service/drainage.service';


/* Import all shared, core and routing module end */

const routes: Routes = [
	{ path: 'waterPipeLineConnection/:id/:apiCode', component: WaterPipelineConnection },
  { path: 'drainagePipeLineConnection/:id/:apiCode', component: DrainagePipelineConnectionComponent },
  { path: 'wtrPipeConnWorkCompletion/:apiCode', component: WaterPipelineWorkCompletionComponent},
  { path: 'drngPipeConnWorkCompletion/:apiCode', component: DrainagePipelineWorkCompletionComponent},
  { path: 'newDrainageConnection/:id/:apiCode', component : NewDrainageConnectionComponent },
  { path: 'drainageDisconnection/:id/:apiCode', component: DrainageDisconnectionComponent},
  { path: 'drainageReconnection/:apiCode', component: DrainageReconnectionComponent},
  { path: 'drainageTransferConnection/:apiCode', component: DrainageTransferConnectionComponent},
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
  providers:[
    TaxRebateApplicationService,
    NewWaterConnectionEntryService,
    AlertService,
    DrainageService
    
  ],
  declarations: [
    WaterPipelineConnection,
    FilterAttachmentMRPipe,
    DrainagePipelineConnectionComponent,
    WaterPipelineWorkCompletionComponent,
    DrainagePipelineWorkCompletionComponent,
    NewDrainageConnectionComponent,
    DrainageDisconnectionComponent,
    DrainageReconnectionComponent,
    DrainageTransferConnectionComponent,
  ]
})
export class WaterDrinageModule { }
