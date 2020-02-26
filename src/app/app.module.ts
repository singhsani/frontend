import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularWebStorageModule } from 'angular-web-storage';
import { ChartsModule } from 'ng2-charts';


import { HospitalModule } from './components/hospital/hospital.module';
import { CitizenModule } from './components/citizen/citizen.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AmazingTimePickerModule } from 'amazing-time-picker';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
	declarations: [
		AppComponent,
		PageNotFoundComponent
	],
	imports: [
		HospitalModule,
		CitizenModule,
		SharedModule,
		CoreModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		LayoutModule,
		FormsModule,
		ReactiveFormsModule,
		AngularWebStorageModule,
		ToastrModule.forRoot({
			timeOut: 5000,
			positionClass: 'toast-top-right',
			preventDuplicates: true,
			progressBar: true,
			closeButton: true
		}),
		AppRoutingModule,
		AmazingTimePickerModule,
		ChartsModule
	],
	exports: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
