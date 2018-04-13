import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { CitizenRoutingModule } from './citizen-routing.module';
/* Import all shared, core and routing module end */

/* Import citizen components start */
import { DashboardComponent } from './dashboard/dashboard.component';
import { BirthCertiAppComponent } from './birth-certi-app/birth-certi-app.component';
/* Import citizen components end */

@NgModule({
	imports: [
		CommonModule,
		CitizenRoutingModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		DashboardComponent,
		BirthCertiAppComponent
	]
})
export class CitizenModule { }
