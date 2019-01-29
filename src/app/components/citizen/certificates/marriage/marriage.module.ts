import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { ManageRoutes } from './../../../../config/routes-conf';
/* Import all shared, core and routing module end */

/* Import marriage certificate components start */
import { MarriageCreateComponent } from './marriage-create/marriage-create.component';
import { MarriageDuplicateComponent } from './marriage-duplicate/marriage-duplicate.component';
/* Import marriage certificate components end */

const routes: Routes = [
	{ path: '', component: MarriageCreateComponent },
	{ path: ManageRoutes.getMainRoute('HEL-MR') + '/:id/:apiCode', component: MarriageCreateComponent },
	{ path: ManageRoutes.getMainRoute('HEL-DUPMR') + '/:id/:apiCode', component: MarriageDuplicateComponent },
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
		MarriageCreateComponent,
		MarriageDuplicateComponent,
	]
})
export class MarriageModule { }
