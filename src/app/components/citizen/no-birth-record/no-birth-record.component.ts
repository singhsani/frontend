import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';

import { ValidationService } from '../../../shared/services/validation.service';
import { UploadFileService } from './../../../shared/upload-file.service';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'app-no-birth-record',
	templateUrl: './no-birth-record.component.html',
	styleUrls: ['./no-birth-record.component.scss']
})
export class NoBirthRecordComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	noRecordBirthForm: FormGroup;

	selectedFiles: FileList
	currentFileUpload: File
	progress: { percentage: number } = { percentage: 0 }
	fileData: any;
	appId: number;
	maxDate: Date = new Date();
	relationshipArray: any = [];
	genderArray: any = [];
	placeArray: any = [];

	// Step Titles
	stepLable1: string = "No Record Certificate Detail";
	stepLable2: string = "Birth Place Address Detail";
	stepLable3: string = "Applicant Detail";

	// for progress bar
	color = 'primary';
	mode = 'determinate';

	constructor(private fb: FormBuilder, private validationService: ValidationService,
		private uploadFileService: UploadFileService, private router: Router, private route: ActivatedRoute,
		private formService: FormsActionsService, private toastr: ToastrService) {

		this.formService.apiType = 'NRCBirth';
	}

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
		});

		this.getNoRecordBirthData();
		this.getLookupData();
		this.nrcBirthCertFormControls();
	}

	nrcBirthCertFormControls() {

		this.noRecordBirthForm = this.fb.group({

			// step 1 form controls starts 
			applicationNo: [null, Validators.required],
			registrationNo: [null, Validators.required],
			childName: [null, Validators.required],

			gender: this.fb.group({
				code: [null, Validators.required],
			}),

			birthDate: [null, Validators.required],

			birthPlace: this.fb.group({
				code: [null, Validators.required],
			}),

			fatherName: [null, Validators.required],
			motherName: [null, Validators.required],
			// step 1 form controls ends 

			// step 2 form controls starts 
			birthPlaceAddress: this.fb.group({
				addressType: "NRC_BIRTH_PLACE_ADDRESS",
				houseNo: null,
				tenamentNo: null,
				buildingName: null,
				state: null,
				district: null,
				talukaName: null,
				pincode: null,
				addressLine1: null,
				addressLine2: null,
				addressLine3: null,
				village: null
			}),

			// step 2 form controls ends 

			// step 3 form controls starts 
			applicantName: [null, Validators.required],

			applicantRelation: this.fb.group({
				code: [null, Validators.required]
			}),

			applicantContactNo: [null, Validators.required],
			applicantEmail: [null, Validators.required],
			attachments: [],
			reasonDetail: null,
			// step 3 form controls ends 

			// extra's importnat controls 
			id: 0,
			uniqueId: null,
			version: 0,
			serviceFormId: 0,
			createdDate: null,
			updatedDate: null,
			serviceType: null,
			fileStatus: null,
		});
	}

	/**
	 * This method use for get the citizen data
	 */
	getNoRecordBirthData() {
		this.formService.getFormData(this.appId).subscribe(res => {

			if (res.birthPlace == null) {
				res.birthPlace = {};
			}
			if (res.gender == null) {
				res.gender = {};
			}
			if (res.birthPlaceAddress == null) {
				res.birthPlaceAddress = {};
			}
			if (res.applicantRelation == null) {
				res.applicantRelation = {};
			}
			this.noRecordBirthForm.patchValue(res);
		});
	}

	onDateChange(date) {
		this.noRecordBirthForm.get('birthDate').setValue(moment(date).format("YYYY-DD-MM"));
	}

	saveAsDraft(value) {
		this.formService.saveFormData(value).subscribe(res => {
			this.toastr.success('NCR information successfully saved');
		});
	}

	onSubmit() {
		this.formService.submitFormData(this.appId).subscribe(res => {
			console.log(res);
		});
	}

	getLookupData(){
		this.formService.getDataFromLookups().subscribe(res =>{

			this.genderArray = res.GENDER;
			this.placeArray = res.PLACE;
			this.relationshipArray = res.RELATIONSHIP;
		});
	}

	proceedToPayment() {

	}

	selectFile(event) {
		this.selectedFiles = event.target.files;
	}

	upload(indentifier) {

		let formData = new FormData();

		formData.append('fieldIdentifier', indentifier.toString());
		formData.append('labelName', 'NRCBirth');
		formData.append('formPart', '3');
		formData.append('variableName', 'test');
		formData.append('serviceFormId', this.appId.toString());

		this.progress.percentage = 0;

		this.currentFileUpload = this.selectedFiles.item(0);

		formData.append('file', this.currentFileUpload);

		this.uploadFileService.processFileToServer(formData, setProgressBar => {
			this.progress.percentage = setProgressBar;
		}, successResponse => {
			console.log(successResponse);
			this.currentFileUpload = undefined;
		});

		this.selectedFiles = undefined;
	}


}
