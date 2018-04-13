import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Import Material Design Button, Card, Input Module functions.
 */
import { MatButtonModule, MatToolbarModule, MatCardModule, MatInputModule, MatSelectModule, MatRadioModule, MatDialogModule } from '@angular/material';

/**
 * Import Material Design SideBar Navigation Module functions.
 */
import { MatSidenavModule } from '@angular/material/sidenav';

/**
 * Import Material Design List Module functions.
 */
import { MatListModule } from '@angular/material/list';

/**MatRadioModule
 * Import Material Design Icon Module functions.
 */
import { MatIconModule } from '@angular/material/icon';

/**
 * Import Material Design Chips Module functions.
 */
import { MatChipsModule } from '@angular/material/chips';

/**
 * Import Material Design Tabs Module functions.
 */
import { MatTabsModule } from '@angular/material/tabs';

/**
 * Import Material Design Checkbox Module functions.
 */
import { MatCheckboxModule } from '@angular/material/checkbox';

/**
 * Import Material Design Grid List Module functions.
 */
import { MatGridListModule } from '@angular/material/grid-list';

/**
 * Import Material Design Snack Bar Module functions.
 */
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatPaginatorModule } from '@angular/material/paginator';

import { MatTableModule } from '@angular/material/table';

import { MatSortModule } from '@angular/material/sort';

@NgModule({
	imports: [
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
	],
	exports: [
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
	],
})

export class MaterialModule { }
