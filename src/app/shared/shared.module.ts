import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MaterialModule } from './modules/material/material.module';// Import material module
import { TranslateModule } from './modules/translate/translate.module';

/* Import http related servies start */
import { HttpService } from './services/http.service';
import { TokenInterceptor } from './services/http-intercepter';
import { CommonService } from './services/common.service';
import { ValidationService } from './services/validation.service';
import { UploadFileService } from './upload-file.service';
/* Import http related servies end */

/* import directives start*/
import { OnlyNumberDirective } from './directives/only-number.directive';
/* import directives end*/

/* import pipes start*/
import { InrPipe } from './pipes/inr.pipe';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AddressComponent } from './components/address/address.component';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { BasicDetailsComponent } from './components/basic-details/basic-details.component';
/* import pipes end*/

const COMPONENTS = [
	OnlyNumberDirective, 
	InrPipe, 
	ActionBarComponent, 
	ControlMessagesComponent, 
	FileUploadComponent,
	AddressComponent,
	BasicDetailsComponent,
	PaymentGatewayComponent
]

@NgModule({
	declarations: [ 
		...COMPONENTS
	],
	imports: [
		HttpModule,
		CommonModule,
		MaterialModule,
		HttpClientModule,
		TranslateModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports: [
		MaterialModule,
		TranslateModule,
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
		}
	]
})
export class SharedModule { }
