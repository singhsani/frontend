import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
/* Import all shared, core and routing module end */

const routes: Routes = [];

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes)
	],
	declarations: []
})
export class GrievanceModule { }
