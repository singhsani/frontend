import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { ManageRoutes } from './../../../../config/routes-conf';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { AnimalPondNewComponent } from './animal-pond-new/animal-pond-new.component';
import { AnimalPondRenewComponent } from './animal-pond-renew/animal-pond-renew.component';
import { AnimalPondCancellationComponent } from './animal-pond-cancellation/animal-pond-cancellation.component';
import { AnimalPondTransferComponent } from './animal-pond-transfer/animal-pond-transfer.component';
import { AnimalPondDuplicateComponent } from './animal-pond-duplicate/animal-pond-duplicate.component';
import { AnimalPondService } from './common/services/animal-pond.service';
/* Import all shared, core and routing module end */

const routes: Routes = [
	{ path: '', redirectTo: 'APLicense', pathMatch: 'full' },
	{ path: 'APLicense/:id/:apiCode', component: AnimalPondNewComponent },
	{ path: 'APLRenewal/:id/:apiCode', component: AnimalPondRenewComponent },
	{ path: 'APLCancellation/:id/:apiCode', component: AnimalPondCancellationComponent },
	{ path: 'APLTransfer/:id/:apiCode', component: AnimalPondTransferComponent },
	{ path: 'APLDuplication/:id/:apiCode', component: AnimalPondDuplicateComponent }
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
		AnimalPondNewComponent,
		AnimalPondRenewComponent,
		AnimalPondCancellationComponent,
		AnimalPondTransferComponent,
		AnimalPondDuplicateComponent
	],
	providers: [
		AnimalPondService
	]
})
export class AnimalPondModule { }
