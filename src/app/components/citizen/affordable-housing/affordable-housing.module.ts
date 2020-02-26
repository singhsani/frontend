import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AffordableHousingRoutingModule } from './affordable-housing-routing.module';
import { NewAffordableHousingComponent } from './new-affordable-housing/new-affordable-housing.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AffordableHousingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [NewAffordableHousingComponent]
})
export class AffordableHousingModule { }
