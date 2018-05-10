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
	{ path: ManageRoutes.getMainRoute('MF-LIC') + '/:id/:apiCode', component: MuttonFishNewComponent },
	{ path: ManageRoutes.getMainRoute('MF-REN') + '/:id/:apiCode', component: MuttonFishRenewalComponent },
	{ path: ManageRoutes.getMainRoute('MF-CAN') + '/:id/:apiCode', component: MuttonFishCancellationComponent },
	{ path: ManageRoutes.getMainRoute('MF-TRA') + '/:id/:apiCode', component: MuttonFishTransferComponent },
	{ path: ManageRoutes.getMainRoute('MF-DUP') + '/:id/:apiCode', component: MuttonFishDuplicateComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MuttonFishRoutingModule { }
