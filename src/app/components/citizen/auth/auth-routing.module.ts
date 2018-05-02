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

const routes: Routes = [
	{ path: '', redirectTo:ManageRoutes.getFullRoute('CITIZENAUTHLOGIN'), pathMatch: 'full' },
	{ path:ManageRoutes.getFullRoute('CITIZENAUTHLOGIN'), component: LoginComponent },
	{ path:ManageRoutes.getFullRoute('CITIZENAUTHSIGNUP'), component: SignUpComponent },
	{ path:ManageRoutes.getFullRoute('CITIZENAUTHVERIFY'), component: UserVerificationComponent },
	{ path:ManageRoutes.getFullRoute('CITIZENAUTHFORGOTPASS'), component: ForgotPasswordComponent },
	{ path:ManageRoutes.getFullRoute('CITIZENAUTHRESETPASS'), component: ResetPasswordComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule { }
