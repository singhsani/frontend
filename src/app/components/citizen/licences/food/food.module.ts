import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { FoodRoutingModule } from './food-routing.module';
import { FoodNewComponent } from './food-new/food-new.component';

@NgModule({
  imports: [
		CommonModule,
		SharedModule,
		CoreModule,
    FormsModule,
    ReactiveFormsModule,
    FoodRoutingModule
  ],
  declarations: [FoodNewComponent]
})
export class FoodModule { }
