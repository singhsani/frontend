import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { ManageRoutes } from './../../../../config/routes-conf';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { MuttonFishNewComponent } from './mutton-fish-new/mutton-fish-new.component';
import { MuttonFishDuplicateComponent } from './mutton-fish-duplicate/mutton-fish-duplicate.component';
import { MuttonFishTransferComponent } from './mutton-fish-transfer/mutton-fish-transfer.component';
import { MuttonFishRenewalComponent } from './mutton-fish-renewal/mutton-fish-renewal.component';
import { MuttonFishCancellationComponent } from './mutton-fish-cancellation/mutton-fish-cancellation.component';
import { MuttonFishService } from './common/services/mutton-fish.service';
import { FilterAttachmentMFPipe } from './common/pipes/filter-attachment-mf.pipe';
/* Import all shared, core and routing module end */

const routes: Routes = [
	{ path: '', component: MuttonFishNewComponent },
	{ path: 'MFLicense/:id/:apiCode', component: MuttonFishNewComponent },
	{ path: 'MFRenewal/:id/:apiCode', component: MuttonFishRenewalComponent },
	{ path: 'MFCancellation/:id/:apiCode', component: MuttonFishCancellationComponent },
	{ path: 'MFTransfer/:id/:apiCode', component: MuttonFishTransferComponent },
	{ path: 'MFDuplicate/:id/:apiCode', component: MuttonFishDuplicateComponent },
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
		MuttonFishNewComponent,
		MuttonFishDuplicateComponent,
		MuttonFishTransferComponent,
		MuttonFishRenewalComponent,
		MuttonFishCancellationComponent, FilterAttachmentMFPipe
	],
	providers: [
		MuttonFishService
	]
})
export class MuttonFishModule { }
