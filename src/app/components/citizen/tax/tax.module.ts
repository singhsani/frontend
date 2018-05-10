import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../../../shared/shared.module';
import { CoreModule } from './../../../core/core.module';
import { TaxRoutingModule } from './tax-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    TaxRoutingModule
  ],
  declarations: []
})
export class TaxModule { }
