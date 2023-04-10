import { ManageRoutes } from './../../../config/routes-conf';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import { Router } from '@angular/router';

import { CommonService } from './../../services/common.service';
import { ValidationService } from './../../services/validation.service';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';
import { SessionStorageService } from 'angular-web-storage';
import { environment } from '../../../../environments/environment';
import { MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-applicant-details',
	templateUrl: './applicant-details.component.html',
	styleUrls: ['./applicant-details.component.scss']
})
export class ApplicantDetailsComponent implements OnInit, OnChanges {

	applicantDetailsForm : FormGroup;

	constructor(
		private session: SessionStorageService,
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<ApplicantDetailsComponent>) {
	}

	/**
	 * Method initialize other opertaions.
	 */
	ngOnInit() {

		this.applicantDetailsForm = this.fb.group({
			applicantName : [null,[Validators.required,ValidationService.nameValidator]],
			cellNo: [null, [Validators.maxLength(10), Validators.minLength(10)]],
			email: [null, ValidationService.emailValidator]
		});
	
	}

	ngOnChanges() {
	
	}

	save() {
		this.dialogRef.close(this.applicantDetailsForm.value);
	}

	cancel(){
		this.dialogRef.close(null);
	}
	

}