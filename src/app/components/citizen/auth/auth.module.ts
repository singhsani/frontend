import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing related module start */
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { AuthRoutingModule } from './auth-routing.module';
/* Import all shared, core and routing related module end */

/* Import citizen auth components start */
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginThroughAdminComponent } from './login-through-admin/login-through-admin.component';
import { LoginLayoutComponent } from './../../../layouts/login-layout/login-layout.component';
import { LoginResendOTPComponent } from './login-resend-otp/login-resend-otp.component';
import { QRZooBookingComponent } from '../facilities/ticketings/modules/zoo-ticketing/qr-zoo-booking/qr-zoo-booking.component';
/* Import citizen auth components end */

@NgModule({
	imports: [
		CommonModule,
		AuthRoutingModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		LoginComponent,
		ResetPasswordComponent,
		UserVerificationComponent,
		SignUpComponent,
		ForgotPasswordComponent,
		LoginThroughAdminComponent,
		LoginLayoutComponent,
		LoginResendOTPComponent,
		QRZooBookingComponent
	]
})
export class AuthModule { }
