import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';

import { MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from './date.adapter';
import { DateAdapter } from '@angular/material';
import { DateDirective } from './date.directive';


const COMPONENTS = [
	MatButtonModule,
	MatToolbarModule,
	MatSidenavModule,
	MatListModule,
	MatIconModule,
	MatChipsModule,
	MatCardModule,
	MatInputModule,
	MatTabsModule,
	MatCheckboxModule,
	MatGridListModule,
	MatSnackBarModule,
	MatSelectModule,
	MatProgressSpinnerModule,
	MatPaginatorModule,
	MatTableModule,
	MatSortModule,
	MatRadioModule,
	MatDialogModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatMenuModule,
	MatProgressBarModule,
	MatStepperModule,
	MatTooltipModule,
	MatExpansionModule,
	
];

@NgModule({
	imports: [
		CommonModule,
		...COMPONENTS
	],
	exports: [
		DateDirective,
		...COMPONENTS
	],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	],
	declarations: [DateDirective]
})

export class MaterialModule { }
