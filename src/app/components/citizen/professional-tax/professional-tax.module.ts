import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessionalTaxRoutingModule } from './professional-tax-routing.module';
import { PecRegistrationComponent } from './pec-registration/pec-registration.component';
import { PrcRegistrationComponent } from './prc-registration/prc-registration.component';

@NgModule({
  imports: [
    CommonModule,
    ProfessionalTaxRoutingModule
  ],
  declarations: [PecRegistrationComponent, PrcRegistrationComponent]
})
export class ProfessionalTaxModule { }
