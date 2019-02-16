import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MaterialModule } from './modules/material/material.module';// Import material module
import { TranslateModule } from './modules/translate/translate.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap';
import { NgxMaskModule } from 'ngx-mask'


/* Import http related servies start */
import { HttpService } from './services/http.service';
import { TokenInterceptor } from './services/http-intercepter';
import { CommonService } from './services/common.service';
import { ValidationService } from './services/validation.service';
import { UploadFileService } from './upload-file.service';
/* Import http related servies end */

/* import directives start*/
import { OnlyNumberDirective } from './directives/only-number.directive';
import { PreventSpaceDirective } from './directives/prevent-space.directive';
import { ValidationFieldsDirective } from './directives/validation-fields.directive';
import { GujInputSourceDirective } from './directives/guj-input-source.directive';
import { GujInputTargetDirective } from './directives/guj-input-target.directive';
import { InputTrimDirective } from './directives/input-trim.directive';
import { AlphaNumericDirective } from './directives/alpha-numeric.directive';
import { ReloadDirective } from './directives/reload.directive';

/* import directives end*/

/* import pipes start*/
import { InrPipe } from './pipes/inr.pipe';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AddressComponent } from './components/address/address.component';
import { PaymentResponsePageComponent } from './components/payment-response-page/payment-response-page.component'
import { BasicDetailsComponent } from './components/basic-details/basic-details.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { HosHttpService } from './services/hos-http.service';
import { HosActionBarComponent } from './components/hos-action-bar/hos-action-bar.component';
import { HosFileUploadComponent } from './components/hos-file-upload/hos-file-upload.component';
import { CountryService } from './services/country.service';
import { HosPaymentResponsePageComponent } from './components/hos-payment-response-page/hos-payment-response-page.component';
import { HosTitleBarComponent } from './components/hos-title-bar/hos-title-bar.component';
import { GatewayResponseComponent } from './components/gateway-response/gateway-response.component';
import { PaymentOptionComponent } from './components/payment-option/payment-option.component';
/* import pipes end*/

const COMPONENTS = [
	OnlyNumberDirective,
	PreventSpaceDirective,
	InrPipe,
	ActionBarComponent,
	ControlMessagesComponent,
	FileUploadComponent,
	HosFileUploadComponent,
	AddressComponent,
	BasicDetailsComponent,
	PaymentResponsePageComponent,
	TitleBarComponent,
	HosTitleBarComponent,
	HosActionBarComponent,
	InputTrimDirective,
	ValidationFieldsDirective,
	GujInputSourceDirective,
	GujInputTargetDirective,
	AlphaNumericDirective,
	ReloadDirective,
	HosPaymentResponsePageComponent,
	GatewayResponseComponent,
	PaymentOptionComponent
]

@NgModule({
	declarations: [
		...COMPONENTS
		
	],
	imports: [
		CommonModule,
		MaterialModule,
		HttpClientModule,
		TranslateModule,
		FormsModule,
		NgSelectModule,
		ModalModule.forRoot(),
		NgxMaskModule.forRoot(),		
		ReactiveFormsModule
	],
	exports: [
		MaterialModule,
		TranslateModule,
		NgSelectModule,
		ModalModule,
		...COMPONENTS
	],
	providers: [
		ValidationService,
		UploadFileService,
		HttpService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true,
		},
		HosHttpService,
		CountryService
	]
})
export class SharedModule { }
