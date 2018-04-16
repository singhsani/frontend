import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { 
	MatButtonModule,
	MatToolbarModule,
	MatCardModule,
	MatInputModule,
	MatSelectModule,
	MatRadioModule,
	MatDialogModule,
	MatSidenavModule,
	MatListModule,
	MatIconModule,
	MatChipsModule,
	MatTabsModule,
	MatCheckboxModule,
	MatGridListModule,
	MatSnackBarModule,
	MatProgressSpinnerModule,
	MatPaginatorModule,
	MatTableModule,
	MatSortModule
} from '@angular/material';

const COMPONENTS = [
	CommonModule,
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
	MatDialogModule
];

@NgModule({
	imports: [
		...COMPONENTS
	],
	exports: [
		...COMPONENTS
	],
})

export class MaterialModule { }
