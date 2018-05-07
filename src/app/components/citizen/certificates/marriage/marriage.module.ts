import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { MarriageRoutingModule } from './marriage-routing.module';
/* Import all shared, core and routing module end */

/* Import marriage certificate components start */
import { MarriageCreateComponent } from './marriage-create/marriage-create.component';
/* Import marriage certificate components end */

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MarriageRoutingModule
  ],
  declarations: [
    MarriageCreateComponent,
  ]
})
export class MarriageModule { }
