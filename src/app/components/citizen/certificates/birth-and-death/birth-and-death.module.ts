import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { BirthAndDeathRoutingModule } from './birth-and-death-routing.module';
/* Import all shared, core and routing module end */

/* Import birth and death certificate components start */
import { BirthCertiAppComponent } from './birth-certificate/birth-certificate.component';
import { DeathCertificateComponent } from './death-certificate/death-certificate.component';
import { NoBirthRecordComponent } from './no-birth-record/no-birth-record.component';
import { NoDeathRecordComponent } from './no-death-record/no-death-record.component';
import { CremationCertificateComponent } from './cremation-certificate/cremation-certificate.component';
/* Import birth and death certificate components start */

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    BirthAndDeathRoutingModule
  ],
  declarations: [
    BirthCertiAppComponent,
    NoBirthRecordComponent,
    NoDeathRecordComponent,
    CremationCertificateComponent,
    DeathCertificateComponent,
  ]
})
export class BirthAndDeathModule { }
