import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { ManageRoutes } from './../../../../config/routes-conf';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { FoodNewComponent } from './food-new/food-new.component';
import { FoodRenewComponent } from './food-renew/food-renew.component';
import { FoodTransferComponent } from './food-transfer/food-transfer.component';
import { FoodDuplicateComponent } from './food-duplicate/food-duplicate.component';

const routes: Routes = [
	{ path: '', component: FoodNewComponent },
	{ path: ManageRoutes.getMainRoute('FL') + '/:id/:apiCode', component: FoodNewComponent },
	{ path: ManageRoutes.getMainRoute('FL-REN') + '/:id/:apiCode', component: FoodRenewComponent },
	{ path: ManageRoutes.getMainRoute('FL-MODIFY') + '/:id/:apiCode', component: FoodTransferComponent },
	{ path: ManageRoutes.getMainRoute('FL-DUP') + '/:id/:apiCode', component: FoodDuplicateComponent }
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
		FoodNewComponent,
		FoodRenewComponent,
		FoodTransferComponent,
		FoodDuplicateComponent
	]
})
export class FoodModule { }
