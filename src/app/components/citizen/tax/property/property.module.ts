import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyNewAssessmentComponent } from './property-new-assessment/property-new-assessment.component';
import { PropertyExtractComponent } from './property-extract/property-extract.component';
import { PropertyTransferComponent } from './property-transfer/property-transfer.component';
import { PropertyDuplicateBillComponent } from './property-duplicate-bill/property-duplicate-bill.component';
import { PropertyNoDueComponent } from './property-no-due/property-no-due.component';
import { PropertyReAssessmentAppComponent } from './property-re-assessment-app/property-re-assessment-app.component';
import { PropertySplittingComponent } from './property-splitting/property-splitting.component';
import { PropertyVacantPremisesAppComponent } from './property-vacant-premises-app/property-vacant-premises-app.component';
import { PropertyAssessmentCertificateComponent } from './property-assessment-certificate/property-assessment-certificate.component';

@NgModule({
  imports: [
    CommonModule,
    PropertyRoutingModule
  ],
  declarations: [PropertyNewAssessmentComponent, PropertyExtractComponent, PropertyTransferComponent, PropertyDuplicateBillComponent, PropertyNoDueComponent, PropertyReAssessmentAppComponent, PropertySplittingComponent, PropertyVacantPremisesAppComponent, PropertyAssessmentCertificateComponent]
})
export class PropertyModule { }
