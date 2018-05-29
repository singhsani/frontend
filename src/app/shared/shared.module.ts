import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MaterialModule } from './modules/material/material.module';// Import material module
import { TranslateModule } from './modules/translate/translate.module';
import { NgSelectModule } from '@ng-select/ng-select';

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
/* import directives end*/

/* import pipes start*/
import { InrPipe } from './pipes/inr.pipe';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AddressComponent } from './components/address/address.component';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { BasicDetailsComponent } from './components/basic-details/basic-details.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { HosHttpService } from './services/hos-http.service';
import { HosActionBarComponent } from './components/hos-action-bar/hos-action-bar.component';
/* import pipes end*/

const COMPONENTS = [
	OnlyNumberDirective,
	PreventSpaceDirective,
	InrPipe, 
	ActionBarComponent, 
	ControlMessagesComponent, 
	FileUploadComponent,
	AddressComponent,
	BasicDetailsComponent,
	PaymentGatewayComponent,
	TitleBarComponent,
	LoadingIndicatorComponent,
	HosActionBarComponent,
	ValidationFieldsDirective,
	GujInputSourceDirective,
	GujInputTargetDirective
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
		ReactiveFormsModule
	],
	exports: [
		MaterialModule,
		TranslateModule,
		NgSelectModule,
		...COMPONENTS
	],
	providers: [
		ValidationService,
		CommonService,
		UploadFileService,
		HttpService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true,
		},
		HosHttpService
	]
})
export class SharedModule { }
