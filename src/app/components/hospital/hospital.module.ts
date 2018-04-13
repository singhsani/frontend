import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Import all shared, core and routing module start */
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { HospitalRoutingModule } from './hospital-routing.module';
/* Import all shared, core and routing module end */

/* Import hospital components start */
import { DashboardComponent } from './dashboard/dashboard.component';
/* Import hospital components end */

@NgModule({
	imports: [
		CommonModule,
		HospitalRoutingModule,
		SharedModule,
		CoreModule
	],
	declarations: [DashboardComponent]
})
export class HospitalModule { }
