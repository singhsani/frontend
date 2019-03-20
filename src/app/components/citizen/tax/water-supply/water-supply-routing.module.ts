import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: 'newWaterConnectionEntry', loadChildren: './new-water-connection-entry/new-water-connection-entry.module#NewWaterConnectionEntryModule' },
  // { path: 'disconnection', loadChildren: './application-disconnection/application-disconnection.module#ApplicationDisconnectionModule' },
  // { path: 'transferOfOwnership', loadChildren: './application-transfer-ownership/application-transfer-ownership.module#ApplicationTransferOwnershipModule' },
  // { path: 'changeOfUsage', loadChildren: './application-change-usage/application-change-usage.module#ApplicationChangeUsageModule' },
  // { path: 'reconnection', loadChildren: './application-reconnection/application-reconnection.module#ApplicationReconnectionModule' },
  // { path: 'newPlumberLiecence', loadChildren: './new-plumber-license/new-plumber-license.module#NewPlumberLicenseModule' },
  // { path: 'renewalPlumberLiecence', loadChildren: './renewal-plumber-license/renewal-plumber-license.module#RenewalPlumberLicenseModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaterSupplyRoutingModule { }
