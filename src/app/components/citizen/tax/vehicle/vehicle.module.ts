import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';

import { NewRegistrationComponent } from './new-registration/new-registration.component';
import { Routes, RouterModule } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { AuthGuard } from '../../../../core/guard/auth.guard';

const routes: Routes = [
  { path: ManageRoutes.getMainRoute('VEHICLE') + '/:id/:apiCode', component: NewRegistrationComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewRegistrationComponent]
})
export class VehicleModule { }
