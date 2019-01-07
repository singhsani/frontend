
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
	tabIndex: number = 0;

	// required attachment array
	private uploadFilesArray: Array<any> = [];
	private showButtons: boolean = false;
	private otherRiskNote: boolean = false;
	//Lookups Array
	FS_STAIR_CASE: Array<any> = [];
	FS_OTHER_RISKS: Array<any> = [];
	FS_FIRE_ALARM_ATTACHED_WTIH: Array<any> = [];
	FS_OTHER_BUSINESS_DETAIL: Array<any> = [];


	// ***************************************
	public dummyJSON = {
		"serviceDetail": {
			"code": "FS-PROVI-HOSPITAL",
			"fieldView": "ALL",
			"name": "Provisional NOC For Hospital",
			"gujName": "હોસ્પિટલ માટે અનિવાર્ય એનઓસી",
			"feesOnScrutiny": false,
			"appointmentRequired": false,
			"serviceUploadDocuments": [
				{
					"id": 258,
					"code": null,
					"documentKey": "FS-PROVI-HOSPITAL_aa82fb3b06e54fc1b91e873482ca9798",
					"documentIdentifier": "COPY_OF_OC_CC",
					"documentLabelEn": "Copy of Occupation Certificate / Completion Certificate",
					"documentLabelGuj": "વ્યવસાય પ્રમાણપત્રની નકલ / સમાપ્તિ પ્રમાણપત્ર",
					"fieldIdentifier": "1",
					"formPart": "1",
					"dependentFieldName": null,
					"mandatory": false,
					"maxFileSizeInMB": 5,
					"requiredOnAdminPortal": true,
					"requiredOnCitizenPortal": true,
					"isActive": true
				},
				{
					"id": 259,
					"code": null,
					"documentKey": "FS-PROVI-HOSPITAL_4cc414f71c0f4ab486103bff1935d37e",
					"documentIdentifier": "APPROVED_LAYOUT_PLAN",
					"documentLabelEn": "Approved Layout Plan Vuda / VMC",
					"documentLabelGuj": "માન્ય લેઆઉટ પ્લાન વુડા / વીએમસી",
					"fieldIdentifier": "2",
					"formPart": "1",
					"dependentFieldName": null,
					"mandatory": false,
					"maxFileSizeInMB": 5,
					"requiredOnAdminPortal": true,
					"requiredOnCitizenPortal": true,
					"isActive": true
				},
				{
					"id": 260,
					"code": null,
					"documentKey": "FS-PROVI-HOSPITAL_33aa2f21deb74c49b1380776c51479d1",
					"documentIdentifier": "APPROVED_APPROACHED ROAD",
					"documentLabelEn": "Approved Approached road Vuda / VMC",
					"documentLabelGuj": "મંજૂર થયેલ માર્ગ વુડા / વી.એમ.સી.",
					"fieldIdentifier": "3",
					"formPart": "1",
					"dependentFieldName": null,
					"mandatory": false,
					"maxFileSizeInMB": 5,
					"requiredOnAdminPortal": true,
					"requiredOnCitizenPortal": true,
					"isActive": true
				},
				{
					"id": 261,
					"code": null,
					"documentKey": "FS-PROVI-HOSPITAL_6d30824d175a4e75b0accda655ea63da",
					"documentIdentifier": "TANK_MEASUREMENT_WITH_MAP",
					"documentLabelEn": "Measurement of Tank(Underground Overhead) with map",
					"documentLabelGuj": "નકશા સાથે ટેન્ક (ભૂગર્ભ ઓવરહેડ) નું માપન",
					"fieldIdentifier": "4",
					"formPart": "1",
					"dependentFieldName": null,
					"mandatory": false,
					"maxFileSizeInMB": 5,
					"requiredOnAdminPortal": true,
					"requiredOnCitizenPortal": true,
					"isActive": true
				},
				{
					"id": 262,
					"code": null,
					"documentKey": "FS-PROVI-HOSPITAL_21b274631dce438a899fadb308503983",
					"documentIdentifier": "EXPLOSIVE_LICENSE",
					"documentLabelEn": "Explosive License for ( LPG / CNG / Petrol Pump / Gas Pump / Gas Station / Gas Storage",
					"documentLabelGuj": "વિસ્ફોટક લાયસન્સ (એલપીજી / સીએનજી / પેટ્રોલ પમ્પ / ગેસ પમ્પ / ગેસ સ્ટેશન / ગેસ સ્ટોરેજ",
					"fieldIdentifier": "5",
					"formPart": "1",
					"dependentFieldName": null,
					"mandatory": false,
					"maxFileSizeInMB": 5,
					"requiredOnAdminPortal": true,
					"requiredOnCitizenPortal": true,
					"isActive": true
				},
				{
					"id": 263,
					"code": null,
					"documentKey": "FS-PROVI-HOSPITAL_370048126ab646c2859641174bc47926",
					"documentIdentifier": "RAJA_CHITTHI",
					"documentLabelEn": "Raja chitthi of VMC",
					"documentLabelGuj": "વીએમસી રજાચિઠ્ઠી",
					"fieldIdentifier": "6",
					"formPart": "1",
					"dependentFieldName": null,
					"mandatory": false,
					"maxFileSizeInMB": 5,
					"requiredOnAdminPortal": true,
					"requiredOnCitizenPortal": true,
					"isActive": true
				},
				{
					"id": 264,
					"code": null,
					"documentKey": "FS-PROVI-HOSPITAL_111dc8ba49ef44579a4ecc5a84b7e6cd",
					"documentIdentifier": "STRUCTURAL_STABILITY_CERTIFICATE",
					"documentLabelEn": "Structural stability certificate",
					"documentLabelGuj": "માળખાકીય સ્થિરતા પ્રમાણપત્ર",
					"fieldIdentifier": "7",
					"formPart": "1",
					"dependentFieldName": null,
					"mandatory": true,
					"maxFileSizeInMB": 5,
					"requiredOnAdminPortal": true,
					"requiredOnCitizenPortal": true,
					"isActive": true
				},
				{
					"id": 265,
					"code": null,
					"documentKey": "FS-PROVI-HOSPITAL_408226d1f3634ce8a55cf510204d0e8f",
					"documentIdentifier": "TRAIN_FIRE_PERSON_LIST",
					"documentLabelEn": "Train Fire Person List with their name & Mobile No",
					"documentLabelGuj": "ટ્રેન ફાયર પર્સન લિસ્ટ તેમના નામ અને મોબાઇલ નંબર સાથે",
					"fieldIdentifier": "8",
					"formPart": "1",
					"dependentFieldName": null,
					"mandatory": false,
					"maxFileSizeInMB": 5,
					"requiredOnAdminPortal": true,
					"requiredOnCitizenPortal": true,
					"isActive": true
				},
				{
					"id": 266,
					"code": null,
					"documentKey": "FS-PROVI-HOSPITAL_e4bbba3678124bfb903bdbed09b20db3",
					"documentIdentifier": "LIFT_APPROVAL_CERTIFICATE",
					"documentLabelEn": "Escalator / Lift approved by Govt. certificate",
					"documentLabelGuj": "સરકાર દ્વારા મંજૂર એસ્કેલેટર / લિફ્ટ. પ્રમાણપત્ર",
					"fieldIdentifier": "9",
					"formPart": "1",
					"dependentFieldName": null,
					"mandatory": false,
					"maxFileSizeInMB": 5,
					"requiredOnAdminPortal": true,
					"requiredOnCitizenPortal": true,
					"isActive": true
				},
				{
					"id": 267,
					"code": null,
					"documentKey": "FS-PROVI-HOSPITAL_8665aef62f0f4b4b8bdcbd753daebcb1",
					"documentIdentifier": "FIRE_DRAWING_FLOOR_WISE",
					"documentLabelEn": "Fire Drawing floor wise i.e. also approved by competent Authority",
					"documentLabelGuj": "ફાયર ડ્રોઇંગ ફ્લોર મુજબની એટલે કે સક્ષમ અધિકારી દ્વારા મંજૂરી",
					"fieldIdentifier": "10",
					"formPart": "1",
					"dependentFieldName": null,
					"mandatory": false,
					"maxFileSizeInMB": 5,
					"requiredOnAdminPortal": true,
					"requiredOnCitizenPortal": true,
					"isActive": true
				}
			]
		},
		"serviceType": "FS_PROVISIONAL_HOSPITAL_NOC",
		"deptFileStatus": null,
		"serviceName": null,
		"fileNumber": "2018-12-20-APP-LCF0HDND",
		"pid": null,
		"outwardNo": null,
		"loiNumber": null,
		"firstName": "bhumika",
		"lastName": "barad",
		"middleName": null,
		"contactNo": "9558295586",
		"mobileNo": "9558295586",
		"email": "barad@gmail.com",
		"aadhaarNo": null,
		"agree": false,
		"paymentStatus": null,
		"serviceCode": "FS-PROVI-HOSPITAL",
		"fieldView": "ALL",
		"fieldList": null,
		"applicantName": null,
		"applicantNameGuj": null,
		"hospitalNOCServiceType": "PROVISIONAL_HOSPITAL_NOC",
		"provisionalNocNumber": null,
		"applicationDate": "2018-12-20",
		"oldReferenceNumber": null,
		"officeContactNo": "8467487658",
		"onsitePersonMobileNo": "7875897438",
		"workOfficeEmailId": "barad@gmail.com",
		"doctorName": "ncbvhjg",
		"doctorNameGuj": "નબ્વ્હ્જ્ગ",
		"medicalRegistrationNumber": "4789548789",
		"hospitalName": "bv hdhq",
		"hospitalNameGuj": "બ્વ હ્ધ",
		"hospitalAddress": "bchjbfj\nnvjkf\nvnjfkbh",
		"hospitalAddressGuj": "બ્ચ્જ્બ્ફ્જ\nન્વ્જ્ક્ફ\nવ્ન્જ્ફ્ક્ભ",
		"ownerName": "gfyhghj",
		"ownerNameGuj": "દ્ગ્ફ્દ્સ્ગ્ર",
		"ownerAddress": "fgfdfbhfdhdfh",
		"ownerAddressGuj": "ફ્દ્ર્ગ્ત્ર",
		"ownerMobileNo": "7584546578",
		"fpNo": "344",
		"rsNo": "3434",
		"tikaNo": "3432434",
		"buildingLocation": "434",
		"tpNo": "23",
		"blockNo": "",
		"opNo": "343",
		"citySurveyNo": "524154",
		"hospitalType": "dfdsf",
		"numberOfBed": 23,
		"numberOfOT": 2,
		"hospitalOTDetails": [
			{
				"id": 1,
				"uniqueId": null,
				"version": null,
				"otFacilities": "vcb ",
				"areaInSquareMeterLength": 43,
				"areaInSquareMeterBreadth": 43,
				"areaInSquareMeter": 43
			},
			{
				"id": 2,
				"uniqueId": null,
				"version": null,
				"otFacilities": "fdvd",
				"areaInSquareMeterLength": 53,
				"areaInSquareMeterBreadth": 53,
				"areaInSquareMeter": 53
			}
		],
		"exerciseSection": 32,
		"drawingWithScale": false,
		"xraySection": 23,
		"laboratoryDepartment": "23",
		"otherInvestigation": "23",
		"storeDetails": "23",
		"kitchenDetails": "23",
		"buildingHeight": 23,
		"floorArea": 23,
		"gateDetailing": "23",
		"rampLiftStairDetails": "23",
		"liftDetails": "32",
		"noOfBasement": 32,
		"lowerBasement": 32,
		"upperBasement": 233,
		"totalBuildingFloor": 32,
		"basementArea": 32,
		"multipleTowers": true,
		"noOfTowers": 32,
		"noOfVentilation": 23,
		"ventilationProvision": false,
		"plotArea": 23,
		"constructedArea": 32,
		"noOfApproachedRoad": 35,
		"drawingProvided": true,
		"architectName": "fdghfdh",
		"architectNameGuj": "ફ્દ્ઘ્ફ્ધ",
		"architectFirmName": "fhgf",
		"architectFirmNameGuj": "ફ્હ્ગ્ફ",
		"architectRegistrationNumber": "fgfdhdh",
		"architectFirmNumber": "fhgfdh",
		"architectContactNo": "5657678687",
		"noOfHospitalStaff": 6546,
		"noOfSecurityStaff": 6554,
		"otherRisks": [
			"Oxygen"
		],
		"otherRiskDetail": null,
		"gasCylinderNOCDetail": "૫૬૬",
		"anyStoreProvision": false,
		"stairCase": {
			"code": "EXTERNAL",
			"name": "External",
			"gujName": "બાહ્ય"
		},
		"trainedFiremanStaffKept": true,
		"exitGateDetail": "edrfet",
		"otherBusinessDetail": {
			"code": "KITCHEN",
			"name": "Kitchen",
			"gujName": "કિચન"
		},
		"riskSegregation": "drtfgrtgf",
		"anyEvacuationPlan": false,
		"evacuationDrillPerformed": false,
		"firefightingSystemAvailability": false,
		"yardHydrant": "ftrggg",
		"raiserAvailability": false,
		"noOfRaiser": 54,
		"smokeDetector": false,
		"sprinkler": "45",
		"fireAlarmAttachedWith": {
			"code": "SPRINKLER",
			"name": "Sprinkler",
			"gujName": "છંટકાવ કરનાર"
		},
		"autoExhaustSystem": "",
		"electricalSafety": "bhgfh",
		"evacuationSignBoard": "gfhgfh",
		"refugeArea": "gfhf",
		"travelDistance": 5353,
		"overHeadWaterTankCapacity": 45,
		"undergroundWaterTankCapacity": 54,
		"alarmSystemTimeLimit": 454,
		"highestFloodLevel": 4554,
		"riskAnalysisSurveyDetail": "54",
		"parkingDetail": "4554",
		"nabhOwnership": "4554",
		"lastThreeYearFireIncidents": "4545",
		"servingSince": "45t454654",
		"attachments": []
	}
	// **********

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
		private TranslateService: TranslateService,
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
		this.dependentAttachment(this.provisionalHospitalNocForm.get('drawingProvided').value, 'APPROVED_APPROACHED ROAD');
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
				this.showButtons = true;

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
					(<FormArray>this.provisionalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
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
			applicationDate: [null],
			oldReferenceNumber: [null],
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			contactNo: [null, [Validators.required, Validators.maxLength(12)]],
			officeContactNo: [null, [Validators.required, Validators.maxLength(12)]],
			onsitePersonMobileNo: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
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
			ownerMobileNo: [null, [Validators.required, Validators.maxLength(10)]],
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
			architectContactNo: [null, [Validators.required, Validators.maxLength(12)]],

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

			/* Step 6 controls start*/
			attachments: []
			/* Step 6 controls end */
		});
	}

	/**
	 * This Method for create attachment array in service detail
	 * @param data : value of array
	 */
	createDocumentsGrp(data?: any): FormGroup {
		return this.fb.group({
			// dependentFieldName: [data.dependentFieldName ? data.dependentFieldName : null],
			documentIdentifier: [data.documentIdentifier ? data.documentIdentifier : null],
			documentKey: [data.documentKey ? data.documentKey : null],
			documentLabelEn: [data.documentLabelEn ? data.documentLabelEn : null],
			documentLabelGuj: [data.documentLabelGuj ? data.documentLabelGuj : null],
			fieldIdentifier: [data.fieldIdentifier ? data.fieldIdentifier : null],
			formPart: [data.formPart ? data.formPart : null],
			id: [data.id ? data.id : null],
			isActive: [data.isActive],
			mandatory: [data.mandatory ? data.mandatory : false],
			maxFileSizeInMB: [data.maxFileSizeInMB ? data.maxFileSizeInMB : 5],
			requiredOnAdminPortal: [data.requiredOnAdminPortal],
			requiredOnCitizenPortal: [data.requiredOnCitizenPortal],
			// version: [data.version ? data.version : null]
		});
	}


	/**
   * Method is used to add more child in array.
   * @param length - number of row
   */
	// addOTDetail(length: number, data: any) {

	// 	let returnArray = this.provisionalHospitalNocForm.get('hospitalOTDetails') as FormArray;
	// 	if (returnArray.length >= length) {
	// 		this.commonService.openAlert("Warning", "Maximum Limit " + length + " .", "warning");
	// 	} else {
	// 		returnArray.push(this.createOTDetailArray(returnArray));
	// 	}
	// }

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
		} else {
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
	}

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
				this.tabIndex = 0;
				return false;
			} else if (count <= step1) {
				this.tabIndex = 1;
				return false;
			} else if (count <= step2) {
				this.tabIndex = 2;
				return false;
			} else if (count <= step3) {
				this.tabIndex = 3;
				return false;
			} else if (count <= step4) {
				this.tabIndex = 4;
				return false;
			} else if (count <= step5) {
				this.tabIndex = 5;
				return false;
			}
			// else if (count == 67) {
			// 	this.checkReligion();
			// 	return false;
			// }
			else {
				console.log("else condition");
			}

		}
	}


	/**
 	 * This method use to get output event of tab change
 	 * @param evt - Tab index
 	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}

	/**
	 * This method is handle depended documents on save event
	 * @param res - form response after save event
	 */
	handleOnSaveAndNext(res) {
		this.requiredDocumentList();
	}


	/**
	 * temp methos
	 */
	patchValue() {
		this.provisionalHospitalNocForm.patchValue(this.dummyJSON);
	}
}

