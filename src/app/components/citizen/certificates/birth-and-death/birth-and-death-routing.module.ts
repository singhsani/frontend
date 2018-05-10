import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../../config/routes-conf';

/* Import birth and death certificate components start */
import { BirthRegistrationComponent } from './birth-registration/birth-registration.component';
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

const routes: Routes = [
	{ path: '', component: BirthRegistrationComponent },
	{ path: ManageRoutes.getMainRoute('HEL-BR') + '/:id/:apiCode', component: BirthRegistrationComponent },
	{ path: ManageRoutes.getMainRoute('HEL-DR') + '/:id/:apiCode', component: DeathRegistrationComponent },
	{ path: ManageRoutes.getMainRoute('HEL-NRCBR') + '/:id/:apiCode', component: NoBirthRecordComponent },
	{ path: ManageRoutes.getMainRoute('HEL-NRCDR') + '/:id/:apiCode', component: NoDeathRecordComponent },
	{ path: ManageRoutes.getMainRoute('HEL-CR') + '/:id/:apiCode', component: CremationCertificateComponent },
	{ path: ManageRoutes.getMainRoute('HEL-SB') + '/:id/:apiCode', component: StillBirthComponent },
	{ path: ManageRoutes.getMainRoute('HEL-DUPBR') + '/:id/:apiCode', component: BirthDuplicateComponent },
	{ path: ManageRoutes.getMainRoute('HEL-DUPDR') + '/:id/:apiCode', component: DeathDuplicateComponent },
	{ path: ManageRoutes.getMainRoute('HEL-BCR') + '/:id/:apiCode', component: BirthCorrectionComponent },
	{ path: ManageRoutes.getMainRoute('HEL-DCR') + '/:id/:apiCode', component: DeathCorrectionComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BirthAndDeathRoutingModule { }
