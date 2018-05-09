import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { AnimalPondRoutingModule } from './animal-pond-routing.module';
import { AnimalPondNewComponent } from './animal-pond-new/animal-pond-new.component';
import { AnimalPondRenewComponent } from './animal-pond-renew/animal-pond-renew.component';
/* Import all shared, core and routing module end */

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		CoreModule,
		FormsModule,
		ReactiveFormsModule,
		AnimalPondRoutingModule
	],
	declarations: [AnimalPondNewComponent, AnimalPondRenewComponent]
})
export class AnimalPondModule { }
