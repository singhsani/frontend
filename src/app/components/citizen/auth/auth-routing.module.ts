import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Import auth components start */
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
/* Import auth components end */

import { LoginThroughAdminComponent } from './login-through-admin/login-through-admin.component';
import { LoginLayoutComponent } from './../../../layouts/login-layout/login-layout.component';
import { LoginResendOTPComponent } from './login-resend-otp/login-resend-otp.component';
import { QRZooBookingComponent } from '../facilities/ticketings/modules/zoo-ticketing/qr-zoo-booking/qr-zoo-booking.component';

const routes: Routes = [
	{
		path: 'auth', component: LoginLayoutComponent,
		children: [
			{ path: '', redirectTo: 'login', pathMatch: 'full' },
			{ path: 'login', component: LoginComponent },
			{ path: 'signup', component: SignUpComponent },
			{ path: 'user-verify', component: UserVerificationComponent },
			{ path: 'forgot-password', component: ForgotPasswordComponent },
			{ path: 'reset-password', component: ResetPasswordComponent },
			{ path: 'login-through-admin', component: LoginThroughAdminComponent },
      { path :'login-resend-otp', component:LoginResendOTPComponent},
	  { path :'qr-booking', component: QRZooBookingComponent}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule { }
