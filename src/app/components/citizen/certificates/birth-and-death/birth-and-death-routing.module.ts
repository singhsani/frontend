import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../../config/routes-conf';

/* Import birth and death certificate components start */
import { BirthRegistrationComponent } from './birth-registration/birth-registration.component';
import { DeathCertificateComponent } from './death-certificate/death-certificate.component';
import { NoBirthRecordComponent } from './no-birth-record/no-birth-record.component';
import { NoDeathRecordComponent } from './no-death-record/no-death-record.component';
import { CremationCertificateComponent } from './cremation-certificate/cremation-certificate.component';
import { StillBirthComponent } from './still-birth/still-birth.component';
import { BirthDuplicateComponent } from './birth-duplicate/birth-duplicate.component';
import { DeathDuplicateComponent } from './death-duplicate/death-duplicate.component';
/* Import birth and death certificate components start */

const routes: Routes = [
	{ path: '', component: BirthRegistrationComponent },
	{ path: ManageRoutes.getMainRoute('BR') + '/:id', component: BirthRegistrationComponent },
	{ path: ManageRoutes.getMainRoute('DR') + '/:id', component: DeathCertificateComponent },
	{ path: ManageRoutes.getMainRoute('NRC-BIRTH') + '/:id', component: NoBirthRecordComponent },
	{ path: ManageRoutes.getMainRoute('NRC-DEATH') + '/:id', component: NoDeathRecordComponent },
	{ path: ManageRoutes.getMainRoute('CR') + '/:id', component: CremationCertificateComponent },
	{ path: ManageRoutes.getMainRoute('SB') + '/:id', component: StillBirthComponent },
	{ path: ManageRoutes.getMainRoute('DUP-BR') + '/:id', component: BirthDuplicateComponent },
	{ path: ManageRoutes.getMainRoute('DUP-DR') + '/:id', component: DeathDuplicateComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BirthAndDeathRoutingModule { }
