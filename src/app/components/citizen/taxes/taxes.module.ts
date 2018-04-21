import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxesRoutingModule } from './taxes-routing.module';
import { PropertyTaxComponent } from './property-tax/property-tax.component';

@NgModule({
  imports: [
    CommonModule,
    TaxesRoutingModule
  ],
  declarations: [PropertyTaxComponent]
})
export class TaxesModule { }
