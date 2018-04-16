import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module'; // route module

/* import all modules start */

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // angular animation module
import { AngularWebStorageModule } from 'angular-web-storage';

/* import all modules end */

/* Import child modules start */

import { AuthModule } from './components/citizen/auth/auth.module';
import { CitizenModule } from './components/citizen/citizen.module';
import { HospitalModule } from './components/hospital/hospital.module';
import { SharedModule } from './shared/shared.module'; // shared design module
import { CoreModule } from './core/core.module';
/* Import child modules end */

/* import all component start */

import { AppComponent } from './app.component'; // main app component
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
/* import all component end */


@NgModule({
	declarations: [
		AppComponent,
		HomeLayoutComponent,
		LoginLayoutComponent,
	],
	imports: [
		AuthModule,
		CitizenModule,
		SharedModule,
		CoreModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpModule,
		HttpClientModule,
		LayoutModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		AngularWebStorageModule
	],
	exports: [ ],
	providers: [ ],
	bootstrap: [AppComponent]
})
export class AppModule { }
