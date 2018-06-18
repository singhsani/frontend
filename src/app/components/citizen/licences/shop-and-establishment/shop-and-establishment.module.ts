import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { ShopAndEstablishmentRoutingModule } from './shop-and-establishment-routing.module';
import { ShopLicNewComponent } from './shop-lic-new/shop-lic-new.component';
import { ShopLicDuplicateComponent } from './shop-lic-duplicate/shop-lic-duplicate.component';
import { ShopLicModificationComponent } from './shop-lic-modification/shop-lic-modification.component';
import { ShopLicRenewalComponent } from './shop-lic-renewal/shop-lic-renewal.component';
import { ShopLicCancellationComponent } from './shop-lic-cancellation/shop-lic-cancellation.component';
import { NewShopEstablishmentService } from './common/services/new-shop-establishment.service';
/* Import all shared, core and routing module end */

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
    ShopLicNewComponent,
    ShopLicDuplicateComponent,
    ShopLicModificationComponent,
    ShopLicRenewalComponent,
    ShopLicCancellationComponent],

  providers: [NewShopEstablishmentService]
})
export class ShopAndEstablishmentModule { }
