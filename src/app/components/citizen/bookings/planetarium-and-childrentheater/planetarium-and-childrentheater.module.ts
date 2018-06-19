import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanetariumAndChildrentheaterRoutingModule } from './planetarium-and-childrentheater-routing.module';
import { PlanetariumComponent } from './planetarium/planetarium.component';
import { ChildrenTheaterComponent } from './children-theater/children-theater.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    PlanetariumAndChildrentheaterRoutingModule
  ],
  declarations: [PlanetariumComponent, ChildrenTheaterComponent, DashboardComponent]
})
export class PlanetariumAndChildrentheaterModule { }
