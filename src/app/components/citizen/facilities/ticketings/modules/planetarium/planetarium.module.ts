import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanetariumRoutingModule } from './planetarium-routing.module';
import { BookPlanetariumComponent } from './book-planetarium/book-planetarium.component';
import { SharedTicketingModule } from '../../shared-ticketing/shared-ticketing.module';

@NgModule({
  imports: [
    CommonModule,
    PlanetariumRoutingModule,
    SharedTicketingModule
  ],
  declarations: [BookPlanetariumComponent]
})
export class PlanetariumModule {}
