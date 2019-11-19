import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DialogFormComponent } from '../common/components/dialog-form/dialog-form.component';
import * as moment from 'moment';

@Component({
	selector: 'app-final-hospital-noc',
	templateUrl: './final-hospital-noc.component.html',
	styleUrls: ['./final-hospital-noc.component.scss']
})
export class FinalHospitalNocComponent implements OnInit {

	finalHospitalNocForm: FormGroup;
	translateKey: string = 'finalHospitalNocScreen';

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

	// serach api variable
	serachLicenceObj = {
		isDisplayRenewLicenceForm: <boolean>false,
		searchLicenceNumber: <string>""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		this.fireFacilitiesService.searchFinalHospitalNOC(this.serachLicenceObj.searchLicenceNumber).subscribe(
			(res: any) => {

				if (res.success) {
					this.serachLicenceObj.isDisplayRenewLicenceForm = true;
					this.createRecordPatchSerachData(res.data);
				} else {
					this.serachLicenceObj.isDisplayRenewLicenceForm = false;
				}
			}, (err: any) => {
				this.serachLicenceObj.isDisplayRenewLicenceForm = false;
				if (err.error && err.error.length) {
					this.commonService.openAlert("Warning", err.error[0].message, "warning");
				}
			})
	}

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
		private location: Location,
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
		this.finalHospitalNocFormControls();

		if (!this.formId) {
			this.serachLicenceObj.isDisplayRenewLicenceForm = false;
		}
		else {
			this.serachLicenceObj.isDisplayRenewLicenceForm = true;
			this.getprovisionaNocLicNewData();
		}
	}

	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		_.forEach(this.finalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
		//check for attachment is mandatory
		this.dependentAttachment(this.finalHospitalNocForm.get('drawingWithScale').value, 'APPROVED_LAYOUT_PLAN');
		this.dependentAttachment(this.finalHospitalNocForm.get('drawingProvided').value, 'APPROVED_APPROACHED_ROAD');
		this.dependentAttachment(this.finalHospitalNocForm.get('trainedFiremanStaffKept').value, 'TRAIN_FIRE_PERSON_LIST');
	}

	/**
	 * Method is handel depended documents (depended on form field value ).
	 * @param event 
	 * @param dependedKey 
	 */
	dependentAttachment(eventValue: any, dependedKey: string) {

		var control = (<FormArray>this.finalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments')).controls
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
				this.finalHospitalNocForm.patchValue(res);
				this.fireFacilityConfig.isAttachmentButtonsVisible = true;

				res.hospitalOTDetails.forEach(app => {
					(<FormArray>this.finalHospitalNocForm.get('hospitalOTDetails')).push(this.createOTDetailArray(app));
				});

				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.finalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
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
	   * This method is use to create new record for citizen.
	   * @param searchData: exciting licence number data
	   */
	createRecordPatchSerachData(searchData: any) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {

			this.formId = res.serviceFormId;
			this.finalHospitalNocForm.patchValue(searchData);

			this.finalHospitalNocForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				serviceFormId: res.serviceFormId,
				hospitalNocNumber: this.serachLicenceObj.searchLicenceNumber,
				createdDate: res.createdDate,
				updatedDate: res.createdDate,
				serviceType: res.serviceType,
				// deptFileStatus: res.deptFileStatus,
				serviceName: res.serviceName,
				fileNumber: res.fileNumber,
				pid: res.pid,
				outwardNo: res.outwardNo,
				agree: res.agree,

				paymentStatus: res.paymentStatus,
				canEdit: res.canEdit,
				canDelete: res.canDelete,
				canSubmit: res.canSubmit,
				serviceCode: res.serviceCode,
				applicationNo: res.applicationNo,
				finalFireNocNumber: res.finalFireNocNumber,

				// periodFrom: res.periodFrom,
				// periodTo: res.periodTo,
				// newRegistration: res.newRegistration,
				// renewal: res.renewal,
				// adminCharges: res.adminCharges,
				// netAmount: res.netAmount,
				// licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				serviceDetail: res.serviceDetail,
				attachments: []
			});

			this.fireFacilityConfig.isAttachmentButtonsVisible = true;
			searchData.hospitalOTDetails.forEach(app => {
				(<FormArray>this.finalHospitalNocForm.get('hospitalOTDetails')).push(this.createOTDetailArray(app));
			});

			res.serviceDetail.serviceUploadDocuments.forEach(app => {
				app.id = null;
				(<FormArray>this.finalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.fireFacilityConfig.createDocumentsGrp(app));
			});
			this.requiredDocumentList();

			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});

	}

	/**
	 * Method is used to set form controls
	 * 'Guj' control is consider as a Gujarati fields
	 */
	finalHospitalNocFormControls() {
		this.finalHospitalNocForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-FINAL-HOSPITAL',
			/* Step 1 controls start */
			provisionalNocNumber: [null],
			hospitalNocNumber: [null],
			applicationDate: [{value:true, disabled:true}, [Validators.required]],
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
			numberOfOT: [null, [Validators.required, Validators.maxLength(1)]],
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
			architectContactNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.contactNumberLength)]],

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
			yardHydrant: [null, [Validators.maxLength(100)]],
			raiserAvailability: [null, [Validators.maxLength(10)]],//true false
			noOfRaiser: [null, [Validators.maxLength(5)]],
			smokeDetector: [null, [Validators.maxLength(10)]],//true false
			sprinkler: [null, [Validators.maxLength(50)]],
			fireAlarmAttachedWith: this.fb.group({
				code: [null]
			}),
			autoExhaustSystem: [null, [Validators.maxLength(50)]],
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

			finalFireNocNumber: [null],
			/* Step 6 controls start*/
			attachments: []
			/* Step 6 controls end */
		});
	}


	/**
   * Method is used to add more child in array.
   * @param length - number of row
   */
	addOTDetail(length: number) {

		let returnArray = this.finalHospitalNocForm.get('hospitalOTDetails') as FormArray;
		if (returnArray.length >= length) {
			this.commonService.openAlert("Warning", "Maximum Limit " + length + " .", "warning");
		} else {
			returnArray.push(this.createOTDetailArray(returnArray));
		}
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
		let returnArray = this.finalHospitalNocForm.get('hospitalOTDetails') as FormArray;
		if (returnArray.length >= 15) {
			this.commonService.openAlert("Warning", "Maximum Limit " + 15 + " .", "warning");
		} else if (this.finalHospitalNocForm.get('canEdit').value) {
			const dialogConfig = new MatDialogConfig();

			dialogConfig.disableClose = true;
			dialogConfig.autoFocus = true;
			dialogConfig.data = {};

			const dialogRef = this.dialog.open(DialogFormComponent, dialogConfig);

			dialogRef.afterClosed().subscribe(
				data => {
					if (data) {
						returnArray.push(this.createOTDetailArray(data));
						this.finalHospitalNocForm.get('numberOfOT').setValue(returnArray.length)
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
					let returnArray = this.finalHospitalNocForm.get('hospitalOTDetails') as FormArray;
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
		let returnArray = this.finalHospitalNocForm.get('hospitalOTDetails') as FormArray;
		// this.addItem(persontype).controls.splice(index, 1);
		this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			if (this.finalHospitalNocForm.get('numberOfOT').value >= 1) {
				if (OTData.id == null) {
					returnArray.removeAt(index);
					this.finalHospitalNocForm.get('numberOfOT').setValue(this.finalHospitalNocForm.get('numberOfOT').value - 1);
					this.toastrService.success('OT details has been removed.')
				} else {
					//call api get response than delete
					this.fireFacilitiesService.deleteArrayData(this.finalHospitalNocForm.get('id').value, OTData.id).subscribe(respData => {
						if (respData.success) {
							returnArray.removeAt(index);
							this.finalHospitalNocForm.get('numberOfOT').setValue(returnArray.length);
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
				this.finalHospitalNocForm.get('otherRiskDetail').reset();
			}
		} catch (e) {

		}
	}

	/**
	  * This method required for final form submition.
	  * @param flag - flag of invalid control.
	  */
	handleErrorsOnSubmit(flag) {

		let step0 = 12;
		let step1 = 24;
		let step2 = 32;
		let step3 = 61;
		let step4 = 68;
		let step5 = 102;

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
}

