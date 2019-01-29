import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageRoutes } from '../../../../config/routes-conf';
import { PropertyNewAssessmentComponent } from './property-new-assessment/property-new-assessment.component';
import { PropertyExtractComponent } from './property-extract/property-extract.component';
import { PropertyTransferComponent } from './property-transfer/property-transfer.component';
import { PropertyDuplicateBillComponent } from './property-duplicate-bill/property-duplicate-bill.component';
import { PropertyNoDueComponent } from './property-no-due/property-no-due.component';
import { PropertyReAssessmentAppComponent } from './property-re-assessment-app/property-re-assessment-app.component';
import { PropertySplittingComponent } from './property-splitting/property-splitting.component';
import { PropertyVacantPremisesAppComponent } from './property-vacant-premises-app/property-vacant-premises-app.component';
import { PropertyAssessmentCertificateComponent } from './property-assessment-certificate/property-assessment-certificate.component';

const routes: Routes = [
	{ path: '', component: PropertyNewAssessmentComponent },
	{ path: ManageRoutes.getMainRoute('PRO-ASS') + '/:id/:apiCode', component: PropertyNewAssessmentComponent },
	{ path: ManageRoutes.getMainRoute('PRO-EXT') + '/:id/:apiCode', component: PropertyExtractComponent },
	{ path: ManageRoutes.getMainRoute('PRO-TRAN') + '/:id/:apiCode', component: PropertyTransferComponent },
	{ path: ManageRoutes.getMainRoute('PRO-DUP') + '/:id/:apiCode', component: PropertyDuplicateBillComponent },
	{ path: ManageRoutes.getMainRoute('PRO-NDU') + '/:id/:apiCode', component: PropertyNoDueComponent },
	{ path: ManageRoutes.getMainRoute('PRO-REASS') + '/:id/:apiCode', component: PropertyReAssessmentAppComponent },
	{ path: ManageRoutes.getMainRoute('PRO-SPLI') + '/:id/:apiCode', component: PropertySplittingComponent },
	{ path: ManageRoutes.getMainRoute('PRO-VAC') + '/:id/:apiCode', component: PropertyVacantPremisesAppComponent },
	{ path: ManageRoutes.getMainRoute('PRO-ASSCER') + '/:id/:apiCode', component: PropertyAssessmentCertificateComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PropertyRoutingModule { }
