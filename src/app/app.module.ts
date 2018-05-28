import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

/* import all modules start */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // angular animation module
import { AngularWebStorageModule } from 'angular-web-storage';
/* import all modules end */

// import { CitizenModule } from './components/citizen/citizen.module';
import { HospitalModule } from './components/hospital/hospital.module';
import { CitizenModule } from './components/citizen/citizen.module';
import { SharedModule } from './shared/shared.module'; // shared design module
import { CoreModule } from './core/core.module';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module'; // route module
import { MAT_DATE_LOCALE } from '@angular/material';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material'
import { AmazingTimePickerModule } from 'amazing-time-picker'; 
/* Import child modules end */

/* import all component start */
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
/* import all component end */


/** import progress bar modules - start */
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
/** import progress bar modules - end */

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
		NgProgressModule.forRoot(),
		NgProgressHttpModule,
		NgProgressRouterModule,
		AmazingTimePickerModule
	],
	exports: [ ],
	providers: [
		{ provide: LocationStrategy, useClass: HashLocationStrategy },
		{ provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
		{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false }}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
