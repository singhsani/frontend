import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { FoodNewComponent } from './food-new/food-new.component';

const routes: Routes = [
	{ path: '', component: FoodNewComponent },
	{ path: ManageRoutes.getMainRoute('FL') + '/:id/:apiCode', component: FoodNewComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FoodRoutingModule { }
