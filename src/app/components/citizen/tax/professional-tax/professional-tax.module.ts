import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { ProfessionalTaxRoutingModule } from './professional-tax-routing.module';

import { PecRegistrationComponent } from './pec-registration/pec-registration.component';
import { PrcRegistrationComponent } from './prc-registration/prc-registration.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    ProfessionalTaxRoutingModule
  ],
  declarations: [PecRegistrationComponent, PrcRegistrationComponent]
})
export class ProfessionalTaxModule { }
