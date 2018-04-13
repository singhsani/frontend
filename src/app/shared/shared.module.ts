import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MaterialModule } from './modules/material/material.module';// Import material module

/* Import http related servies start */
import { HttpService } from './services/http.service';
import { TokenInterceptor } from './services/http-intercepter';
/* Import http related servies end */

import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { AlertComponent } from './components/alert/alert.component';


@NgModule({
	declarations: [
		LoadingIndicatorComponent,
		AlertComponent
	],
	imports: [
		HttpModule,
		CommonModule,
		MaterialModule,
		HttpClientModule
	],
	exports: [
		MaterialModule,
		LoadingIndicatorComponent,
		AlertComponent
	],
	providers: [
		HttpService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true,
		}
	]
})
export class SharedModule { }
