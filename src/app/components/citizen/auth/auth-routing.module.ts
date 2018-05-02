import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Import auth components start */
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
/* Import auth components end */

import { ROUTESLIST } from '../../../config/routes-conf';
import * as _ from 'lodash';

const routes: Routes = [
	{ path: '', redirectTo: _.get(ROUTESLIST, 'CITIZENAUTHLOGIN.full'), pathMatch: 'full' },
	{ path: _.get(ROUTESLIST, 'CITIZENAUTHLOGIN.full'), component: LoginComponent },
	{ path: _.get(ROUTESLIST, 'CITIZENAUTHSIGNUP.full'), component: SignUpComponent },
	{ path: _.get(ROUTESLIST, 'CITIZENAUTHVERIFY.full'), component: UserVerificationComponent },
	{ path: _.get(ROUTESLIST, 'CITIZENAUTHFORGOTPASS.full'), component: ForgotPasswordComponent },
	{ path: _.get(ROUTESLIST, 'CITIZENAUTHRESETPASS.full'), component: ResetPasswordComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule { }
