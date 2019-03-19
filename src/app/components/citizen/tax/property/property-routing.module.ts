import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

	// { path: 'extractOfProperty/:id/:apiCode', loadChildren: './extract-property/extract-property.module#ExtractPropertyModule' },
	// { path: 'transferOfProperty/:id/:apiCode', loadChildren: './transfer-property/transfer-property.module#TransferPropertyModule' },
	// { path: 'noDueCertificate/:id/:apiCode', loadChildren: './no-due-certificate/no-due-certificate.module#NoDueCertificateModule' },
	// { path: 'duplicateBill/:id/:apiCode', loadChildren: './duplicate-bill/duplicate-bill.module#DuplicateBillModule' },
	// { path: 'assessmentCertificate/:id/:apiCode', loadChildren: './assessment-certificate/assessment-certificate.module#AssessmentCertificateModule' },
	// { path: 'vacantPremisesCertificate/:id/:apiCode', loadChildren: './vacancy-premise-certificate/vacancy-premise-certificate.module#VacancyPremiseCertificateModule' },
	
	// { path: 'tax-rebate-application/:id/:apiCode', loadChildren: './tax-rebate-application/tax-rebate-application.module#TaxRebateApplicationModule' },
	// { path: 'refund-application/:id/:apiCode', loadChildren: './refund-application/refund-application.module#RefundApplicationModule' },
	// { path: 'tax-transaction-history/:id/:apiCode', loadChildren: './tax-transaction-history/tax-transaction-history.module#TaxTransactionHistoryModule' },
	// { path: 'revaluation/:id/:apiCode', loadChildren: './revaluation/revaluation.module#RevaluationModule' },
	// { path: 'new-property-entry/:id/:apiCode', loadChildren: './new-property-entry-add/new-property-entry-add.module#NewPropertyEntryAddModule' },

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PropertyRoutingModule { }
