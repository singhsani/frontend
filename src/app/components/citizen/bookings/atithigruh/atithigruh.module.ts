import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtithigruhRoutingModule } from './atithigruh-routing.module';
import { BookAtithigruhComponent } from './book-atithigruh/book-atithigruh.component';

@NgModule({
  imports: [
    CommonModule,
    AtithigruhRoutingModule
  ],
  declarations: [BookAtithigruhComponent]
})
export class AtithigruhModule { }
