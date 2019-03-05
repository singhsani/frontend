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
	{ path: 'NRCBirth/:id/:apiCode', component: NoBirthRecordComponent },
	{ path: 'NRCDeath/:id/:apiCode', component: NoDeathRecordComponent },
	{ path: 'cremationReg/:id/:apiCode', component: CremationCertificateComponent },
	{ path: 'duplicateBirthReg/:id/:apiCode', component: BirthDuplicateComponent },
	{ path: 'duplicateDeathReg/:id/:apiCode', component: DeathDuplicateComponent },
	{ path: 'birthCorrectionReg/:id/:apiCode', component: BirthCorrectionComponent },
	{ path: 'deathCorrectionReg/:id/:apiCode', component: DeathCorrectionComponent },
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
