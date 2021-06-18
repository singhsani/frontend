import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalAdoptionComponent } from './animal-adoption/animal-adoption.component';
import { AnimalAdoptionRoutingModule } from './animal-adoption-routing.module';
import { SharedTicketingModule } from '../../shared-ticketing/shared-ticketing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedTicketingModule,
    AnimalAdoptionRoutingModule
  ],
  declarations: [AnimalAdoptionComponent]
})
export class AnimalAdoptionModule { }
