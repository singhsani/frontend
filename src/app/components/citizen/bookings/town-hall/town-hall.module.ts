import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { TownHallRoutingModule } from './town-hall-routing.module';
import { TownHallBookComponent } from './townhall-book/townhall-book.component';
/* Import all shared, core and routing module end */


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
		TownHallBookComponent	]
})
export class TownHallModule { }
