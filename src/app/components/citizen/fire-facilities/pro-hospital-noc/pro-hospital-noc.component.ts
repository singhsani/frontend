import { FireFacilityConfig } from './../config/FireFacilityConfig';

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, Validator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import { CommonService } from '../../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { FireFacilitiesService } from '../common/services/fire-facilities.service';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DialogFormComponent } from '../common/components/dialog-form/dialog-form.component';
import * as moment from 'moment';

@Component({
	selector: 'app-pro-hospital-noc',
	templateUrl: './pro-hospital-noc.component.html',
	styleUrls: ['./pro-hospital-noc.component.scss']
})
export class ProHospitalNocComponent implements OnInit {

	provisionalHospitalNocForm: FormGroup;
	translateKey: string = 'provisionalHospitalNocScreen';

	formId: number;
	apiCode: string;
	fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();

	endDate = moment(new Date()).format('YYYY-MM-DD');
	// required attachment array
	uploadFilesArray: Array<any> = [];
	otherRiskNote: boolean = false;
	//Lookups Array
	FS_STAIR_CASE: Array<any> = [];
	FS_OTHER_RISKS: Array<any> = [];
	FS_FIRE_ALARM_ATTACHED_WTIH: Array<any> = [];
	FS_OTHER_BUSINESS_DETAIL: Array<any> = [];

	/**
	 * @param fb - Declare FormBuilder property.
	 * @param validationError - Declare validation service property
	 * @param formService - Declare form service property 
	 */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		public TranslateService: TranslateService,
		private commonService: CommonService,
		private toastrService: ToastrService,
		private fireFacilitiesService: FireFacilitiesService,
		private dialog: MatDialog
	) { }

	/**
	 * This method call initially required methods.
	 */
	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.formId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
			this.fireFacilitiesService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.getLookupData();
		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getprovisionaNocLicNewData();
			this.provisionalHospitalNocFormControls();

		}
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.provisionalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
		//check for attachment is mandatory
		this.dependentAttachment(this.provisionalHospitalNocForm.get('drawingWithScale').value, 'APPROVED_LAYOUT_PLAN');
		this.dependentAttachment(this.provisionalHospitalNocForm.get('drawingProvided').value, 'APPROVED_APPROACHED_ROAD');
		this.dependentAttachment(this.provisionalHospitalNocForm.get('trainedFiremanStaffKept').value, 'TRAIN_FIRE_PERSON_LIST');
	}

	/**
	 * Method is handel depended documents (depended on form field value ).
	 * @param event 
	 * @param dependedKey 
	 */
	dependentAttachment(eventValue: any, dependedKey: string) {

		var control = (<FormArray>this.provisionalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments')).controls
		var fields = control.find((data) => data.get('documentIdentifier').value === dependedKey);

		if (eventValue && fields) {
			fields.get('mandatory').setValue(true);
			if (fields.get('isActive').value && fields.get('requiredOnCitizenPortal').value) {
				this.uploadFilesArray.push({
					'labelName': fields.get('documentLabelEn').value,
					'fieldIdentifier': fields.get('fieldIdentifier').value,
					'documentIdentifier': dependedKey
				})
			}
		} else {
			if (fields) {
				fields.get('mandatory').setValue(false);
				var indewx = this.uploadFilesArray.findIndex((data) => data.documentIdentifier === dependedKey)
				if (indewx != -1) {
					this.uploadFilesArray.splice(indewx, 1);
				}
			}
		}

	}

	/**
	 * Method is used to get form data
	 */
	getprovisionaNocLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {

			try {
				this.provisionalHospitalNocForm.patchValue(res);
				this.fireFacilityConfig.isAttachmentButtonsVisible = true;

				//convert applicant name and set in applicantNameGuj filds 
				let applicantNameGujFields = this.provisionalHospitalNocForm.get('applicantNameGuj');
				let applicantNameValue = this.provisionalHospitalNocForm.get('applicantName').value;
				if (!applicantNameGujFields.value) {
					applicantNameGujFields.setValue(this.TranslateService.getEngToGujTranslation(applicantNameValue))
				}

				res.hospitalOTDetails.forEach(app => {
					(<FormArray>this.provisionalHospitalNocForm.get('hospitalOTDetails')).push(this.createOTDetailArray(app));
				});

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.provisionalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
				});
				this.requiredDocumentList();

			} catch (error) {
				console.log(error.message)
			}
		});
	}

	/**
	* Method is used to get lookup data
	*/
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.FS_OTHER_RISKS = res.FS_OTHER_RISKS;
			this.FS_STAIR_CASE = res.FS_STAIR_CASE;
			this.FS_FIRE_ALARM_ATTACHED_WTIH = res.FS_FIRE_ALARM_ATTACHED_WTIH;
			this.FS_OTHER_BUSINESS_DETAIL = res.FS_OTHER_BUSINESS_DETAIL;
		});
	}

	/**
	 * Method is used to set form controls
	 * 'Guj' control is consider as a Gujarati fields
	 */
	provisionalHospitalNocFormControls() {
		this.provisionalHospitalNocForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-PROVI-HOSPITAL',
			/* Step 1 controls start */
			provisionalNocNumber: [null],
			applicationDate: [{ value: null, disabled: true }],
			oldReferenceNumber: [null],
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			contactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],
			officeContactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],
			onsitePersonMobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			workOfficeEmailId: [null, [Validators.required, Validators.maxLength(50)]],
			
			medicalRegistrationNumber: [null, [Validators.required, Validators.maxLength(10)]],
			doctorName: [null, [Validators.required, Validators.maxLength(100)]],
			doctorNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			hospitalName: [null, [Validators.required, Validators.maxLength(50)]],
			hospitalNameGuj: [null, [Validators.required, Validators.maxLength(150)]],
			hospitalAddress: [null, [Validators.required, Validators.maxLength(300)]],
			hospitalAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
			ownerName: [null, [Validators.required, Validators.maxLength(100)]],
			ownerNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			ownerMobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			ownerAddress: [null, [Validators.required, Validators.maxLength(150)]],
			ownerAddressGuj: [null, [Validators.required, Validators.maxLength(300)]],

			fpNo: [null, [Validators.required, Validators.maxLength(8)]],
			rsNo: [null, [Validators.required, Validators.maxLength(8)]],
			tikaNo: [null, [Validators.required, Validators.maxLength(8)]],
			tpNo: [null, [Validators.required, Validators.maxLength(8)]],
			buildingLocation: [null, [Validators.required, Validators.maxLength(50)]],
			blockNo: [null, [Validators.maxLength(8)]],
			opNo: [null, [Validators.required, Validators.maxLength(8)]],
			citySurveyNo: [null, [Validators.required, Validators.maxLength(8)]],

			hospitalType: [null, [Validators.required, Validators.maxLength(50)]],
			numberOfBed: [null, [Validators.required, Validators.maxLength(3)]],
			numberOfOT: [null, [Validators.required, Validators.maxLength(3)]],
			hospitalOTDetails: this.fb.array([]),
			exerciseSection: [null, [Validators.required, Validators.maxLength(3)]],
			xraySection: [null, [Validators.required, Validators.maxLength(3)]],
			laboratoryDepartment: [null, [Validators.required, Validators.maxLength(50)]],
			otherInvestigation: [null, [Validators.required, Validators.maxLength(200)]],
			storeDetails: [null, [Validators.required, Validators.maxLength(200)]],
			kitchenDetails: [null, [Validators.required, Validators.maxLength(50)]],
			drawingWithScale: [null, [Validators.required, Validators.maxLength(10)]],//true false
			drawingProvided: [null, [Validators.required, Validators.maxLength(10)]],//true false
			multipleTowers: [null, [Validators.required, Validators.maxLength(10)]],//true false
			buildingHeight: [null, [Validators.required, Validators.maxLength(50)]],
			floorArea: [null, [Validators.required, Validators.maxLength(3)]],
			gateDetailing: [null, [Validators.required, Validators.maxLength(50)]],
			rampLiftStairDetails: [null, [Validators.required, Validators.maxLength(50)]],
			liftDetails: [null, [Validators.required, Validators.maxLength(50)]],
			noOfBasement: [null, [Validators.required, Validators.maxLength(5)]],
			lowerBasement: [null, [Validators.required, Validators.maxLength(3)]],
			upperBasement: [null, [Validators.required, Validators.maxLength(3)]],
			totalBuildingFloor: [null, [Validators.required, Validators.maxLength(3)]],
			basementArea: [null, [Validators.required, Validators.maxLength(3)]],
			noOfTowers: [null, [Validators.required, Validators.maxLength(3)]],
			noOfVentilation: [null, [Validators.required, Validators.maxLength(3)]],
			ventilationProvision: [null, [Validators.required, Validators.maxLength(10)]],//true false
			plotArea: [null, [Validators.required, Validators.maxLength(5)]],
			constructedArea: [null, [Validators.required, Validators.maxLength(5)]],
			noOfApproachedRoad: [null, [Validators.required, Validators.maxLength(3)]],


			architectRegistrationNumber: [null, [Validators.required, Validators.maxLength(15)]],
			architectName: [null, [Validators.required, Validators.maxLength(100)]],
			architectNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			architectFirmName: [null, [Validators.required, Validators.maxLength(50)]],
			architectFirmNameGuj: [null, [Validators.required, Validators.maxLength(150)]],
			architectFirmNumber: [null, [Validators.required, Validators.maxLength(20)]],
			architectContactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],

			noOfHospitalStaff: [null, [Validators.required, Validators.maxLength(4)]],
			noOfSecurityStaff: [null, [Validators.required, Validators.maxLength(4)]],
			otherRisks: [null],//array
			otherRiskDetail: [null, [Validators.maxLength(200)]],
			gasCylinderNOCDetail: [null, [Validators.required, Validators.maxLength(150)]],
			anyStoreProvision: [null, [Validators.required, Validators.maxLength(10)]],//true false
			stairCase: this.fb.group({
				code: [null, Validators.required]
			}),
			trainedFiremanStaffKept: [null, [Validators.required, Validators.maxLength(10)]],//true false
			exitGateDetail: [null, [Validators.required, Validators.maxLength(50)]],
			otherBusinessDetail: this.fb.group({
				code: [null]
			}),
			riskSegregation: [null, [Validators.required, Validators.maxLength(50)]],
			anyEvacuationPlan: [null, [Validators.required, Validators.maxLength(10)]],//true false
			evacuationDrillPerformed: [null, [Validators.required, Validators.maxLength(10)]],//true false
			firefightingSystemAvailability: [null, [Validators.required, Validators.maxLength(10)]],//true false
			yardHydrant: [null, [Validators.required, Validators.maxLength(100)]],
			raiserAvailability: [null, [Validators.required, Validators.maxLength(10)]],//true false
			noOfRaiser: [null, [Validators.required, Validators.maxLength(5)]],
			smokeDetector: [null, [Validators.maxLength(10)]],//true false
			sprinkler: [null, [Validators.required, Validators.maxLength(50)]],
			fireAlarmAttachedWith: this.fb.group({
				code: [null, [Validators.required]]
			}),
			autoExhaustSystem: [null, [Validators.required, Validators.maxLength(50)]],
			electricalSafety: [null, [Validators.required, Validators.maxLength(50)]],
			evacuationSignBoard: [null, [Validators.required, Validators.maxLength(50)]],
			refugeArea: [null, [Validators.required, Validators.maxLength(50)]],
			travelDistance: [null, [Validators.required, Validators.maxLength(5)]],
			overHeadWaterTankCapacity: [null, [Validators.required, Validators.maxLength(10)]],
			undergroundWaterTankCapacity: [null, [Validators.required, Validators.maxLength(10)]],
			alarmSystemTimeLimit: [null, [Validators.required, Validators.maxLength(10)]],
			highestFloodLevel: [null, [Validators.required, Validators.maxLength(10)]],
			parkingDetail: [null, [Validators.required, Validators.maxLength(100)]],
			riskAnalysisSurveyDetail: [null, [Validators.required, Validators.maxLength(50)]],
			nabhOwnership: [null, [Validators.required, Validators.maxLength(50)]],
			lastThreeYearFireIncidents: [null, [Validators.required, Validators.maxLength(50)]],
			servingSince: [null, [Validators.required, Validators.maxLength(200)]],

			/* Step 6 controls start*/
			attachments: []
			/* Step 6 controls end */
		});
	}

	/**
	 * Method is used to return array
	 * @param data : person data array 
	 */
	createOTDetailArray(data?: any) {
		return this.fb.group({
			// serviceFormId: this.formId,
			id: data.id ? data.id : null,
			otFacilities: [data.otFacilities ? data.otFacilities : null, [Validators.maxLength(150)]],
			areaInSquareMeterLength: [data.areaInSquareMeterLength ? data.areaInSquareMeterLength : null, [Validators.maxLength(5)]],
			areaInSquareMeterBreadth: [data.areaInSquareMeterLength ? data.areaInSquareMeterLength : null, [Validators.maxLength(5)]],
			areaInSquareMeter: [data.areaInSquareMeterLength ? data.areaInSquareMeterLength : null, [Validators.maxLength(5)]],
		})

	}
	/**
	 * This method for dialog component , it's collect OT details
	 */
	openDialog() {
		let returnArray = this.provisionalHospitalNocForm.get('hospitalOTDetails') as FormArray;
		if (returnArray.length >= 15) {
			this.commonService.openAlert("Warning", "Maximum Limit " + 15 + " .", "warning");
		} else if (this.provisionalHospitalNocForm.get('canEdit').value) {
			const dialogConfig = new MatDialogConfig();

			dialogConfig.disableClose = true;
			dialogConfig.autoFocus = true;
			dialogConfig.data = {};

			const dialogRef = this.dialog.open(DialogFormComponent, dialogConfig);

			dialogRef.afterClosed().subscribe(
				data => {
					if (data) {
						returnArray.push(this.createOTDetailArray(data));
						this.provisionalHospitalNocForm.get('numberOfOT').setValue(returnArray.length)
					}

				}
			);
		}
		else {
			this.commonService.openAlert("Warning", "OT Detail is already added", "warning");
		}
	}
	/**
	 * This methos for edit OT data
	 * @param arrayId : OT index
	 * @param otdata : object data
	 */
	editOT(arrayId: any, otdata: any) {
		let id = otdata.controls.id.value;
		let otFacilities = otdata.controls.otFacilities.value;
		let areaInSquareMeterLength = otdata.controls.areaInSquareMeterLength.value;
		let areaInSquareMeterBreadth = otdata.controls.areaInSquareMeterBreadth.value;
		let areaInSquareMeter = otdata.controls.areaInSquareMeter.value;

		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;

		dialogConfig.data = {
			id, otFacilities, areaInSquareMeterLength,
			areaInSquareMeterBreadth, areaInSquareMeter
		}

		const dialogRef = this.dialog.open(DialogFormComponent,
			dialogConfig);

		dialogRef.afterClosed().subscribe(
			val => {
				if (val) {
					let returnArray = this.provisionalHospitalNocForm.get('hospitalOTDetails') as FormArray;
					returnArray.controls[arrayId].setValue(val);
				}
			}
		);
	}

	/**
	 * Method is used to delete OT information from hospitalOTDetails array.
	 * @param OTData - OT data.
	 * @param index - index of hospitalOTDetails array
	 */
	deleteOT(OTData: any, index: number) {
		let returnArray = this.provisionalHospitalNocForm.get('hospitalOTDetails') as FormArray;
		// this.addItem(persontype).controls.splice(index, 1);
		this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			if (this.provisionalHospitalNocForm.get('numberOfOT').value >= 1) {
				if (OTData.id == null) {
					returnArray.removeAt(index);
					this.provisionalHospitalNocForm.get('numberOfOT').setValue(this.provisionalHospitalNocForm.get('numberOfOT').value - 1);
					this.toastrService.success('OT details has been removed.')
				} else {
					//call api get response than delete
					this.fireFacilitiesService.deleteArrayData(this.provisionalHospitalNocForm.get('id').value, OTData.id).subscribe(respData => {
						if (respData.success) {
							returnArray.removeAt(index);
							this.provisionalHospitalNocForm.get('numberOfOT').setValue(returnArray.length);
							this.toastrService.success('OT details has been removed.')
						}
					})
				}

			}
		}
		);
	}


	/**
	   * add other risk detail in otherRisks array 
	   * @param event : on change event value
	*/
	otherRemark(event: Event) {
		try {
			this.otherRiskNote = false;
			_.forEach(event, (value) => {
				if (value == 'OTHER') {
					this.otherRiskNote = true;
				}
			});
			if (!this.otherRiskNote) {
				this.provisionalHospitalNocForm.get('otherRiskDetail').reset();
			}
		} catch (e) {
			console.log(e)
		}
	}


	/**
	  * This method required for final form submition.
	  * @param flag - flag of invalid control.
	  */
	handleErrorsOnSubmit(flag) {

		let step0 = 11;
		let step1 = 23;
		let step2 = 31;
		let step3 = 60;
		let step4 = 67;
		let step5 = 101;

		if (flag != null) {
			//Check validation for step by step
			let count = flag;
			// console.log(flag);
			if (count <= step0) {
				this.fireFacilityConfig.currentTabIndex = 0;
				return false;
			} else if (count <= step1) {
				this.fireFacilityConfig.currentTabIndex = 1;
				return false;
			} else if (count <= step2) {
				this.fireFacilityConfig.currentTabIndex = 2;
				return false;
			} else if (count <= step3) {
				this.fireFacilityConfig.currentTabIndex = 3;
				return false;
			} else if (count <= step4) {
				this.fireFacilityConfig.currentTabIndex = 4;
				return false;
			} else if (count <= step5) {
				this.fireFacilityConfig.currentTabIndex = 5;
				return false;
			}
			else {
				console.log("else condition");
			}

		}
	}

	/**
	 * This method is handle depended documents on save event
	 * @param res - form response after save event
	 */
	handleOnSaveAndNext(res) {
		this.requiredDocumentList();
	}

	patchValue(){
		this.provisionalHospitalNocForm.patchValue(this.dummyJSON);
		this.dummyJSON.hospitalOTDetails.forEach(app => {
			(<FormArray>this.provisionalHospitalNocForm.get('hospitalOTDetails')).push(this.createOTDetailArray(app));
		});
	}

	dummyJSON:any = {
		"provisionalNocNumber": null,
		"oldReferenceNumber": null,
		"officeContactNo": "2222222222",
		"onsitePersonMobileNo": "2222222222",
		"workOfficeEmailId": "a@a.com",
		"medicalRegistrationNumber": "sdfsdfsdfs",
		"doctorName": "dsfsdfs",
		"doctorNameGuj": "દ્સ્ફ્સ્દ્ફ્સ",
		"hospitalName": "dfsdfsdfsdff",
		"hospitalNameGuj": "દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્ફ",
		"hospitalAddress": "sdfdsfdsfsdfdsf",
		"hospitalAddressGuj": "સ્દ્ફ્દ્સ્ફ્દ્સ્ફ્સ્દ્ફ્દ્સ્ફ",
		"ownerName": "sdfsdfsdf",
		"ownerNameGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
		"ownerMobileNo": "2342342342",
		"ownerAddress": "sdfsdfsdfsdfds",
		"ownerAddressGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્દ્સ",
		"fpNo": "54535435",
		"rsNo": "43543543",
		"tikaNo": "43543543",
		"tpNo": "45435435",
		"buildingLocation": "ghfghgfhgfh",
		"blockNo": '111',
		"opNo": "43543543",
		"citySurveyNo": "43543543",
		"hospitalType": "fdgfdgfdg",
		"numberOfBed": 435,
		"numberOfOT": 1,
		"hospitalOTDetails": [
		  {
			"id": 1,
			"otFacilities": "fdgfdgfdg",
			"areaInSquareMeterLength": 54354,
			"areaInSquareMeterBreadth": 54354,
			"areaInSquareMeter": 54354
		  }
		],
		"exerciseSection": 534,
		"xraySection": 435,
		"laboratoryDepartment": "435435435",
		"otherInvestigation": "435435435",
		"storeDetails": "435435",
		"kitchenDetails": "435435",
		"drawingWithScale": true,
		"drawingProvided": true,
		"multipleTowers": true,
		"buildingHeight": 435435424,
		"floorArea": 435,
		"gateDetailing": "ggffdggdfg",
		"rampLiftStairDetails": "fdgdfg",
		"liftDetails": "dggfdgfg",
		"noOfBasement": 34543,
		"lowerBasement": 435,
		"upperBasement": 435,
		"totalBuildingFloor": 435,
		"basementArea": 435,
		"noOfTowers": 435,
		"noOfVentilation": 435,
		"ventilationProvision": true,
		"plotArea": 43543,
		"constructedArea": 54354,
		"noOfApproachedRoad": 345,
		"architectRegistrationNumber": "345435345",
		"architectName": "fdgdfg",
		"architectNameGuj": "ફ્દ્ગ્દ્ફ્ગ",
		"architectFirmName": "dfgdfgdfgfdg",
		"architectFirmNameGuj": "દ્ફ્ગ્દ્ફ્ગ્દ્ફ્ગ્ફ્દ્ગ",
		"architectFirmNumber": "35435435",
		"architectContactNo": "435435435435",
		"noOfHospitalStaff": 12,
		"noOfSecurityStaff": 22,
		"otherRisks": [
		  "OXYGEN"
		],
		"otherRiskDetail": null,
		"gasCylinderNOCDetail": "sdfsdfsdf",
		"anyStoreProvision": true,
		"stairCase": {
		  "code": "EXTERNAL"
		},
		"trainedFiremanStaffKept": true,
		"exitGateDetail": "sdfsdf",
		"otherBusinessDetail": {
		  "code": "MEDICAL_STORE"
		},
		"riskSegregation": "sdfsdf",
		"anyEvacuationPlan": true,
		"evacuationDrillPerformed": true,
		"firefightingSystemAvailability": true,
		"yardHydrant": "sdfsdf",
		"raiserAvailability": true,
		"noOfRaiser": "111",
		"smokeDetector": true,
		"sprinkler": "111",
		"fireAlarmAttachedWith": {code: "SPRINKLER", name: "Sprinkler", gujName: "છંટકાવ કરનાર"},
		"autoExhaustSystem": "aaddd",
		"electricalSafety": "dsfsdfsdfsdf",
		"evacuationSignBoard": "sdfsdfsdf",
		"refugeArea": "sdfsdfsdf",
		"travelDistance": 2434,
		"overHeadWaterTankCapacity": 34234,
		"undergroundWaterTankCapacity": 34234,
		"alarmSystemTimeLimit": 234,
		"highestFloodLevel": 3424,
		"parkingDetail": "sfsdfsdf",
		"riskAnalysisSurveyDetail": "fsdfsdfsdf",
		"nabhOwnership": "sdfsdf",
		"lastThreeYearFireIncidents": "fdgfdgfdgfdg",
		"servingSince": "33",
		"fileStatus": "DRAFT",
		"serviceName": null,
		"fileNumber": null,
		"pid": null,
		"outwardNo": null,
		"agree": false,
		"paymentStatus": null,
		"canEdit": true,
		"canDelete": true,
		"canSubmit": true,
		"serviceDetail": {
		  "code": "FS-PROVI-HOSPITAL",
		  "name": "Provisional NOC For Hospital",
		  "gujName": "હોસ્પિટલ માટે અનિવાર્ય એનઓસી",
		  "feesOnScrutiny": false,
		  "appointmentRequired": false
		}
	  };
}

