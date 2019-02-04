import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { TheaterRoutingModule } from './theater-routing.module';
import { BookTheaterComponent } from './book-theater/book-theater.component';
/* Import all shared, core and routing module end */

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		TheaterRoutingModule
	],
	declarations: [BookTheaterComponent]
})
export class TheaterModule { }
