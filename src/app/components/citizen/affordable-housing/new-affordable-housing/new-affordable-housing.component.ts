import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { CitizenConfig } from '../../citizen-config';
import { ValidationService } from '../../../../shared/services/validation.service';
import { CommonService } from '../../../../shared/services/common.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { ToastrService } from 'ngx-toastr';
import { AffodableService } from '../services/AffordableService';
import * as _ from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
	selector: 'app-new-affordable-housing',
	templateUrl: './new-affordable-housing.component.html',
	styleUrls: ['./new-affordable-housing.component.scss']
})
export class NewAffordableHousingComponent implements OnInit {

	@ViewChild('currentAddress') currentAddressComponent: any;
	@ViewChild('permanentAddress') permanentAddressComponent: any;

	@ViewChild('firstAppCorrespondenceAddress') firstAppCorrespondenceAddressComponent: any;
	@ViewChild('firstAppOccupationAddress') firstAppOccupationAddressComponent: any;

	//@ViewChild('secondAppCorrespondenceAddress') secondAppCorrespondenceAddressComponent: any;
	@ViewChild('secondAppOccupationAddress') secondAppOccupationAddressComponent: any;

	// @ViewChild('applicantCorrespondenceAddr') applicantCorrespondenceAddrComponent: any;
	// @ViewChild('occupationAddr') occupationAddrComponent: any;
	@ViewChild('nomineeAddr') nomineeAddrComponent: any;
	affordableHousingForm: FormGroup;
	translateKey: string = 'affordableHousingScreen';
	actionBarKey: string = 'adminActionBar';
	tabIndex: number = 0;

	dobMaxDate = moment(new Date()).subtract("18", "years").format("YYYY-MM-DD");
	minDate = moment().subtract(2, 'months').format('YYYY-MM-DD');

	attachmentList: any = [];
	uploadFilesArray: Array<any> = [];
	modalJsonRef: BsModalRef;

	appliedForData = [];
	projectData = [];

	addnewBtnown: boolean = true;
	addnewBtnPlot: boolean = true;
	addnewBtnfamily = true;
	nextTab : boolean=false;

	showButtons: boolean = false;
	bankNameArray = [];
	maritalStatusArray = [];
	wardNameArray = [];
	//{ "id": 1, "code": "ALLAHABAD_BANK", "name": "Allahabad Bank" }, { "id": 3, "code": "BANK_OF_BARODA", "name": "Bank of Baroda" }, { "id": 4, "code": "BANK_OF_MAHARASHTRA", "name": "Bank of Maharashtra" }, { "id": 5, "code": "CANARA_BANK", "name": "Canara Bank" }, { "id": 6, "code": "BANK_OF_INDIA", "name": "Bank of India" }, { "id": 7, "code": "CENTRAL_BANK_OF_INDIA", "name": "Central Bank of India" }, { "id": 8, "code": "CORPORATION_BANK", "name": "Corporation India" }, { "id": 9, "code": "DENA_BANK", "name": "Dena India" }, { "id": 10, "code": "INDIAN_BANK", "name": "Indian India" }, { "id": 11, "code": "INDIAN_OVERSEAS_BANK", "name": "Indian Overseas India" }, { "id": 12, "code": "ORIENTAL_BANK_OF_COMMERCE", "name": "Oriental Bank of Commerce" }, { "id": 13, "code": "PUNJAB_NATIONAL_BANK", "name": "Punjab National Bank" }, { "id": 14, "code": "SYNDICATE_BANK", "name": "Syndicate Bank" }, { "id": 15, "code": "UNION_BANK_OF_INDIA", "name": "Union Bank of India" }, { "id": 16, "code": "UNITED_BANK_OF_INDIA", "name": "United Bank of India" }, { "id": 17, "code": "PUNJAB_AND_SIND_BANK", "name": "Punjab & Sind Bank" }, { "id": 18, "code": "UCO_BANK", "name": "UCO Bank" }, { "id": 19, "code": "VIJAYA_BANK", "name": "Vijaya Bank" }, { "id": 20, "code": "AXIS_BANK_LIMITED_BANK", "name": "Axis Bank Limited" }, { "id": 21, "code": "BANDHAN_BANK_LIMITED_BANK", "name": "Bandhan Bank Limited" }, { "id": 22, "code": "CATHOLIC_SYRIAN_BANK_LIMITED_BANK", "name": "Catholic Syrian Bank Limited" }, { "id": 23, "code": "CITY_UNION_BANK_LIMITED_BANK", "name": "City Union Bank Limited" }, { "id": 24, "code": "DCB_UNION_BANK_LIMITED_BANK", "name": "DCB Bank Limited" }, { "id": 25, "code": "DHANLAXMI_BANK_LIMITED_BANK", "name": "Dhanlaxmi Union Bank Limited" }, { "id": 26, "code": "FEDERAL_BANK_LIMITED_BANK", "name": "Federal Union Bank Limited" }, { "id": 27, "code": "HDFC_BANK_LIMITED_BANK", "name": "HDFC Bank Limited" }, { "id": 28, "code": "ICICI_BANK_LIMITED_BANK", "name": "ICICI Bank Limited" }, { "id": 29, "code": "KARUR_VYSYA_BANK_LIMITED", "name": "Karur Vysya Bank Limited" }, { "id": 30, "code": "JAMMU_AND_KASHMIR_BANK_LIMITED", "name": "Jammu & Kashmir Bank Limited" }, { "id": 31, "code": "KARNATAKA_BANK_LIMITED", "name": "Karnataka Bank Limited" }, { "id": 32, "code": "KOTAK_MAHINDRA_BANK_LIMITED", "name": "Kotak Mahindra Bank Limited" }, { "id": 33, "code": "LAKSHMI_VILAS_BANK_LIMITED", "name": "Lakshmi Vilas Bank Limited" }, { "id": 34, "code": "NAINITAL_BANK_LIMITED", "name": "Nainital Bank Limited" }, { "id": 35, "code": "R_B_L_BANK_LIMITED", "name": "RBL Bank Limited" }, { "id": 36, "code": "SOUTH_INDIAN_BANK_LIMITED", "name": "South Indian Bank Limited" }, { "id": 37, "code": "TAMILNAD_MERCANTILE_BANK_LIMITED", "name": "Tamilnad Mercantile Bank Limited" }, { "id": 38, "code": "YES_BANK_LIMITED", "name": "YES Bank Limited" }]


	formId: number;
	appId: number;
	apiCode: string;
	maxDate: Date = new Date();
	//maxDate = moment(new Date()).subtract("18", "years").format("YYYY-MM-DD");

	public serverUploadFilesArray: Array<any> = [];
	sortedList: Array<any> = [];

	public affordableHousingConfiguration: CitizenConfig = new CitizenConfig();
	MF_CATEGORY_TYPE: Array<any> = [];

	personTypeArray = [];
	relationArray: Array<any> = ["Father", "Mother", "Husband", "Wife", "Brother", "Son ", "Sister", "Daughter"];
	implYesNorray: Array<any> = [{ name: 'YES', code: true }, { name: 'NO', code: false }];
	houseOldOrNew: Array<any> = ["Kuccha", "Pucca"];
	rationCard: Array<any> = ["APL", "BPL", "Not Applicable"];

	LOOKUP: any;
    messageForMobileNum: string;
	messageForAaadherNum: string;
	messageForPanCard: string;
	validationErrorMsg = false
	secondPersonrequiredFeilds = false
	houseTypes = [];

	// Map for the formcontrol to tabIndex id;

	public formControlNameToTabIndex = new Map();

	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		public validationError: ValidationService,
		private formService: FormsActionsService,
		private router: Router,
		private commonService: CommonService,
		private toster: ToastrService,
		private modalService: BsModalService,
		private CD: ChangeDetectorRef,
		private affodableService: AffodableService) {
		this.formService.apiType = "afhForm";
	}

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.formId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');

			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		},
			err => {
				this.toster.error(err.error.error_description);
			});
		this.affordableHousingFormControls();
		this.getLookupData();
		this.getWardZoneData();
		this.getLookupDataApplyFor();
		this.getHouseType();
		this.getAllDocumentLists();
		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
			this.createFormData();
		}
		else {
			this.getAhfData();
		}

		this.setFormControlToTabIndexMap();

	}
	getWardZoneData() {
		this.affodableService.getWardZone().subscribe(res=>{
			this.wardNameArray=res.filter(_ => _.wardzoneName !== '-');
		});
	}

	getHouseType() {
		this.affodableService.getHouseTypeLookup().subscribe(res => {
			this.houseTypes = res.AH_HOUSE_TYPE;
		});
	}

	setFormControlToTabIndexMap() {

		this.formControlNameToTabIndex.set('schemeId', 0)
		this.formControlNameToTabIndex.set('projectId', 0)
		this.formControlNameToTabIndex.set('category', 0)
		this.formControlNameToTabIndex.set('firstPersonTypeTitle', 0)
		this.formControlNameToTabIndex.set('marriageStatus', 0)

		this.formControlNameToTabIndex.set('firstApplicantFirstName', 0)
		this.formControlNameToTabIndex.set('firstApplicantLastName', 0)
		this.formControlNameToTabIndex.set('firstAppHusWifeFirstName', 0)
		this.formControlNameToTabIndex.set('firstAppHusWifeLastName', 0)
		this.formControlNameToTabIndex.set('firstAppDateOfBirth', 0)
		this.formControlNameToTabIndex.set('firstAppTelephoneNumber', 0)
		this.formControlNameToTabIndex.set('firstAppMobileNumOne', 0)
		this.formControlNameToTabIndex.set('firstAppMobileNumTwo', 0)
		this.formControlNameToTabIndex.set('firstAppEmail', 0)
		this.formControlNameToTabIndex.set('firstAppOccupation', 0)
		this.formControlNameToTabIndex.set('firstAppOrganizationName', 0)
		this.formControlNameToTabIndex.set('firstAppOccupationDesignation', 0)
		this.formControlNameToTabIndex.set('firstAppDrivingLicenseNumber', 0)
		this.formControlNameToTabIndex.set('firstAppVoterIdNumber', 0)
		this.formControlNameToTabIndex.set('firstAppAadharCardNumber', 0)
		this.formControlNameToTabIndex.set('firstAppPanCardNumber', 0)
		this.formControlNameToTabIndex.set('firstAppRationCardNumber', 0)
		this.formControlNameToTabIndex.set('firstAppCorrespondenceAddress', 0)
		this.formControlNameToTabIndex.set('firstAppOccupationAddress', 0)
		this.formControlNameToTabIndex.set('categoryCode', 0)

		this.formControlNameToTabIndex.set('secondApplicantFirstName', 1)
		this.formControlNameToTabIndex.set('secondApplicantMiddleName', 1)
		this.formControlNameToTabIndex.set('secondPersonTypeTitle', 1)
		this.formControlNameToTabIndex.set('secondApplicantLastName', 1)
		this.formControlNameToTabIndex.set('secondAppHusWifeFirstName', 1)
		this.formControlNameToTabIndex.set('secondAppHusWifeMiddleName', 1)
		this.formControlNameToTabIndex.set('secondAppHusWifeLastName', 1)
		this.formControlNameToTabIndex.set('secondAppDateOfBirth', 1)
		this.formControlNameToTabIndex.set('secondAppTelephoneNumber', 1)
		this.formControlNameToTabIndex.set('secondAppMobileNumOne', 1)
		this.formControlNameToTabIndex.set('secondAppMobileNumTwo', 1)
		this.formControlNameToTabIndex.set('secondAppEmail', 1)
		this.formControlNameToTabIndex.set('secondAppOrganizationName', 1)
		this.formControlNameToTabIndex.set('secondAppOccupation', 1)
		this.formControlNameToTabIndex.set('secondAppOccupationDesignation', 1)
		this.formControlNameToTabIndex.set('secondAppDrivingLicenseNumber', 1)
		this.formControlNameToTabIndex.set('secondAppVoterIdNumber', 1)
		this.formControlNameToTabIndex.set('secondAppAadharCardNumber', 1)
		this.formControlNameToTabIndex.set('secondAppPanCardNumber', 1)
		this.formControlNameToTabIndex.set('secondAppRationCardNumber', 1)
		//this.formControlNameToTabIndex.set('secondAppCorrespondenceAddress',1)
		this.formControlNameToTabIndex.set('secondAppOccupationAddress', 1)


		this.formControlNameToTabIndex.set('ward', 2)
		this.formControlNameToTabIndex.set('currentAddress', 2)
		this.formControlNameToTabIndex.set('permanentAddress', 2)
		this.formControlNameToTabIndex.set('howLongLivingInVadodara', 2)
		this.formControlNameToTabIndex.set('sqMetersPresentBuilding', 2)
		this.formControlNameToTabIndex.set('hasCurrentHouseKacchaOrPucca', 2)
		this.formControlNameToTabIndex.set('hasCurrentHouseRentedOrPurchased', 2)

		this.formControlNameToTabIndex.set('bankAccountNumber', 3)
		this.formControlNameToTabIndex.set('bank', 3)
		this.formControlNameToTabIndex.set('bankBranch', 3)
		this.formControlNameToTabIndex.set('bankIFSC', 3)
		this.formControlNameToTabIndex.set('bankMicrCode', 3)

		this.formControlNameToTabIndex.set('aggregateAnnualIncomeAmount', 3)
		this.formControlNameToTabIndex.set('aggregateAnnualIncomeAmountInWords', 3)

		this.formControlNameToTabIndex.set('familyMembers', 4)
		this.formControlNameToTabIndex.set('ownHouseDetail', 4)
		this.formControlNameToTabIndex.set('ownLandPlotDetail', 4)

		this.formControlNameToTabIndex.set('nomineeName', 5)
		this.formControlNameToTabIndex.set('nomineeApplicantRelationShip', 5)
		this.formControlNameToTabIndex.set('nomineeAddress', 5)

		this.formControlNameToTabIndex.set('ddBank', 6)
		this.formControlNameToTabIndex.set('ddBankBranch', 6)
		this.formControlNameToTabIndex.set('ddNumber', 6)
		this.formControlNameToTabIndex.set('ddAmount', 6)
		this.formControlNameToTabIndex.set('ddIssuingDate', 6)

	}

	/**
	 * This method is use for create draft form
	 */
	createFormData() {
		this.formService.createFormData().subscribe(res => {
			this.affordableHousingForm.patchValue(res);
			setTimeout(() => {
				this.showButtons = true;
			}, 0)
		});
	}


	changeMarriageStatus() {
		var value = this.affordableHousingForm.get('marriageStatus').get('code').value
		if (value) {
			if (value == "MARRIED") {
				this.mandotoryFileds(true);
				this.setSecoundApplciatPhoto(true);
			}
			else {
				this.mandotoryFileds(false);
				this.setSecoundApplciatPhoto(false);
			}
		}
	}

	rentChange() {
		var values = this.affordableHousingForm.get('hasCurrentHouseRentedOrPurchased').value;
		this.setServiceDetailsOnInit(values);
	}

	setSecoundApplciatPhoto(event) {
		this.serverUploadFilesArray = this.attachmentList;
		const localUploadArray = [...this.serverUploadFilesArray]
		this.attachmentList = [];
		if (event) {
			for (let file of localUploadArray) {
				if (file['documentIdentifier'] === 'UPLOAD_PHOTO_2') {
					file['mandatory'] = true;
				}
				this.attachmentList.push(file);
			}
		} else {
			for (let file of localUploadArray) {
				if (file['documentIdentifier'] === 'UPLOAD_PHOTO_2') {
					file['mandatory'] = false;
				}
				this.attachmentList.push(file);
			}
		}
		this.manadoty();
	}

	manadoty() {
		this.uploadFilesArray = [];
		_.forEach(this.attachmentList, (value) => {
			if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
				this.uploadFilesArray.push({
					'labelName': value.documentLabelEn,
					'fieldIdentifier': value.fieldIdentifier,
					'documentIdentifier': value.documentIdentifier
				})
			}
		});
	}
	setServiceDetailsOnInit(event) {
		this.serverUploadFilesArray = this.attachmentList;
		const localUploadArray = [...this.serverUploadFilesArray]
		this.attachmentList = [];
		if (event) {
			for (let file of localUploadArray) {
				if (file['documentIdentifier'] === 'RENT_AGREEMENT') {
					file['mandatory'] = true;
				}
				this.attachmentList.push(file);
			}
		} else {
			for (let file of localUploadArray) {
				if (file['documentIdentifier'] === 'RENT_AGREEMENT') {
					file['mandatory'] = false;
				}
				this.attachmentList.push(file);
			}
		}
		this.manadoty();
	}

	mandotoryFileds(flag) {
		this.secondPersonrequiredFeilds = flag
		if (flag) {
			this.affordableHousingForm.get('secondPersonTypeTitle').get('code').setValidators([Validators.required]);
			this.affordableHousingForm.get('secondApplicantFirstName').setValidators([Validators.required]);
			this.affordableHousingForm.get('secondApplicantMiddleName').setValidators([Validators.maxLength(100)]);
			this.affordableHousingForm.get('secondApplicantLastName').setValidators([Validators.required, Validators.maxLength(100)]);
			this.affordableHousingForm.get('secondAppHusWifeFirstName').setValidators([Validators.required, Validators.maxLength(100)]);
			this.affordableHousingForm.get('secondAppHusWifeMiddleName').setValidators([Validators.maxLength(100)]);
			this.affordableHousingForm.get('secondAppHusWifeLastName').setValidators([Validators.required, Validators.maxLength(100)]);
			this.affordableHousingForm.get('secondAppDateOfBirth').setValidators([Validators.required]);
			this.affordableHousingForm.get('secondAppTelephoneNumber').setValidators([Validators.maxLength(11)]);
			this.affordableHousingForm.get('secondAppMobileNumOne').setValidators([Validators.required, Validators.maxLength(10)]);
			this.affordableHousingForm.get('secondAppMobileNumTwo').setValidators([Validators.maxLength(10)]);
			this.affordableHousingForm.get('secondAppEmail').setValidators([ValidationService.emailValidator, Validators.maxLength(50)]);
			this.affordableHousingForm.get('secondAppOrganizationName').setValidators([Validators.required, Validators.maxLength(20)]);
			this.affordableHousingForm.get('secondAppOccupation').setValidators([Validators.required, Validators.maxLength(10)]);
			this.affordableHousingForm.get('secondAppOccupationDesignation').setValidators([Validators.required, Validators.maxLength(10)]);
			this.affordableHousingForm.get('secondAppDrivingLicenseNumber').setValidators([ValidationService.drivingLicenseValidator]);
			this.affordableHousingForm.get('secondAppVoterIdNumber').setValidators([ValidationService.electionCardValidator]);
			this.affordableHousingForm.get('secondAppAadharCardNumber').setValidators([Validators.required, Validators.maxLength(12)]);
			this.affordableHousingForm.get('secondAppPanCardNumber').setValidators([Validators.required, ValidationService.panValidator]);
			this.affordableHousingForm.get('secondAppRationCardNumber').setValidators([Validators.maxLength(10)]);
		} else {
			this.affordableHousingForm.get('secondPersonTypeTitle').get('code').clearValidators();
			this.affordableHousingForm.get('secondApplicantFirstName').clearValidators();
			this.affordableHousingForm.get('secondApplicantMiddleName').clearValidators();
			this.affordableHousingForm.get('secondApplicantLastName').clearValidators();
			this.affordableHousingForm.get('secondAppHusWifeFirstName').clearValidators();
			this.affordableHousingForm.get('secondAppHusWifeMiddleName').clearValidators();
			this.affordableHousingForm.get('secondAppHusWifeLastName').clearValidators();
			this.affordableHousingForm.get('secondAppDateOfBirth').clearValidators();
			this.affordableHousingForm.get('secondAppTelephoneNumber').clearValidators();
			this.affordableHousingForm.get('secondAppMobileNumOne').clearValidators();
			this.affordableHousingForm.get('secondAppMobileNumTwo').clearValidators();
			this.affordableHousingForm.get('secondAppEmail').clearValidators();
			this.affordableHousingForm.get('secondAppOrganizationName').clearValidators();
			this.affordableHousingForm.get('secondAppOccupation').clearValidators();
			this.affordableHousingForm.get('secondAppOccupationDesignation').clearValidators();
			this.affordableHousingForm.get('secondAppDrivingLicenseNumber').clearValidators();
			this.affordableHousingForm.get('secondAppVoterIdNumber').clearValidators();
			this.affordableHousingForm.get('secondAppAadharCardNumber').clearValidators();
			this.affordableHousingForm.get('secondAppPanCardNumber').clearValidators();
			this.affordableHousingForm.get('secondAppRationCardNumber').clearValidators();
		}
		this.affordableHousingForm.get('secondPersonTypeTitle').get('code').updateValueAndValidity();
		this.affordableHousingForm.get('secondApplicantFirstName').updateValueAndValidity();
		this.affordableHousingForm.get('secondApplicantMiddleName').updateValueAndValidity();
		this.affordableHousingForm.get('secondApplicantLastName').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppHusWifeFirstName').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppHusWifeMiddleName').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppHusWifeLastName').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppDateOfBirth').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppTelephoneNumber').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppMobileNumOne').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppMobileNumTwo').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppEmail').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppOrganizationName').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppOccupation').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppOccupationDesignation').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppDrivingLicenseNumber').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppVoterIdNumber').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppAadharCardNumber').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppPanCardNumber').updateValueAndValidity();
		this.affordableHousingForm.get('secondAppRationCardNumber').updateValueAndValidity();
		this.CD.detectChanges();
	}

	setServiceDetailsOnInits(res) {
		this.attachmentList = [];
		this.serverUploadFilesArray = res.serviceDetail.serviceUploadDocuments;
		const localUploadArray = [...this.serverUploadFilesArray];

		for (let file of localUploadArray) {
			console.log("file" + JSON.stringify(file));
			this.attachmentList.push(file);
		}
	}
	/**
	 * Method is used to get form data
	 */
	getAhfData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				if (res.schemeId) {
					this.schemeChange(res.schemeId);
				}

				this.affordableHousingForm.patchValue(res);

				res.familyMembers.forEach(app => {
					(<FormArray>this.affordableHousingForm.get('familyMembers')).push(this.createFormGroup('familyMembers', app));
				});

				res.ownHouseDetail.forEach(app => {
					(<FormArray>this.affordableHousingForm.get('ownHouseDetail')).push(this.createFormGroup('ownHouseDetail', app));
				});

				res.ownLandPlotDetail.forEach(app => {
					(<FormArray>this.affordableHousingForm.get('ownLandPlotDetail')).push(this.createFormGroup('ownLandPlotDetail', app));
				});

				this.setServiceDetailsOnInits(res);
				this.showButtons = true;

				this.affordableHousingForm.get('ddBank').get('code').setValue(res.paymentAcceptance[0].ddBank.code);
				this.affordableHousingForm.get('ddBankBranch').setValue(res.paymentAcceptance[0].ddBankBranch);
				this.affordableHousingForm.get('ddNumber').setValue(res.paymentAcceptance[0].ddNumber);
				this.affordableHousingForm.get('ddAmount').setValue(res.paymentAcceptance[0].ddAmount);
				this.affordableHousingForm.get('ddIssuingDate').setValue(res.paymentAcceptance[0].ddIssuingDate);

				this.projectChange(res.projectId);

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
			this.LOOKUP = res;
			this.MF_CATEGORY_TYPE = res.AH_CATEGORY;
			this.bankNameArray = res.AH_BANKS;
			this.personTypeArray = res.PERSON_TYPE;
			this.maritalStatusArray = res.MARITAL_STATUS;
		});
	}

	getLookupDataApplyFor() {
		this.affodableService.getApplydata().subscribe(res => {

			this.appliedForData = res;

		});
	}



	/**
	 * This method for serach project by shcmeid .
	 */
	schemeChange(shcmeid) {
		this.resetLookUpField();
		if (shcmeid)
			this.affodableService.getProject(shcmeid).subscribe(
				(res: any) => {
					this.projectData = res;
				}, (err: any) => {

				})
	}

	resetLookUpField() {
		this.projectData = [];
		this.affordableHousingForm.get('projectId').setValue(null);
		this.affordableHousingForm.get('location').setValue(null);
		this.affordableHousingForm.get('tpNumber').setValue(null);
		this.affordableHousingForm.get('fpNumber').setValue(null);
	}

	/**
		 * define all gas connection form controls
		 */
	affordableHousingFormControls() {
		this.affordableHousingForm = this.fb.group({
			apiType: 'afhForm',
			serviceCode: 'AFFORD-HOUSE',
			serviceFormId: null,
			refNumber: null,
			/* Step 1 controls start */
			schemeId: [null, [Validators.required, Validators.maxLength(100)]],
			projectId: [null, [Validators.required, Validators.maxLength(100)]],
			category: this.fb.group({
				code: [null, [Validators.required]],
				name: null,
			}),

			categoryCode: this.fb.group({
				code: [null, [Validators.required]],
				name: null,
			}),

			firstPersonTypeTitle: this.fb.group({
				code: [null, [Validators.required]],
				name: null,
			}),

			secondPersonTypeTitle: this.fb.group({
				code: [null, [Validators.required]],
				name: null,
			}),

			ward: [null, [Validators.required]],
			
			howLongLivingInVadodara: [null, [Validators.required]],
			sqMetersPresentBuilding: [null, [Validators.required]],
			hasCurrentHouseKacchaOrPucca: [null, [Validators.required]],
			hasCurrentHouseRentedOrPurchased: [null, [Validators.required]],
			rationCardType: [null, [Validators.required]],

			marriageStatus: this.fb.group({
				code: [null, Validators.required]
			}),

			location: [{ value: null, disabled: true }],
			tpNumber: [{ value: null, disabled: true }],
			fpNumber: [{ value: null, disabled: true }],

			firstAppAge: [{ value: null, disabled: true }],
			secondAppAge: [{ value: null, disabled: true }],

			// /* First Beneficiary controls Start *//
			firstApplicantFirstName: [null, [Validators.required, Validators.maxLength(100)]],
			firstApplicantMiddleName: [null, [Validators.maxLength(100)]],
			firstApplicantLastName: [null, [Validators.required, Validators.maxLength(100)]],
			firstAppHusWifeFirstName: [null, [Validators.required, Validators.maxLength(100)]],
			firstAppHusWifeMiddleName: [null, [Validators.maxLength(100)]],
			firstAppHusWifeLastName: [null, [Validators.required, Validators.maxLength(100)]],
			firstAppDateOfBirth: [null, [Validators.required]],
			firstAppTelephoneNumber: [null, [Validators.maxLength(11)]],
			firstAppMobileNumOne: [null, [Validators.required, Validators.maxLength(10)]],
			firstAppMobileNumTwo: [null, [Validators.maxLength(10)]],
			firstAppEmail: [null, [ValidationService.emailValidator, Validators.maxLength(50)]],
			firstAppOccupation: [null, [Validators.required, Validators.maxLength(100)]],
			firstAppOrganizationName: [null, [Validators.required, Validators.maxLength(100)]],
			firstAppOccupationDesignation: [null, [Validators.required, Validators.maxLength(100)]],
			firstAppDrivingLicenseNumber: [null, [ValidationService.drivingLicenseValidator]],
			firstAppVoterIdNumber: [null, [ValidationService.electionCardValidator]],
			firstAppAadharCardNumber: [null, [Validators.required, Validators.maxLength(12)]],
			firstAppPanCardNumber: [null, [Validators.required, ValidationService.panValidator]],
			firstAppRationCardNumber: [null, [Validators.maxLength(20)]],

			//	firstAppCorrespondenceAddress: this.fb.group(this.firstAppCorrespondenceAddressComponent.addressControls()),
			firstAppOccupationAddress: this.fb.group(this.firstAppOccupationAddressComponent.addressControls()),
			// /* First Beneficiary controls End *//

			currentAddress: this.fb.group(this.currentAddressComponent.addressControls()),
			permanentAddress: this.fb.group(this.permanentAddressComponent.addressControls()),

			// /* Second Beneficiary controls Start *//
			secondApplicantFirstName: [null, [Validators.required, Validators.maxLength(100)]],
			secondApplicantMiddleName: [null, [Validators.maxLength(100)]],
			secondApplicantLastName: [null, [Validators.required, Validators.maxLength(100)]],
			secondAppHusWifeFirstName: [null, [Validators.required, Validators.maxLength(100)]],
			secondAppHusWifeMiddleName: [null, [Validators.maxLength(100)]],
			secondAppHusWifeLastName: [null, [Validators.required, Validators.maxLength(100)]],
			secondAppDateOfBirth: [null, [Validators.required]],
			secondAppTelephoneNumber: [null, [Validators.maxLength(11)]],
			secondAppMobileNumOne: [null, [Validators.required, Validators.maxLength(10)]],
			secondAppMobileNumTwo: [null, [Validators.maxLength(10)]],
			secondAppEmail: [null, [ValidationService.emailValidator, Validators.maxLength(50)]],
			secondAppOrganizationName: [null, [Validators.required, Validators.maxLength(100)]],
			secondAppOccupation: [null, [Validators.required, Validators.maxLength(100)]],
			secondAppOccupationDesignation: [null, [Validators.required, Validators.maxLength(100)]],
			secondAppDrivingLicenseNumber: [null, [ValidationService.drivingLicenseValidator]],
			secondAppVoterIdNumber: [null, [ValidationService.electionCardValidator]],
			secondAppAadharCardNumber: [null, [Validators.required, Validators.maxLength(12)]],
			secondAppPanCardNumber: [null, [Validators.required, ValidationService.panValidator]],
			secondAppRationCardNumber: [null, [Validators.maxLength(20)]],

			//secondAppCorrespondenceAddress: this.fb.group(this.secondAppCorrespondenceAddressComponent.addressControls()),
			secondAppOccupationAddress: this.fb.group(this.secondAppOccupationAddressComponent.addressControls()),
			// /* Second Beneficiary controls End *//

			// /* Bank Details controls Start *//
			bankAccountNumber: [null, [Validators.required, Validators.maxLength(16),Validators.minLength(16)]],
			bank: this.fb.group({
				code: [null, [Validators.required]],
				name: null,
			}),
			bankBranch: [null, [Validators.required, Validators.maxLength(40)]],
			bankIFSC: [null, [Validators.required, ValidationService.ifscCodeValidator]],
			bankMicrCode: [null, [Validators.maxLength(25)]],
			ddBank: this.fb.group({
				code: [null, [Validators.required]],
				name: null,
			}),
			ddBankBranch: [null, [Validators.required, Validators.maxLength(200)]],
			ddNumber: [null, [Validators.required]],
			ddAmount: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(6)]],
			ddIssuingDate: [null, [Validators.required]],

			// /* Bank Details controls End *//

			// /* Annual Income controls Start *//
			aggregateAnnualIncomeAmount: [null, [Validators.required, Validators.maxLength(7)]],
			aggregateAnnualIncomeAmountInWords: [null, [Validators.required, Validators.maxLength(200)]],
			familyMembers: this.fb.array([]),
			//placeOfChoice: this.fb.array([]),
			canEdit: [true],
			// /* Annual Income controls End *//

			// /* Own House Detail controls Start *//
			ownHouseDetail: this.fb.array([]),
			// /* Own House Detail controls End *//

			// /* Own plot Detail controls Start *//
			ownLandPlotDetail: this.fb.array([]),
			// /* Own plot Detail controls End *//

			// /* Nominee controls Start *//
			nomineeName: [null, [Validators.required, Validators.maxLength(100)]],
			nomineeApplicantRelationShip: [null, [Validators.required, Validators.maxLength(100)]],
			nomineeAddress: this.fb.group(this.nomineeAddrComponent.addressControls()),
			// /* Nominee controls End *//

			// Attachment //
			attachments: [''],
			licenseAgreed: [true],

			// // applicantCorrespondenceAddress: this.fb.group(this.applicantCorrespondenceAddrComponent.addressControls()),
			// correspondanceAddress: this.fb.group(this.applicantCorrespondenceAddrComponent.addressControls()),
			// occupationAddress: this.fb.group(this.occupationAddrComponent.addressControls()),

		});
	}

	getWordAmount(value) {
		let words = this.getToWords(value);
		let statusword = words + " Rs. Only"
		this.affordableHousingForm.get('aggregateAnnualIncomeAmountInWords').setValue(statusword);
	}



	getToWords(amount) {
		let toWords = require('to-words');

		let words = '';
		//toWords.convert(payData.amount);
		if (amount > 0) {
			words = toWords(amount);
		} else {
			words = " "
		}
		return words;
	}

	projectChange(projectId) {
		if (projectId)
			this.affodableService.getProjectLocation(projectId).subscribe(
				(res: any) => {
					let Obj = res[0];
					this.affordableHousingForm.get('location').setValue(Obj.location);
					this.affordableHousingForm.get('tpNumber').setValue(Obj.locationTPNo);
					this.affordableHousingForm.get('fpNumber').setValue(Obj.locationFPNo);
					this.affordableHousingForm.get('ddAmount').setValue(Obj.depositAmount);
				}, (err: any) => {

				})
	}

	/**
   * This method use for set the date in form controls
   * @param fieldName - get the selected field's name
   * @param date get the selected date value
   */
	onDateChange(fieldName, date) {
		this.affordableHousingForm.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
	}

	onDateChangeFirstAge(field, value) {
		let timeDiff = Math.abs(Date.now() - value);
		let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
		console.log(age);

		this.affordableHousingForm.get('firstAppAge').setValue(age);
		this.affordableHousingForm.get(field).setValue(moment(value).format("YYYY-MM-DD"));
		return age
	}

	onDateChangeSecondAge(field, value) {
		let timeDiff = Math.abs(Date.now() - value);
		let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
		console.log(age);

		this.affordableHousingForm.get('secondAppAge').setValue(age);
		this.affordableHousingForm.get(field).setValue(moment(value).format("YYYY-MM-DD"));
		return age
	}
	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}

	/**
	 * This method required for final form submition.
	 * @param flag - flag of invalid control.
	 */
	handleErrorsOnSubmit(key) {

		const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 0;

		this.tabIndex = index;
		return false;


	}





	/**
	 * Method is used edit editable data view.
	 * @param row table row
	 */
	editRecord(row: any) {
		row.isEditMode = true;
		row.deepCopyInEditMode = Object.assign({}, row.value);
		this.nextTab=true;
	}




	/**
	 * Method is used save editable dataview.
	 * @param row table row
	 */
	saveRecord(row: any) {
		if (row.valid) {
			row.isEditMode = false;
			row.newRecordAdded = false;
			this.nextTab=false;
		}
	}

	/**
	 * Method is used cancel editable dataview.
	 * @param key  -
	 * @param row
	 * @param index
	 */
	cancelRecord(key: string, row: any, index: number) {
		try {
			if (row.newRecordAdded) {
				this.deleteFormArrayRecord(key, index);
			} else {
				if (row.deepCopyInEditMode) {
					row.patchValue(row.deepCopyInEditMode);
				}
				row.isEditMode = false;
				row.newRecordAdded = false;
			}
		} catch (error) {

		}
		this.nextTab=false;
	}

	/**
	 * This method is use for get all the checklist
	 */
	getAllDocumentLists() {
		this.affodableService.getAllDocuments().subscribe(res => {
			this.attachmentList = _.cloneDeep(res);


			this.uploadFilesArray = [];
			_.forEach(this.attachmentList, (value) => {
				if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
					this.uploadFilesArray.push({
						'labelName': value.documentLabelEn,
						'fieldIdentifier': value.fieldIdentifier,
						'documentIdentifier': value.documentIdentifier
					})
				}
			});

		});
	}

	/**
	 * this methode is used for create form group
	 * @param key - identify for create group for which array
	 * @param data - data is used for when get form
	 */
	createFormGroup(key: string, data: any): FormGroup {

		let formGroupData: FormGroup;
		switch (key) {
			case 'familyMembers':
				formGroupData = this.fb.group({
					id: data.id ? data.id : null,
					name: [data.name ? data.name : null, [Validators.required, Validators.maxLength(100)]],
					relationshipWithApplicant: [data.relationshipWithApplicant ? data.relationshipWithApplicant : null, [Validators.required, Validators.maxLength(100)]],
					memberAge: [data.memberAge ? data.memberAge : null, [Validators.required]]
				})
				break;
			// case 'placeOfChoice':
			// 	formGroupData = this.fb.group({
			// 		name: [null, [Validators.required, Validators.maxLength(200)]]
			// 	})
			// 	break;
			case 'ownHouseDetail':
			case 'ownLandPlotDetail':
				formGroupData = this.fb.group({
					name: [data.name ? data.name : null, [Validators.required, Validators.maxLength(100)]],
					flatNo: [data.flatNo ? data.flatNo : null, [Validators.required, Validators.maxLength(10)]],
					street: [data.street ? data.street : null, [Validators.required, Validators.maxLength(10)]],
					city: [data.city ? data.city : null, [Validators.required, Validators.maxLength(20)]],
					district: [data.district ? data.district : null, [Validators.required, Validators.maxLength(20)]],
					pincode: [data.pincode ? data.pincode : null, [Validators.required, Validators.maxLength(6)]]
				})
				break;
			// case 'ownLandPlotDetail':
			// 	formGroupData = this.fb.group({
			// 		name: [null, [Validators.required, Validators.maxLength(200)]],
			// 		flatNo: [null, [Validators.required, Validators.maxLength(200)]],
			// 		street: [null, [Validators.required, Validators.maxLength(200)]],
			// 		city: [null, [Validators.required, Validators.maxLength(200)]],
			// 		district: [null, [Validators.required, Validators.maxLength(200)]]
			// 	})
			// 	break;

			default:
				break;
		}
		return formGroupData;
	}

	/**
   * This method is use for open modal.
   */
	openTermModel(template: TemplateRef<any>) {
		this.modalJsonRef = this.modalService.show(template);
	}
	hideModel() {
		this.modalJsonRef.hide();
	}

	/**
	 * create form array
	 * @param key  - identify for form array
	 */
	getFormsArray(key: string): FormArray {
		let formArrayData: FormArray;
		switch (key) {
			case 'familyMembers':
				formArrayData = this.affordableHousingForm.get('familyMembers') as FormArray;
				break;
			// case 'placeOfChoice':
			// 	formArrayData = this.affordableHousingForm.get('placeOfChoice') as FormArray;
			// 	break;
			case 'ownHouseDetail':
				formArrayData = this.affordableHousingForm.get('ownHouseDetail') as FormArray;
				break;
			case 'ownLandPlotDetail':
				formArrayData = this.affordableHousingForm.get('ownLandPlotDetail') as FormArray;
				break;

			default:
				break;
		}
		return formArrayData;
	}

	/**
	 * this method is used for add record in form array
	 * @param key - identify for form array
	 */
	addRecordFormArray(key: string): void {
		debugger
		switch (key) {
			case 'familyMembers':
				this.getFormsArray('familyMembers').push(this.createFormGroup("familyMembers", {}));
				let newlyadded = this.getFormsArray('familyMembers').controls;
				if (newlyadded.length) {
					this.editRecord((newlyadded[newlyadded.length - 1]));
					(<any>newlyadded[newlyadded.length - 1]).newRecordAdded = true;
				}
				this.nextTab=true;
				break;
			case 'placeOfChoice':
				if (this.getFormsArray('placeOfChoice').length < 5) {
					this.getFormsArray('placeOfChoice').push(this.createFormGroup("placeOfChoice", {}));
				} else {
					this.commonService.openAlert("Warning", "You can add maximum 5 place of choice", "warning");
				}
				this.nextTab=true;
				break;
			case 'ownHouseDetail':

				let newlyadded11 = this.getFormsArray('ownHouseDetail').controls;
				if(newlyadded11.length == 10){
					this.toster.warning('you have added the maximum of 10 House Detail');
					return;
				}

				this.getFormsArray('ownHouseDetail').push(this.createFormGroup("ownHouseDetail", {}));
				
				if (newlyadded11.length) {
					this.editRecord((newlyadded11[newlyadded11.length - 1]));
					(<any>newlyadded11[newlyadded11.length - 1]).newRecordAdded = true;
				}
				this.nextTab=true;
				break;
			case 'ownLandPlotDetail':

				var newlyadded22 = this.getFormsArray('ownLandPlotDetail').controls;
				if(newlyadded22.length == 10){
					this.toster.warning('you have added the maximum of 10 Land Plot Detail');
					return;
				}

				this.createFormGroup("placeOfChoice", {})
				this.getFormsArray('ownLandPlotDetail').push(this.createFormGroup("ownLandPlotDetail", {}));
				
				if (newlyadded22.length) {
					this.editRecord((newlyadded22[newlyadded22.length - 1]));
					(<any>newlyadded22[newlyadded22.length - 1]).newRecordAdded = true;
				}
				this.nextTab=true;
				break;

			default:
				break;
		}
	}

	/**
	 * This method use for remove perticular place of choice
	 * @param key -identify for form array
	 * @param idx - place of choice number index
	 */

	deleteFormArrayRecord(key: string, idx: number) {
		switch (key) {
			case 'familyMembers':
				this.getFormsArray('familyMembers').removeAt(idx);
				break;
			case 'placeOfChoice':
				this.getFormsArray('placeOfChoice').removeAt(idx);
				break;
			case 'ownHouseDetail':
				this.getFormsArray('ownHouseDetail').removeAt(idx);
				break;
			case 'ownLandPlotDetail':
				this.getFormsArray('ownLandPlotDetail').removeAt(idx);
				break;

			default:
				break;
		}

	}


	/**
	 * This method is used to submit the PEC registration data
	 */
	onSubmit() {

		if (this.affordableHousingForm.invalid) {
			//this.commonService.prrintInvalidForm(this.affordableHousingForm);
			let count = this.affordableHousingConfiguration.getAllErrors(this.affordableHousingForm);

			this.commonService.openAlert("Warning", this.affordableHousingConfiguration.ALL_FEILD_REQUIRED_MESSAGE, "warning", "", cb => {
				switch (true) {
					case (count <= 27):
						this.tabIndex = 0;
						break;
					case (count <= 48):
						this.tabIndex = 1;
						break;
					case (count <= 58):
						this.tabIndex = 2;
						break;
					case (count <= 62):
						if (count <= 61 && !this.addnewBtnfamily) {
							this.tabIndex = 3;
							break;
						} else {
							this.tabIndex = 3;
							break;
						}
					case (count <= 63):
						if (!this.addnewBtnown) {
							this.tabIndex = 4;
							break;
						}
					case (count <= 64):
						if (!this.addnewBtnPlot) {
							this.tabIndex = 5;
							break;
						}
					case (count <= 67):
						this.tabIndex = 6;
						break;
					case (count <= 68):
						this.tabIndex = 7;
						break;
					default:
						this.tabIndex = 0;
				}

			});
			return;
		}
		/* Normal submit*/
		this.onSubmitUsingAPI();

	}

	/**
	 * This method is use for submit info using API
	 */
	onSubmitUsingAPI() {
		//this.affordableHousingForm.get('formStatus').setValue('APPROVED');
		this.mandatoryFileCheck(this.affordableHousingForm.get('serviceFormId').value, this.attachmentList).then(data => {
			if (data.status) {
				this.formService.saveFormData(this.affordableHousingForm.getRawValue()).subscribe(res => {
					if (Object.keys(res).length) {
						console.log("tet", this.affordableHousingForm.get('serviceFormId').value)
						this.formService.submitFormData(this.affordableHousingForm.get('serviceFormId').value).subscribe(res => {
							this.commonService.openAlert(" Successful", "", "success", `</b>`);
							this.resetForm();
						}, (err) => {
							this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
						});
						return;
					}
				});
			} else {
				this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
				return
			}
		});

	}

	resetForm(isBtnClicked?: boolean) {
		if (isBtnClicked) {
			this.commonService.confirmAlert('Are you sure?', 'question', 'Reset', cb => {
				this.conditionallyResetFields();
			});
		} else {
			this.conditionallyResetFields();
		}

	}

	conditionallyResetFields() {

		//this.showButtons = false;
		this.affordableHousingForm.enable();
		//this.createFormData();
		// let pecNoTextBox = <HTMLInputElement>document.getElementById('pecNoTextBox');
		// pecNoTextBox.value = null;
	}
	/**
	* Method is responsible to check required file upload.
	*/
	mandatoryFileCheck(serviceFormId, attachmentList) {
		return new Promise<any>((resolve, reject) => {
			this.formService.getFormData(serviceFormId).subscribe(respData => {
				if (respData.attachments) {
					let tempArray = [];
					respData.attachments.forEach(element => {
						tempArray.push(element.fieldIdentifier);
					});
					attachmentList.forEach(el => {
						if (tempArray.indexOf(el.fieldIdentifier) === -1 && el.mandatory) {
							resolve({ fileName: el.documentLabelEn, status: false });
							return;
						}
					});
					resolve({ fileName: "", status: true });
				} else {
					resolve({ fileName: "", status: true })
				}
			})
		})
	}


	patchValue() {
		const obj = {
			"schemeId": 1,
			"projectId": 2,
			"category": {
				"code": "SC",
				"name": null
			},
			"firstApplicantFirstName": "Raju",
			"firstApplicantMiddleName": "bhai",
			"firstApplicantLastName": "Patel",
			"firstAppHusWifeFirstName": "Shyam",
			"firstAppHusWifeMiddleName": "bhai",
			"firstAppHusWifeLastName": "Patel",
			"firstAppDateOfBirth": "2002-01-27",
			"firstAppMobileNumOne": "2323232323",
			"currentAddress": {
				"buildingName": "12",
				"streetName": "kishan",
				"landmark": "sfasdfa",
				"area": "dsf",
				"state": "GUJARAT",
				"district": null,
				"city": "Vadodara",
				"country": "INDIA",
				"pincode": "232333"
			},
			"firstAppOccupationAddress": {
				"buildingName": "12",
				"streetName": "kishan",
				"landmark": "sfasdfa",
				"area": "dsf",
				"state": "GUJARAT",
				"district": null,
				"city": "Vadodara",
				"country": "INDIA",
				"pincode": "232333"
			},
			"firstAppOccupation": "sdfsf",
			"firstAppOrganizationName": "sdaf",
			"firstAppOccupationDesignation": "safd",
			"firstAppAadharCardNumber": "123456789123",
			"firstAppPanCardNumber": "GMDSD3443S",

			"secondApplicantFirstName": "Laxman",
			"secondApplicantMiddleName": "Singh",
			"secondApplicantLastName": "rathore",
			"secondAppHusWifeFirstName": "Sita",
			"secondAppHusWifeMiddleName": "Ram",
			"secondAppHusWifeLastName": "Kumar",
			"secondAppDateOfBirth": "2002-01-27",
			"secondAppMobileNumOne": "2323232323",
			"permanentAddress": {
				"buildingName": "12",
				"streetName": "kishan",
				"landmark": "sfasdfa",
				"area": "dsf",
				"state": "GUJARAT",
				"district": null,
				"city": "Vadodara",
				"country": "INDIA",
				"pincode": "232333"
			},
			"secondAppOccupation": "ASE",
			"secondAppOrganizationName": "NASCENT",
			"secondAppOccupationDesignation": "CCC",
			"secondAppAadharCardNumber": "123456789123",
			"secondAppPanCardNumber": "GMDSD3443S",

			"secondAppOccupationAddress": {
				"buildingName": "12",
				"streetName": "kishan",
				"landmark": "sfasdfa",
				"area": "dsf",
				"state": "GUJARAT",
				"district": null,
				"city": "Vadodara",
				"country": "INDIA",
				"pincode": "232333"
			},
			"bankAccountNumber": "4565465454631313",
			"bankBranch": "safd",
			"bankIFSC": "ASDC0000000",
			"bankMicrCode": "dsaf",
			"aggregateAnnualIncomeAmount": "",
			"aggregateAnnualIncomeAmountInWords": "",

			"nomineeName": "adfa",
			"nomineeApplicantRelationShip": "dsf",
			"nomineeAddress": {
				"buildingName": "dsf",
				"streetName": "dfs",
				"landmark": "dsf",
				"area": "dsff",
				"state": "GUJARAT",
				"district": null,
				"city": "Vadodara",
				"country": "INDIA",
				"pincode": "234343"
			},
			"licenseAgreed": true
		}

		this.affordableHousingForm.patchValue(obj);
	}

	
	vaildMobileNumber(event) {
		if(event.target.value.length == ''){
			this.validationErrorMsg = false
		}
		else if (event.target.value.length != 10) {
			this.validationErrorMsg = true
			this.messageForMobileNum = "Maximum Length is 10 digit !"
		}
		else {
			this.validationErrorMsg = false
		}
	}

	vaildAadharCardNumber(event){
	   if(event.target.value.length == ''){
		this.validationErrorMsg = false
	}
	else if (event.target.value.length != 12) {
		this.validationErrorMsg = true
		this.messageForAaadherNum = "Aadhar Number length should be 12 !"
	}
	else {
		this.validationErrorMsg = false
	}
	}

	validPanCardNumber(event){
        if (event.target.value) {
            const matches = event.target.value.match(/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}/);
			this.messageForPanCard = "Enter valid PAN number e.g. ABCDE1234T"
            this.validationErrorMsg = true
        } else {
			this.validationErrorMsg = false
           
        }
    
	}
}
