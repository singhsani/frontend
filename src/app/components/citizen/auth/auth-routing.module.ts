import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Import auth components start */
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
/* Import auth components end */

const routes: Routes = [
	{ path: '', redirectTo: 'citizen/auth/login', pathMatch: 'full' },
	{ path: 'citizen/auth/login', component: LoginComponent },
	{ path: 'citizen/auth/signup', component: SignUpComponent },
	{ path: 'citizen/auth/user-verify', component: UserVerificationComponent },
	{ path: 'citizen/auth/forgot-password', component: ForgotPasswordComponent },
	{ path: 'citizen/auth/reset-password', component: ResetPasswordComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule { }
