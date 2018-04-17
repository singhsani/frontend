import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


/* import all citizen related services start */
import { AuthService } from './services/citizen/app-services/auth.service';
import { AuthGuard } from './guard/auth.guard';
import { AppService } from './services/citizen/app-services/app.service';
import { PaginationService } from './services/citizen/data-services/pagination.service';
import { FormsActionsService } from './services/citizen/data-services/forms-actions.service';
/* import all citizen related services end */


@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
	],
	providers: [
		AuthService,
		AuthGuard,
		AppService,
		PaginationService,
		FormsActionsService
	]
})

export class CoreModule { }
