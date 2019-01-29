import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { ManageRoutes } from './../../../../config/routes-conf';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';

import { ShopLicNewComponent } from './shop-lic-new/shop-lic-new.component';
import { ShopLicDuplicateComponent } from './shop-lic-duplicate/shop-lic-duplicate.component';
import { ShopLicModificationComponent } from './shop-lic-modification/shop-lic-modification.component';
import { ShopLicRenewalComponent } from './shop-lic-renewal/shop-lic-renewal.component';
import { ShopLicCancellationComponent } from './shop-lic-cancellation/shop-lic-cancellation.component';
import { ShopAndEstablishmentService } from './common/services/shop-and-establishment.service';
import { FilterAttachmentPipe } from './common/pipes/filter-attachment.pipe';
/* Import all shared, core and routing module end */

const routes: Routes = [
  { path: '', redirectTo: ManageRoutes.getMainRoute('SHOP-LIC'), pathMatch: 'full' },
  { path: ManageRoutes.getMainRoute('SHOP-LIC') + '/:id/:apiCode', component: ShopLicNewComponent },
  { path: ManageRoutes.getMainRoute('SHOP-CAN') + '/:id/:apiCode', component: ShopLicCancellationComponent },
  { path: ManageRoutes.getMainRoute('SHOP-DUP') + '/:id/:apiCode', component: ShopLicDuplicateComponent },
  { path: ManageRoutes.getMainRoute('SHOP-REN') + '/:id/:apiCode', component: ShopLicRenewalComponent },
  { path: ManageRoutes.getMainRoute('SHOP-TRAF') + '/:id/:apiCode', component: ShopLicModificationComponent }
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
    ShopLicDuplicateComponent,
    ShopLicModificationComponent,
    ShopLicRenewalComponent,
    ShopLicCancellationComponent,
    FilterAttachmentPipe],

  providers: [ShopAndEstablishmentService]
})
export class ShopAndEstablishmentModule { }
