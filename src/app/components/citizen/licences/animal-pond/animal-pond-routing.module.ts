import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { AnimalPondNewComponent } from './animal-pond-new/animal-pond-new.component';
import { AnimalPondRenewComponent } from './animal-pond-renew/animal-pond-renew.component';

const routes: Routes = [
	{ path: '', component: AnimalPondNewComponent },
	{ path: ManageRoutes.getMainRoute('POND-LIC') + '/:id/:apiCode', component: AnimalPondNewComponent },
	{ path: ManageRoutes.getMainRoute('POND-REN') + '/:id/:apiCode', component: AnimalPondRenewComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AnimalPondRoutingModule { }
