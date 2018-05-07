import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { ShopAndEstablishmentRoutingModule } from './shop-and-establishment-routing.module';
/* Import all shared, core and routing module end */

import { ShopEstablishLicenceComponent } from './shop-establish/shop-establish.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    ShopAndEstablishmentRoutingModule
  ],
  declarations: [
    ShopEstablishLicenceComponent,
  ]
})
export class ShopAndEstablishmentModule { }
