import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';
import { AuthGuard } from './../../../core/guard/auth.guard';
import { ManageRoutes } from './../../../config/routes-conf';

const routes: Routes = [
  { path: '', redirectTo: 'shop-esta', pathMatch: 'full' },
  { path: 'animal-pond', loadChildren: './animal-pond/animal-pond.module#AnimalPondModule', canLoad: [AuthGuard] },
  { path: 'mutton-fish', loadChildren: './mutton-fish/mutton-fish.module#MuttonFishModule', canLoad: [AuthGuard] },
  { path: 'shop-esta', loadChildren: './shop-and-establishment/shop-and-establishment.module#ShopAndEstablishmentModule', canLoad: [AuthGuard] },
  { path: 'food', loadChildren: './food/food.module#FoodModule', canLoad: [AuthGuard] },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class LicencesModule { }
