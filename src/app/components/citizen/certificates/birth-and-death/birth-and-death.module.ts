import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* Import all shared, core and routing module start */
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';
import { ManageRoutes } from './../../../../config/routes-conf';
/* Import all shared, core and routing module end */

/* Import birth and death certificate components start */
import { NoBirthRecordComponent } from './no-birth-record/no-birth-record.component';
import { NoDeathRecordComponent } from './no-death-record/no-death-record.component';
import { CremationCertificateComponent } from './cremation-certificate/cremation-certificate.component';
import { BirthDuplicateComponent } from './birth-duplicate/birth-duplicate.component';
import { DeathDuplicateComponent } from './death-duplicate/death-duplicate.component';
import { BirthCorrectionComponent } from './birth-correction/birth-correction.component';
import { DeathCorrectionComponent } from './death-correction/death-correction.component';
import { RecordSearchComponent } from './record-search/record-search.component';
import { Routes, RouterModule } from '@angular/router';
/* Import birth and death certificate components start */

const routes: Routes = [
	{ path: '', component: NoBirthRecordComponent },
	{ path: ManageRoutes.getMainRoute('HEL-NRCBR') + '/:id/:apiCode', component: NoBirthRecordComponent },
	{ path: ManageRoutes.getMainRoute('HEL-NRCDR') + '/:id/:apiCode', component: NoDeathRecordComponent },
	{ path: ManageRoutes.getMainRoute('HEL-CR') + '/:id/:apiCode', component: CremationCertificateComponent },
	{ path: ManageRoutes.getMainRoute('HEL-DUPBR') + '/:id/:apiCode', component: BirthDuplicateComponent },
	{ path: ManageRoutes.getMainRoute('HEL-DUPDR') + '/:id/:apiCode', component: DeathDuplicateComponent },
	{ path: ManageRoutes.getMainRoute('HEL-BCR') + '/:id/:apiCode', component: BirthCorrectionComponent },
	{ path: ManageRoutes.getMainRoute('HEL-DCR') + '/:id/:apiCode', component: DeathCorrectionComponent },
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
		NoBirthRecordComponent,
		NoDeathRecordComponent,
		CremationCertificateComponent,
		BirthDuplicateComponent,
		DeathDuplicateComponent,
		BirthCorrectionComponent,
		DeathCorrectionComponent,
		RecordSearchComponent,
	]
})
export class BirthAndDeathModule { }
