import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { BirthAndDeathRoutingModule } from './birth-and-death-routing.module';
/* Import all shared, core and routing module end */

/* Import birth and death certificate components start */
import { BirthRegistrationComponent,ChildSelectionContent } from './birth-registration/birth-registration.component';
import { DeathRegistrationComponent } from './death-registration/death-registration.component';
import { NoBirthRecordComponent } from './no-birth-record/no-birth-record.component';
import { NoDeathRecordComponent } from './no-death-record/no-death-record.component';
import { CremationCertificateComponent } from './cremation-certificate/cremation-certificate.component';
import { StillBirthComponent } from './still-birth/still-birth.component';
import { BirthDuplicateComponent } from './birth-duplicate/birth-duplicate.component';
import { DeathDuplicateComponent } from './death-duplicate/death-duplicate.component';
import { BirthCorrectionComponent } from './birth-correction/birth-correction.component';
import { DeathCorrectionComponent } from './death-correction/death-correction.component';
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
  entryComponents: [
    ChildSelectionContent
  ],
  declarations: [
    BirthRegistrationComponent,
    ChildSelectionContent,
    NoBirthRecordComponent,
    NoDeathRecordComponent,
    CremationCertificateComponent,
    DeathRegistrationComponent,
    StillBirthComponent,
    BirthDuplicateComponent,
    DeathDuplicateComponent,
    BirthCorrectionComponent,
    DeathCorrectionComponent,
  ]
})
export class BirthAndDeathModule { }
