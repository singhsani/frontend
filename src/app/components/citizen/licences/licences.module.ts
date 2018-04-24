import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicencesRoutingModule } from './licences-routing.module';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    LicencesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule
  ],
  declarations: []
})
export class LicencesModule { }
