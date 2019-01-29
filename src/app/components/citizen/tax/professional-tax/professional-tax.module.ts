import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthGuard } from './../../../../core/guard/auth.guard';
import { ManageRoutes } from './../../../../config/routes-conf';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';

import { PecRegistrationComponent } from './pec-registration/pec-registration.component';
import { PrcRegistrationComponent } from './prc-registration/prc-registration.component';

const routes: Routes = [
	{ path: ManageRoutes.getMainRoute('PEC_REG') + '/:id/:apiCode', component: PecRegistrationComponent, canActivate: [AuthGuard] },
	{ path: ManageRoutes.getMainRoute('PRC_REG'), component: PrcRegistrationComponent, canActivate: [AuthGuard] }
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
		PecRegistrationComponent,
		PrcRegistrationComponent
	]
})
export class ProfessionalTaxModule { }
