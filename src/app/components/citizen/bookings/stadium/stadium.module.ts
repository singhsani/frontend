import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { StadiumRoutingModule } from './stadium-routing.module';
import { BookStadiumComponent } from './book-stadium/book-stadium.component';
/* Import all shared, core and routing module end */

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		StadiumRoutingModule
	],
	declarations: [BookStadiumComponent]
})
export class StadiumModule { }
