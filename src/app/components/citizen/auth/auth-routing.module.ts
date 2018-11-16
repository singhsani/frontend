import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Import auth components start */
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
/* Import auth components end */

import { ManageRoutes } from '../../../config/routes-conf';
import { LoginThroughAdminComponent } from './login-through-admin/login-through-admin.component';
import { LoginLayoutComponent } from './../../../layouts/login-layout/login-layout.component';

const routes: Routes = [

	{
		path: ManageRoutes.getPrefixRoute('CITIZENAUTHMODULE'), component: LoginLayoutComponent,
		children: [
			{ path: '', redirectTo: ManageRoutes.getMainRoute('CITIZENAUTHLOGIN'), pathMatch: 'full' },
			{ path: ManageRoutes.getMainRoute('CITIZENAUTHLOGIN'), component: LoginComponent },
			{ path: ManageRoutes.getMainRoute('CITIZENAUTHSIGNUP'), component: SignUpComponent },
			{ path: ManageRoutes.getMainRoute('CITIZENAUTHVERIFY'), component: UserVerificationComponent },
			{ path: ManageRoutes.getMainRoute('CITIZENAUTHFORGOTPASS'), component: ForgotPasswordComponent },
			{ path: ManageRoutes.getMainRoute('CITIZENAUTHRESETPASS'), component: ResetPasswordComponent },
			{ path: ManageRoutes.getMainRoute('CITIZENAUTHLOGINTHROUGHADMIN'), component: LoginThroughAdminComponent },
		]
	},
	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule { }
