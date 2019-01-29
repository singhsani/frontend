import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { AuthGuard } from './../../../core/guard/auth.guard';
import { ManageRoutes } from './../../../config/routes-conf';
/* Import all shared, core and routing module end */

const routes: Routes = [
  { path: '', redirectTo: ManageRoutes.getPrefixRoute('BIRTHANDDEATHMODULE'), pathMatch: 'full' },
  { path: ManageRoutes.getPrefixRoute('BIRTHANDDEATHMODULE'), loadChildren: './birth-and-death/birth-and-death.module#BirthAndDeathModule', canLoad: [AuthGuard] },
  { path: ManageRoutes.getPrefixRoute('MARRIAGEMODULE'), loadChildren: './marriage/marriage.module#MarriageModule', canLoad: [AuthGuard] },
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
  declarations: []
})
export class CertificatesModule { }
