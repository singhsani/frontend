import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LicencesRoutingModule } from './licences-routing.module';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';
import { MuttonFishLicenceComponent } from './mutton-fish-licence/mutton-fish-licence.component';
import { ShopEstablishLicenceComponent } from './shop-establish-licence/shop-establish-licence.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    LicencesRoutingModule
  ],
  declarations: [ShopEstablishLicenceComponent, MuttonFishLicenceComponent]
})
export class LicencesModule { }
