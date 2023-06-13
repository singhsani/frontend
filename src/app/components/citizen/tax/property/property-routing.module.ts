import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillPrintingModule } from './bill-printing/bill-printing.module';
import { UpdateEmailMobileComponent } from './update-email-mobile/update-email-mobile.component';

const routes: Routes = [

	{ path: 'extractOfProperty', loadChildren: './extract-property/extract-property.module#ExtractPropertyModule' },
	{ path: 'transferOfProperty', loadChildren: './transfer-property/transfer-property.module#TransferPropertyModule' },
	{ path: 'transferOfProperty/:id/:apiCode', loadChildren: './transfer-property/transfer-property.module#TransferPropertyModule' },
	{ path: 'noDueCertificate', loadChildren: './no-due-certificate/no-due-certificate.module#NoDueCertificateModule' },
	{ path: 'duplicateBill', loadChildren: './duplicate-bill/duplicate-bill.module#DuplicateBillModule' },
	{ path: 'assessmentCertificate', loadChildren: './assessment-certificate/assessment-certificate.module#AssessmentCertificateModule' },
	{ path: 'vacantPremisesCertificate', loadChildren: './vacancy-premise-certificate/vacancy-premise-certificate.module#VacancyPremiseCertificateModule' },
	{ path: 'vacantPremisesCertificate/:id/:apiCode', loadChildren: './vacancy-premise-certificate/vacancy-premise-certificate.module#VacancyPremiseCertificateModule' },
	
	{ path: 'propertyTaxRebate', loadChildren: './tax-rebate-application/tax-rebate-application.module#TaxRebateApplicationModule' },
	{ path: 'refundAgainstVacancy', loadChildren: './refund-application/refund-application.module#RefundApplicationModule' },
	{ path: 'refundAgainstVacancy/:id/:apiCode', loadChildren: './refund-application/refund-application.module#RefundApplicationModule' },
	{ path: 'propertyAssessment', loadChildren: './new-property-entry-add/new-property-entry-add.module#NewPropertyEntryAddModule' },
	{ path: 'propertyAssessment/:id/:apiCode', loadChildren: './new-property-entry-add/new-property-entry-add.module#NewPropertyEntryAddModule' },
	{ path: 'revaluation', loadChildren: './revaluation/revaluation.module#RevaluationModule' },
	{ path: 'bill-printing', loadChildren: './bill-printing/bill-printing.module#BillPrintingModule' },	
	{ path: 'update-email-mobile', component:UpdateEmailMobileComponent},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PropertyRoutingModule { }
