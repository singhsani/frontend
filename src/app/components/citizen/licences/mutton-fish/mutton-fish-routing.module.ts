import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { MuttonFishNewComponent } from './mutton-fish-new/mutton-fish-new.component';
import { MuttonFishRenewalComponent } from './mutton-fish-renewal/mutton-fish-renewal.component';
import { MuttonFishCancellationComponent } from './mutton-fish-cancellation/mutton-fish-cancellation.component';
import { MuttonFishTransferComponent } from './mutton-fish-transfer/mutton-fish-transfer.component';
import { MuttonFishDuplicateComponent } from './mutton-fish-duplicate/mutton-fish-duplicate.component';

const routes: Routes = [
	{ path: '', component: MuttonFishNewComponent },
	{ path: ManageRoutes.getMainRoute('MFL') + '/:id', component: MuttonFishNewComponent },
	{ path: ManageRoutes.getMainRoute('MFR') + '/:id', component: MuttonFishRenewalComponent },
	{ path: ManageRoutes.getMainRoute('MFC') + '/:id', component: MuttonFishCancellationComponent },
	{ path: ManageRoutes.getMainRoute('MFT') + '/:id', component: MuttonFishTransferComponent },
	{ path: ManageRoutes.getMainRoute('MFD') + '/:id', component: MuttonFishDuplicateComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MuttonFishRoutingModule { }
