import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

import { ExtractPropertyComponent } from './Components/extract-property/extract-property.component';
import { ExtractPropertyService } from './Services/extract-property.service';
import { ExtractPropertySearchComponent } from './Components/extract-property-search/extract-property-search.component';
import { ExtractPropertyTableComponent } from './Components/extract-property-table/extract-property-table.component';
import { ExtractPropertyDataSharingService } from './Services/extract-property-data-sharing.service';
import { SharedComponentModule } from 'src/app/vmcshared/shared-component.module';

const routes: Routes = [
  { path: '', component: ExtractPropertyComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedComponentModule
  ],
  declarations: [
    ExtractPropertyComponent,
    ExtractPropertySearchComponent,
    ExtractPropertyTableComponent
  ],
  providers: [
    ExtractPropertyService,
    ExtractPropertyDataSharingService
  ]
})
export class ExtractPropertyModule { }
