import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
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
/* Import child modules end */

// adding rx operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

/* import all component start */
import { AppComponent } from './app.component'; // main app component
/* import all component end */


@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		//AuthModule,
		CitizenModule,
		SharedModule,
		CoreModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpModule,
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
		
	],
	exports: [ ],
	providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
	bootstrap: [AppComponent]
})
export class AppModule { }
