import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { ManageRoutes } from '../../../../config/routes-conf';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { ShopLicNewComponent } from './shop-lic-new/shop-lic-new.component';




import { ShopAndEstablishmentService } from './common/services/shop-and-establishment.service';
import { FilterAttachmentPipe } from './common/pipes/filter-attachment.pipe';
import { TaxRebateApplicationService } from '../../tax/property/tax-rebate-application/Services/tax-rebate-application.service';
import { ShopLicTransferComponent } from './shop-lic-transfer/shop-lic-transfer.component';
import { ShopLicCloseComponent } from './shop-lic-close/shop-lic-close.component';
/* Import all shared, core and routing module end */

const routes: Routes = [
  { path: '', redirectTo: 'shop', pathMatch: 'full' },
  { path: 'shop/:id/:apiCode', component: ShopLicNewComponent },
  { path: 'shop-transfer/:id/:apiCode', component: ShopLicTransferComponent },
  { path: 'shop-close/:id/:apiCode', component: ShopLicCloseComponent }
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
  declarations: [
    ShopLicNewComponent,
    FilterAttachmentPipe,
    ShopLicTransferComponent,
    ShopLicCloseComponent
  ],

  providers: [ShopAndEstablishmentService,TaxRebateApplicationService]
})
export class ShopAndEstablishmentActModule { }
