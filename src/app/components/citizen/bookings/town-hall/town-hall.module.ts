import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { TownHallRoutingModule } from './town-hall-routing.module';
/* Import all shared, core and routing module end */

import { TownHallListComponent } from './town-hall-list/town-hall-list.component';
import { TownHallBookComponent } from './town-hall-book/town-hall-book.component';

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
		TownHallListComponent,
		TownHallBookComponent
	]
})
export class TownHallModule { }
