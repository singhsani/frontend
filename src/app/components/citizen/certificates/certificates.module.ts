import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';
import { CertificatesRoutingModule } from './certificates-routing.module';
/* Import all shared, core and routing module end */

/* Import certificate components start */

/* Import certificate components end */

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    CertificatesRoutingModule
  ],
  declarations: []
})
export class CertificatesModule { }
