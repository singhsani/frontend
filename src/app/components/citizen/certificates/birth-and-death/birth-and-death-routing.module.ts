import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../../../../core/guard/auth.guard';
import { ManageRoutes } from '../../../../config/routes-conf';

/* Import birth and death certificate components start */
import { BirthCertiAppComponent } from './birth-certificate/birth-certificate.component';
import { DeathCertificateComponent } from './death-certificate/death-certificate.component';
import { NoBirthRecordComponent } from './no-birth-record/no-birth-record.component';
import { NoDeathRecordComponent } from './no-death-record/no-death-record.component';
import { CremationCertificateComponent } from './cremation-certificate/cremation-certificate.component';
/* Import birth and death certificate components start */

const routes: Routes = [
  { path: '', component: BirthCertiAppComponent },
  { path: ManageRoutes.getMainRoute('BR') + '/:id', component: BirthCertiAppComponent },
  { path: ManageRoutes.getMainRoute('DR') + '/:id', component: DeathCertificateComponent },
  { path: ManageRoutes.getMainRoute('NRC-BIRTH') + '/:id', component: NoBirthRecordComponent },
  { path: ManageRoutes.getMainRoute('NRC-DEATH') + '/:id', component: NoDeathRecordComponent },
  { path: ManageRoutes.getMainRoute('CR') + '/:id', component: CremationCertificateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BirthAndDeathRoutingModule { }
