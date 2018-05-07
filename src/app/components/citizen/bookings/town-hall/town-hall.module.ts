import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { TownHallRoutingModule } from './town-hall-routing.module';
/* Import all shared, core and routing module end */

import { TownHallComponent } from './town-hall_c/town-hall.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		TownHallRoutingModule
	],
	declarations: [
		TownHallComponent
	]
})
export class TownHallModule { }
