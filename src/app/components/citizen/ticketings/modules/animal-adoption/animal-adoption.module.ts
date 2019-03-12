import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalAdoptionComponent } from './animal-adoption/animal-adoption.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { AnimalAdoptionRoutingModule } from './animal-adoption-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AnimalAdoptionRoutingModule
  ],
  declarations: [AnimalAdoptionComponent]
})
export class AnimalAdoptionModule { }
