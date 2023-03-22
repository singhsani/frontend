import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { CommonService } from '../../../../../shared/services/common.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ShopAndEstablishmentService } from './../common/services/shop-and-establishment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';
import { LicenseConfiguration } from '../../license-configuration';
import { TaxRebateApplicationService } from '../../../tax/property/tax-rebate-application/Services/tax-rebate-application.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ProfessionalTaxService } from 'src/app/core/services/citizen/data-services/professional-tax.service';
import { ItemsList } from '@ng-select/ng-select/ng-select/items-list';
import { BookingConstants } from '../../../facilities/bookings/config/booking-config';


@Component({
	selector: 'app-shop-lic-new',
	templateUrl: './shop-lic-new.component.html',
	styleUrls: ['./shop-lic-new.component.scss']
})
export class ShopLicNewComponent implements OnInit {

	@ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

	shopLicNewForm: FormGroup;
	translateKey: string = 'shopLicNewScreen';
	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

	formId: number;
	apiCode: string;
	TotalNoOfPerson: number = 0;
	totalNoOfWoman: number = 0;
	hidesave:boolean = false;
	edit:boolean = true;
	wardZoneLevel = [];
	wardZoneLevel1List = [];
	wardZoneLevel2List = [];
	wardZoneLevel3List = [];
	wardZoneLevel4List = [];

	workerTypes :Array<any> = [];
	womanDocument :Array<any> = [];
	isGuideLineActive: boolean = false;

	isPatners: boolean = false;

	isIntimation: boolean = false;
	isDisabledMorePerson : boolean = false;
	isSubCategory: boolean = false;
	isDisabledBtn: boolean = true;
	isDisabledOrgType: boolean = false;

	//regiTyep: string[] = ['CERTIFICATION', 'INTIMATION'];
	regiTyep: Array<any> = [{
		code: 'INTIMATION',
		name: 'Intimation (Less than 10 Employees)',
	},
	{
		code: 'CERTIFICATION',
		name: 'Registration (10 or more than 10 Employees)',
	},

	];
	registrationType;

	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));

	//Lookup Array
	gender: Array<any> = [];

	workerType: Array<any> = [{
		code: 'WORKERS',
		name: 'Workers',
	}];

	SHOP_LIC_EMPLOYER_FAMILY_PERSON_RELATIONSHIP: Array<any> = [];
	SHOP_LIC_OCCUPANCY_PERSON_RELATIONSHIP: Array<any> = [];
	SHOP_LIC_PARTNER_PERSON_RELATIONSHIP: Array<any> = [];
	SHOP_LIC_TYPE_OF_ORGANIZATION: Array<any> = [];
	relationshipTypeList:Array<any>=[];
	workerTypeList:Array<any>=[];

	YES_NO: Array<any> = [];
	businessCategory: Array<any> = [];
	businessNature: Array<any> = [];

	businessSubCategoryList: Array<any> = [];
	wardNo: Array<any> = [];
	SHOP_LIC_HOLIDAY: Array<any> = [];
	ownershipTypeList: Array<any> = [
		{
			code: 'OWN',
			name: 'Own'
		},
		{
			code: 'RENTED',
			name: 'Rented'
		}
	]

	displayDocs = [];

	// required attachment array
	public uploadFilesArray: Array<any> = [];

	// attachment array from the server ;

	public serverUploadFilesArray: Array<any> = [];

	// Map for the formcontrol to tabIndex id;

	public formControlNameToTabIndex = new Map();

    /**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     * @param uploadFileService - Declare upload file service property.
     * @param commonService - Declare sweet alert.
	 * @param shopAndEstablishmentService - Call only shop licence api.
	 * @param toastrService - Show massage with timer.
     */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private CD: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private commonService: CommonService,
		private shopAndEstablishmentService: ShopAndEstablishmentService,
		private toastrService: ToastrService,
		public TranslateService: TranslateService,
		private taxRebateApplicationService: TaxRebateApplicationService,
		private professionalTaxService : ProfessionalTaxService,
		private alertService: AlertService,

	) { }

	/**
	 * This method call initially required methods.
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.formId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.setFormControlToTabIndexMap();

		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {

			this.isGuideLineActive = true;
			this.getShopLicNewData();
			this.getLookupData();
			this.shopLicNewFormControls();

			this.getWardZoneLevel();
		}

	}

	calculateWorkers(indx) {
		let men = Number(this.shopLicNewForm.get('workerCounts')['controls'][indx].get('noOfMen').value);
		let woman = Number(this.shopLicNewForm.get('workerCounts')['controls'][indx].get('noOfWomen').value);
		if(this.shopLicNewForm.get('workerCounts')['controls'][indx].get('noOfWomen').value != null){
			if(men == 0 && woman == 0){
				this.toastrService.warning("please enter woman or men number more than 0")
				this.shopLicNewForm.get('workerCounts')['controls'][indx].get('noOfMen').reset();
				this.shopLicNewForm.get('workerCounts')['controls'][indx].get('noOfWomen').reset();
			}	
		} 
		let total = men + woman;
		if(total == 0){
			this.shopLicNewForm.get('workerCounts')['controls'][indx].get('total').reset();
		}else{
			this.shopLicNewForm.get('workerCounts')['controls'][indx].get('total').setValue(total);
		}	
	}
	
	hideGuideLine(flag: boolean) {
		if(this.registrationType == "INTIMATION"){
			if (this.shopLicNewForm.get('organizationType').value != null) {
				this.isGuideLineActive = flag;
				
			}else{
				this.alertService.error("Error in fetching data")
			}
		}
		else if(this.registrationType == "CERTIFICATION"){
			if (this.shopLicNewForm.get('organizationType').value != null) {
				this.isGuideLineActive = flag;
			}else{
				this.alertService.error("Error in fetching data")
			}
		}
		else{
			this.alertService.error("Please Select Certificate Type")
			return;
		}
	}

	/**
	 * Method is used to get form data
	 */
	getShopLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.shopLicNewForm.patchValue(res);
				this.licenseConfiguration.isAttachmentButtonsVisible = true;
				res.shopPersonList.forEach(app => {
					(<FormArray>this.shopLicNewForm.get('shopPersonList')).push(this.createArray(app));
				});
				res.workerCounts.forEach(app => {
					(<FormArray>this.shopLicNewForm.get('workerCounts')).push(this.createArrayWorkOut(app));
				});
				res.shopPartnerList.forEach(app => {
					(<FormArray>this.shopLicNewForm.get('shopPartnerList')).push(this.createArrayPatner(app));
					this.isPatners = true;
				});

				this.onChangeNoOfHumanWorking(res.registrationType);
				if(res && res.registrationType){ //disable organization dropdown selection logic
					this.isDisabledOrgType = true; //preview
				}else{
					this.isDisabledOrgType = false; //new reg.
				}

				this.getSubCategoryDropdownData(this.shopLicNewForm.get('establishmentCategory').value.code);

				this.serverUploadFilesArray = res.serviceDetail.serviceUploadDocuments;
				res.serviceDetail.serviceUploadDocuments.forEach(app => {
					(<FormArray>this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
				});
				
				// if (this.shopLicNewForm.get('ownershipType').value) {
				// 	this.updateServiceUploadDocument(this.shopLicNewForm.get('ownershipType').value)
				// }
				// if(res.serviceDetail)
				// //this.isGuideLineActive = false;

				
				if(this.shopLicNewForm.get('waterDrainageZoneId')){
					this.shopLicNewForm.get('zone').setValue(res.waterDrainageZoneName);
				}

				if(this.shopLicNewForm.get('waterDrainageWardId')){
					this.shopLicNewForm.get('ward').setValue(res.waterDrainageWardName);
				}

				if(this.shopLicNewForm.get('waterDrainageBlockId')){
					this.shopLicNewForm.get('block').setValue(res.waterDrainageBlockName);
				}

				if(this.shopLicNewForm.get('workerType')){
					this.shopLicNewForm.get('workerType').setValue(res.workerType);
				}

				if(this.shopLicNewForm.get('otherAddresses')){
					this.shopLicNewForm.get('otherAddresses').setValue(res.otherAddresses);
				}

				if(res.otherDescription != null){
					this.isSubCategory = true;
					this.shopLicNewForm.get('otherDescription').setValue(res.otherDescription);
				}

				if(res.waterDrainageZoneId) {
					this.getWardZone(res.waterDrainageZoneId,2);
				}

				if (res.waterDrainageWardId) {
					this.getWardZone(res.waterDrainageZoneId, 2);
					this.getWardZone(res.waterDrainageWardId,3);
				}
				if (res.waterDrainageBlockId) {
					this.getWardZone(res.waterDrainageWardId, 3);
				}

				if (this.shopLicNewForm.get('ownershipType').value,this.shopLicNewForm.get('organizationType').get('code').value) {
					// this.updateServiceUploadDocument(this.shopLicNewForm.get('ownershipType').value,this.shopLicNewForm.get('organizationType').get('code').value);
					this.moreThanZeroWomenDocument(res,this.shopLicNewForm.get('ownershipType').value,this.shopLicNewForm.get('organizationType').get('code').value)

				}
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
			this.SHOP_LIC_EMPLOYER_FAMILY_PERSON_RELATIONSHIP = res.SHOP_LIC_EMPLOYER_FAMILY_PERSON_RELATIONSHIP;
			this.SHOP_LIC_OCCUPANCY_PERSON_RELATIONSHIP = res.SHOP_LIC_OCCUPANCY_PERSON_RELATIONSHIP;
			this.SHOP_LIC_PARTNER_PERSON_RELATIONSHIP = res.SHOP_LIC_PARTNER_PERSON_RELATIONSHIP;
			this.relationshipTypeList = res.SHOP_ESTABLISHMENT_RELATIONSHIP_TYPE;
			this.workerTypeList = res.SHOP_ESTABLISHMENT_WORKERS_TYPE;
			this.SHOP_LIC_TYPE_OF_ORGANIZATION = res.SHOP_ESTABLISHMENT_ORGANIZATION_TYPE;
			this.businessCategory = res.SHOP_ESTABLISHMENT_CATEGORY;
			this.businessNature = res.SHOP_NATURE_OF_BUSINESS;
			this.YES_NO = res.YES_NO;
			this.wardNo = res.SHOP_LIC_WARD_NO;
			this.gender = res.GENDER;
			this.SHOP_LIC_HOLIDAY = res.SHOP_LIC_HOLIDAY;
		});
	}

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
	shopLicNewFormControls() {
		this.shopLicNewForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'SHOP-ESTAB-LIC-NEW',
			periodFrom: null,
			periodTo: null,
			newRegistration: null,
			registrationType: null,
			renewal: null,
			adminCharges: null,
			netAmount: null,
			/* Step 1 controls start */
			//previousRegistrationNo :  [null, [Validators.maxLength(150)]],//count=4
			establishmentName: [null, [Validators.required, Validators.maxLength(150)]],//count=4
			postalAddress: this.fb.group(this.postalAddressEstablishment.addressControls()),
			
			zone: [null],
      		ward: [null],
			block: [null],
			 
			waterDrainageZoneId: [null,Validators.required],
			waterDrainageWardId: [null,Validators.required],
			waterDrainageBlockId: [null],
			ownershipType: [null, [Validators.required]],

			pecNumber:[null, ValidationService.pecValidation],
			prcNumber:[null, ValidationService.prcValidation],
			censusNumber:[null,ValidationService.censusNumberValidator],
			oldRegistrationNumber: null,
			oldRegistrationDate: null,
			number: null,
			otherAddresses: null,
			/* Step 1 controls end */

			/* Step 2 controls start */
			nameOfEmployer: [null, [Validators.required, Validators.maxLength(100)]],

			employerDesignation: [null, [Validators.required, Validators.maxLength(100)]],
			employerMobileNumber: [null, [Validators.required,ValidationService.mobileNumberValidation]],
			alternateMobileNumber:[null, [ValidationService.mobileNumberValidation]],
			landlineNumber:null,
			 employerEmailId: [null,ValidationService.emailValidator],
			
			residentialAddressOfEmployer: [null, [Validators.required, Validators.maxLength(500)]],

			//nameOfManager: [null, [Validators.required, Validators.maxLength(60)]],
			//residentialAddressOfManager: [null, [Validators.maxLength(500)]],
			establishmentCategory: this.fb.group({
				code: [null, Validators.required],
				name: null,
			}),
			businessSubCategory: this.fb.group({
				code: [null, Validators.required],
				name: null,
			}),
			natureOfBusiness: this.fb.group({
				code: [null, Validators.required],
				name: null,
			}),
			commencementOfBusinessDate: [null, Validators.required],
			otherDescription:null,

			/* Step 2 controls end */


			/* Step 3 controls start */
			shopPersonList: this.fb.array([]),

			/* Step 3 controls end */


			/* Step 4 controls start */
			workerCounts: this.fb.array([]),

			/* Step 4 controls end */


			/* Step 5 controls start */
			organizationType: this.fb.group({
				code: [null, Validators.required]
			}),


			shopPartnerList: this.fb.array([]),


			/* Step 5 controls end */

			/*  */
			attachments: [''],
			agree: [false,null],
			/*  */
		});
		//this.addMorePerson('EMPLOYER_FAMILY');
		//this.addMorePerson('OCCUPANCY');

		// this.shopLicNewForm.get('zone').valueChanges.subscribe(data => {
		// 	console.log(this.wardZoneLevel1List)
		// 	// this.shopLicNewForm.get('waterDrainageZoneId').setValue(data);
		// });
		// this.shopLicNewForm.get('ward').valueChanges.subscribe(data => {
		// 	this.shopLicNewForm.get('waterDrainageWardId').setValue(data);
		// });
		// this.shopLicNewForm.get('block').valueChanges.subscribe(data => {
		// 	this.shopLicNewForm.get('waterDrainageBlockId').setValue(data);
		// });

		
	}


	/**
	 * Method is create required document array
	 */
	requiredDocumentList() {
		this.uploadFilesArray = [];
		// this.uploadFilesArray = [];
		// let organizationCategory = this.shopLicNewForm.get('organizationType').value.code;
		// if (organizationCategory) {
		// 	_.forEach(this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {

		// 		if (value.dependentFieldName == null && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
		// 			this.uploadFilesArray.push({
		// 				'labelName': value.documentLabelEn,
		// 				'fieldIdentifier': value.fieldIdentifier,
		// 				'documentIdentifier': value.documentIdentifier
		// 			})
		// 		}

		// 		if (value.dependentFieldName) {
		// 			let dependentFieldArray = value.dependentFieldName.split(",");
		// 			if (dependentFieldArray.includes(organizationCategory) && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
		// 				this.uploadFilesArray.push({
		// 					'labelName': value.documentLabelEn,
		// 					'fieldIdentifier': value.fieldIdentifier,
		// 					'documentIdentifier': value.documentIdentifier
		// 				})
		// 			}
		// 		}

		// 	});
		// }
	}


	createArrayWorkOut(data?: any): FormGroup {
		return this.fb.group({
			noOfMenOldValue: null,
			noOfWomenldValue:null,
			id: data.id ? data.id : null,
			noOfMen: [data.noOfMen ? data.noOfMen : 0,[Validators.required,Validators.min(0)]],
			noOfWomen: [data.noOfWomen ? data.noOfWomen : 0,[Validators.required,Validators.min(0)]],
			// //workerType: [data.workerType ? data.workerType : null, [Validators.required]],
			workersType: [data.workersType,[Validators.required]],
			total: [data.total ? data.total : null,{validators:[Validators.required,Validators.min(0) ]}]
		})

	}
	/**
	 * Method is used to return array
	 * @param data : person data array 
	 * @param persontype : person array type 
	 */
	createArray(data?: any): FormGroup {
		return this.fb.group({
			id: data.id ? data.id : null,
			name: [data.name ? data.name : null, [Validators.required, Validators.maxLength(100)]],
			address: [data.address ? data.address : null, [Validators.required, Validators.maxLength(150)]],
			// relationship: [data.relationship ? data.relationship : null, [Validators.required, Validators.maxLength(100)]],
			designation: [data.designation ? data.designation : null, [Validators.required, Validators.maxLength(100)]],
			gender: this.fb.group({
				//code: [data.gender ? (data.gender.code ? data.gender.code : null) : null]
				code: [data.gender ? (data.gender.code ? data.gender.code : null) : null, [Validators.required]],
			}),
			relationshipType:this.fb.group({
				code:[data.relationshipType ? (data.relationshipType.code ? data.relationshipType.code : null) :  null,[Validators.required]]
			}),
			
			mobileNo: [data.mobileNo ? data.mobileNo : null],
			emailId: [data.emailId ? data.emailId : null, [ ValidationService.emailValidator]],
		})

	}

	createArrayPatner(data?: any): FormGroup {
		return this.fb.group({
			id: data.id ? data.id : null,
			name: [data.name ? data.name : null, [Validators.required, Validators.maxLength(100)]],
			address: [data.address ? data.address : null, [Validators.required, Validators.maxLength(150)]],
			designation: [data.designation ? data.designation : null, [Validators.required, Validators.maxLength(100)]],
			mobileNo: [data.mobileNo ? data.mobileNo : null, [Validators.required]],
			// employee: [data.employee ? data.employee : null],
			//emailId: [null, [Validators.required, ValidationService.emailValidator]],
			// [data.emailId ? data.emailId :
			emailId: [data.emailId ? data.emailId : null, [Validators.required, ValidationService.emailValidator]]
		})

	}


	getWardZoneLevel() {
		this.taxRebateApplicationService.getWardZoneLevel().subscribe(
			(data) => {
				if (data.status === 200 && data.body.length) {
					this.wardZoneLevel = data.body;
					console.log('wardZoneLevel', this.wardZoneLevel);
					this.wardZoneLevel.sort((a, b) => a.levelOrderSequence - b.levelOrderSequence);
					this.getWardZoneFirstLevel();
				}
			},
			(error) => {
				console.log('error', error);
			}
		)

	}

	getWardZoneFirstLevel() {
		this.taxRebateApplicationService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
			(data) => {
				if (data.status === 200 && data.body.length) {
					this.wardZoneLevel1List = data.body;

				}
			},
			(error) => {
				console.log('error', error);
			})
	}

	getListByWardZoneLevel(value, level) {
		if(value) {
			this.getWardZone(value, level)
		}
		
	}

	onChangedWardZone(value, level) {
		if (level == 2) {
			//this.waterPipeliConnectionForm.controls.waterPipelineWard.setValue();
			this.wardZoneLevel2List = [];
			this.wardZoneLevel3List = [];
			this.wardZoneLevel4List = [];
			if (!value) {
				this.shopLicNewForm.patchValue({
					waterDrainageZoneId: null,
					// zone: null,
					waterDrainageZoneName : null
				});
			}
			this.shopLicNewForm.patchValue({
				waterDrainageWardId: null,
				waterDrainageBlockId: null,
				waterDrainageWardName: null,
				waterDrainageBlockName: null
			});
		}
		else if (level == 3) {
			this.wardZoneLevel3List = [];
			this.wardZoneLevel4List = [];
			if (!value) {
				this.shopLicNewForm.patchValue({
					waterDrainageWardId: null,
					waterDrainageWardName: null
				});
			}
			this.shopLicNewForm.patchValue({
				waterDrainageBlockId: null,
				waterDrainageBlockName : null
			 });
		}
		else if (level == 4) {
			this.wardZoneLevel4List = [];
		}
		if (value)
			this.getWardZone(value, level)
	}

	getWardZone(parentId, level) {
		var postData = {};
		postData = { parentId: parentId };
		this.taxRebateApplicationService.getWardZone(postData).subscribe(
			(data) => {
				if (data.status === 200 && data.body.length) {
					if (level == 2) {
						this.wardZoneLevel2List = data.body;
						this.wardZoneLevel2List.sort((a, b) => {
							return a.shortCode - b.shortCode;
						});						
					}
					else if (level == 3) {
						this.wardZoneLevel3List = data.body;
					}
					else if (level == 4) {
						this.wardZoneLevel4List = data.body;
					}
				}
			},
			(error) => {
				console.log('error', error);
			})
	}

	/**
	 * Method is used to get array from form
	 * @param type : person array type
	 */
	getArrayByType(type: string) {
		let returnArray: any;
		switch (type) {
			case 'EMPLOYER_FAMILY':
				returnArray = this.shopLicNewForm.get('shopPersonList') as FormArray;
				break;
			case 'OCCUPANCY':
				returnArray = this.shopLicNewForm.get('workerCounts') as FormArray;
				break;
			case 'PATNERS':
				returnArray = this.shopLicNewForm.get('shopPartnerList') as FormArray;
				break;

		}
		return returnArray;
	}


	addMorePersonPataner(persontype: string) {

		let isEditAnotherRow = this.isTableInEditMode(persontype);
		if (!isEditAnotherRow) {

			// if (persontype === "PATNERS" && this.getArrayByType(persontype).controls.length >= 2) {
			// 	this.toastrService.warning("Occuping Person not allowed more than 2");
			// 	return false;
			// }

			if (persontype === "PATNERS") {
				this.getArrayByType(persontype).push(this.createArrayPatner({
					personType: persontype
				}));
			}

			let newlyadded = this.getArrayByType(persontype).controls;
			if (newlyadded.length) {
				this.editRecord((newlyadded[newlyadded.length - 1]));
				(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
			}
		}
		else {
			this.commonService.openAlert("Warning", "You can add new record after save existing record.", "warning");
		}
	}

	/**
	 * Method is used to add array in form
	 * @param persontype : person array type
	 */
	addMorePersonwork(persontype: string) {
		this.edit = false;
		let isEditAnotherRow = this.isTableInEditMode(persontype);
		if (!isEditAnotherRow) {

			if (persontype === "OCCUPANCY" && this.getArrayByType(persontype).controls.length >= 5) {
				this.isDisabledMorePerson = true;
			    this.commonService.openAlert("Warning", "Only 5 Worker Type Available", "warning");	
				return false;
			}


			if (persontype === "OCCUPANCY") {
				this.getArrayByType(persontype).push(this.createArrayWorkOut({
					personType: persontype
				}));
			} else {
				this.getArrayByType(persontype).push(this.createArray({
					personType: persontype
				}));
			}

			this.shopLicNewForm.get('workerCounts').clearValidators();

			this.CD.detectChanges();
			let newlyadded = this.getArrayByType(persontype).controls;
			if (newlyadded.length) {
				this.editRecordd((newlyadded[newlyadded.length - 1]));
				(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
			}
		}
		else {
			this.commonService.openAlert("Warning", "You can add new record after save existing record.", "warning");
		}
	}


	addMorePerson(persontype: string) {

		let isEditAnotherRow = this.isTableInEditMode(persontype);
		if (!isEditAnotherRow) {
			if (persontype === "EMPLOYER_FAMILY" && this.getArrayByType(persontype).controls.length >= 5) {
				this.toastrService.warning("Employer family not allowed more than 5");
				return false;
			}
			
			if (persontype === "PARTNER") {
				if (this.shopLicNewForm.get('organizationType').value.code === 'SHOP_LIC_SELF_OWNERSHIP' && this.getArrayByType(persontype).controls.length >= 1) {
					this.toastrService.warning("You can add only one partner becouse you are self ownership");
					return false;
				}
				if (this.shopLicNewForm.get('organizationType').value.code != 'SHOP_LIC_SELF_OWNERSHIP' && this.getArrayByType(persontype).controls.length >= 10) {
					this.toastrService.warning("Parners not allowed more than 10");
					return false;
				}
			}
			
				this.getArrayByType(persontype).push(this.createArray({
					personType: persontype
				}));
				
			
			 this.shopLicNewForm.get('shopPersonList').clearValidators();
			 this.CD.detectChanges();
			let newlyadded = this.getArrayByType(persontype).controls;
			if (newlyadded.length) {
				this.editRecord((newlyadded[newlyadded.length - 1]));
				(newlyadded[newlyadded.length - 1]).newRecordAdded = true;
			}
		}
		else {
			this.commonService.openAlert("Warning", "You can add new record after save existing record.", "warning");
		}
	}

	/**
	 * This method is change date format.
	 * @param date : selected date
	 * @param controlType : form control name
	 */
	dateFormat(date, controlType: string) {
		this.shopLicNewForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method is set gujarati value in change event. 
	 * @param event : dropdown event
	 * @param lookupArray : item list
	 * @param varName : static varialbel
	 */
	onChangeDropdown(event: string, lookupArray: Array<any>, varName: string) {
		if (!_.isUndefined(this.getGujValue(lookupArray, event)))
			this[varName] = this.getGujValue(lookupArray, event);
	}

    /**
	 * This Method is set gujarati value in inputs (static).
	 * @param lookupArray : item list
	 * @param resCode : lookup code
	 */
	getGujValue(lookupArray: Array<any>, resCode: string) {
		return _.result(_.find(lookupArray, function (obj) {
			return obj.code === resCode;
		}), 'gujName');
	}

	/**
	 * Method is used to count person
	 * @param formType : form vontrol nDelete
	calulateNumberOfPerson(formType: string, fieldsType: string, filterType: string) {
		let countNumber = [];
		let data = (<FormArray>this.shopLicNewForm.get(formType)).controls;
		if (data.length) {
			switch (filterType) {
				case 'young': // age is 14 -18 for young person
					countNumber = data.filter((obj: any) => obj.get('age').value >= 14 && obj.get('age').value <= 18 && (obj.get('gender').value.code == "MALE" || obj.get('gender').value.code == "FEMALE"))
					break;

				case 'adult':// age is above 60 for adult person
					countNumber = data.filter((obj: any) => obj.get('age').value > 18 && (obj.get('gender').value.code == "MALE" || obj.get('gender').value.code == "FEMALE"))
					break;

				case 'men':
					countNumber = data.filter((obj: any) => obj.get('gender').value.code == "MALE" && obj.get('age').value >= 14)
					break;
				case 'women':
					countNumber = data.filter((obj: any) => obj.get('gender').value.code == "FEMALE" && obj.get('age').value >= 14)

					break;
				case 'unidentified':
					countNumber = data.filter((obj: any) => obj.get('gender').value.code == "TRANSGENDER" && obj.get('age').value >= 14)

					break;

				case 'total':
					countNumber = data;
					break;
			}
			this.shopLicNewForm.get(fieldsType).setValue(countNumber.length);
			return countNumber.length;
		}
	}

	/**
	*  Method is used check table is in edit mode
	*/
	isTableInEditMode(persontype: string) {
		return this.getArrayByType(persontype).controls.find((obj: any) => obj.isEditMode === true);
	}

	/**
	*  Method is used edit editable data view.
	* @param row: table row id
	*/
	editRecord(row: any) {
		if(this.edit){
			console.log(this.totalNoOfWoman)
			this.deleteWomenDocument();
			this.addWomenDocument();
		}	
		this.edit = true;
		row.isEditMode = true;
		row.deepCopyInEditMode = Object.assign({}, row.value);
	}
	
	editRecordd(row: any) {
		if(this.edit){
			console.log(this.totalNoOfWoman)
			const Rnumber = parseInt(row.controls.noOfWomen.value)
			this.totalNoOfWoman = this.totalNoOfWoman - Rnumber
			this.deleteWomenDocument();
			this.addWomenDocument();
		}	
		this.edit = true;
		row.isEditMode = true;
		row.deepCopyInEditMode = Object.assign({}, row.value);
	}

	/**
	* Method is used when user click for remove person
	*/
	deleteRecord(persontype: string, index: any,item: any) {
		this.deleteWomenDocument();
		this.commonService.confirmAlert('Are you sure?', "", 'info', '', performDelete => {
			this.getArrayByType(persontype).removeAt(index);
			this.toastrService.success("Succesfully deleted", "Deleted");
		});
	}

	/**
	*  Method is used save editable dataview.
	* @param row: table row id
	*/
	saveRecord(row: any) {
		
		if (row.valid) {
				
			row.isEditMode = false;
			row.newRecordAdded = false;
		}
	}


	savePersonOccupyingRecord(row: any) {
	
	  	const	Rnumber = parseInt(row.controls.noOfWomen.value)
		this.totalNoOfWoman =  this.totalNoOfWoman + Rnumber;
		let grandTotal = 0;
		if (this.registrationType === this.regiTyep[0].code) {
			let control = this.shopLicNewForm.get('workerCounts')['controls'];
			for (let i = 0; i < control.length; i++) {
				grandTotal += control[i].get('total').value;
			}

			let max = grandTotal - 9;
			if (max > 0) {
			
				this.commonService.openAlert("Person Occupying", "Maximum 9 person are allowed ", "warning");
			}
			
			else {
				row.isEditMode = false;
				row.newRecordAdded = false;
			}
		}
		else {
			this.saveRecord(row);
		}
		
		this.addWomenDocument();

	}
		/**
		*  Method is used cancel editable dataview.
		* @param row: table row id
		*/
		cancelRecord(row: any, index: number) {
			
			try {
				if (row.newRecordAdded) {
					this.getArrayByType(row.get('personType').value).removeAt(index);
				} else {
					if (row.deepCopyInEditMode) {
						row.patchValue(row.deepCopyInEditMode);
					}
					row.isEditMode = false;
					row.newRecordAdded = false;
				}
			} catch (error) {

			}
		}

		/**
		*  Method is used get selected data from lookup when change.
		* @param lookups : Array
		* @param code : String
		* return object
		*/
		getSelectedDataFromLookUps(lookups: Array<any>, code: string) {
			return lookups.find((obj: any) => obj.code === code);
		}


		/**
		* Method is used when get business sub category dropdown data
		* @event is value fro category dropdown
		*/
		getSubCategoryDropdownData(event) {
			this.shopAndEstablishmentService.getSubCategory(event).subscribe(res => {
				this.businessSubCategoryList = res;
			})
		}

		/**
		* Method is used when change data of NoOfHumanWorking dropdown
		* @event is value of NoOfHumanWorking dropdown
		*/
	onChangeNoOfHumanWorking(event) {
		// 
		if (event)
			this.isDisabledBtn = false;
		else
			this.isDisabledBtn = true;

		this.shopLicNewForm.get('registrationType').setValue(event);
		this.registrationType = event;
		console.log(this.registrationType);
		if (event == 'CERTIFICATION') {
			this.isIntimation = false;
		} else {
			this.isIntimation = true;
		}

	}

	/**
	* Method is used when change data of NoOfHumanWorking dropdown
	* @event is value of NoOfHumanWorking dropdown
	*/
	onChangeCategorySelect(event) {
		try {
			this.shopLicNewForm.get('businessSubCategory').reset();
			this.getSubCategoryDropdownData(event);
		} catch (error) {
			console.log(error.message)
		}
	}

	/**
	* Method is invoked when change dropdown of Type of Organization
	* @event is value of Type of Organization dropdown
	*/
	onChangeTypeOfOrganization(event) {
		this.shopLicNewForm.get('organizationType').get('code').setValue(event);
	 	this.updateServiceUploadDocument(this.shopLicNewForm.get('ownershipType').value,event);
		 this.addWomenDocument();
		try {
			// this.updateServiceUploadDocument(event);
			// when organization Type change Partner List clear  
			if (this.shopLicNewForm.get('shopPartnerList').value.length > 0) {
				for (let i = 0; i < this.shopLicNewForm.get('shopPartnerList').value.length; i++) {
					this.getArrayByType('PATNERS').removeAt(i);
				}
			}
			this.isPatners = false;

			this.shopLicNewForm.get('attachments').setValue([]);
			if (event == "SHOP_LIC_SELF_OWNERSHIP") {
				// remove all controll becose if dropdown value is "SHOP_LIC_SELF_OWNERSHIP" then user add only one record.
				//this.addMorePerson('PARTNER');
			}
			if (event == "PARTNERSHIP") {
				this.isPatners = true;
				//this.addMorePersonPataner('PATNERS');
			}
			// this.requiredDocumentList();

		} catch (error) {
			console.log(error.message)
		}

	}

	/**
	 * This method set total employee.
	 */
	getTotalEmployeePerson() {
		let totalAdultEmployee = this.shopLicNewForm.get('totalAdultEmployee').value || 0;
		let totalYoungEmployee = this.shopLicNewForm.get('totalYoungEmployee').value || 0;
		let totalManEmployee = this.shopLicNewForm.get('totalManEmployee').value || 0;
		let totalWomenEmployee = this.shopLicNewForm.get('totalWomenEmployee').value || 0;
		let totalUnidentified = this.shopLicNewForm.get('totalUnidentified').value || 0;

		let totalcount = parseInt(totalAdultEmployee) + parseInt(totalYoungEmployee) + parseInt(totalManEmployee) + parseInt(totalWomenEmployee) + parseInt(totalUnidentified);

		this.shopLicNewForm.get('totalEmployee').setValue(totalcount);
		return totalcount;
	}

    /**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(key) {

		const index = this.formControlNameToTabIndex.get(key)
		
		if(index == 5) {
			this.licenseConfiguration.currentTabIndex = 5;
				this.commonService.openAlert('Field Error', 'Should be agree with given details', 'warning');
				this.checkDynamicTableValidate();
				return;
		} else if (index) {
			this.licenseConfiguration.currentTabIndex = index;
			this.checkDynamicTableValidate();
			return
		} else {
			this.licenseConfiguration.currentTabIndex = 0;
			this.checkDynamicTableValidate();
			return
		}

	}

	/**
	 * this method is use for check validate dynamic attachment for employee family list , person occupying list and Partner list
	 */
	checkDynamicTableValidate(): void {
		try {
			this.getArrayByType("PATNERS").controls.forEach(ele => {
				if (ele.invalid) {
					ele.isEditMode = true;
				}
			});

			this.getArrayByType("EMPLOYER_FAMILY").controls.forEach(familyEle => {
				if (familyEle.invalid) {
					familyEle.isEditMode = true;
				}
			});

			this.getArrayByType("OCCUPANCY").controls.forEach(occupancy => {
				if (occupancy.invalid) {
					occupancy.isEditMode = true;
				}
			});
		} catch (error) {
			console.error(error.message);
		}

	}

	/**
	 * Set validation as per dependent field value
	 */
	setValidationReq(formControlName: string) {
		if (this.shopLicNewForm.get('applicantVimaAmountPaid').get('code').value == 'YES') {
			this.shopLicNewForm.get(formControlName).setValidators([Validators.required, Validators.maxLength(20)]);
		}
		else {
			this.shopLicNewForm.get(formControlName).clearValidators();
		}
		this.shopLicNewForm.get(formControlName).updateValueAndValidity();
	}

	patchValue() {
		this.shopLicNewForm.patchValue(this.dummyJSON);
	}

	dummyJSON: any = {

		"periodFrom": null,
		"periodTo": null,
		"newRegistration": null,
		"renewal": null,
		"adminCharges": null,
		"netAmount": null,
		"establishmentName": "dsfsdfsdfdsf",
		"establishmentNameGuj": "દ્સ્ફ્સ્દ્ફ્સ્દ્ફ્દ્સ્ફ",
		"postalAddress": {

			"addressType": "SHOP_LIC_POSTAL_ADDRESS",
			"buildingName": "sdfsdf",
			"streetName": "sfdsf",
			"landmark": "dsfdsf",
			"area": "dsfsdf",
			"state": "GUJARAT",
			"district": null,
			"city": "Vadodara",
			"country": "INDIA",
			"pincode": "234234",
			"buildingNameGuj": "સ્દ્ફ્સ્દ્ફ",
			"streetNameGuj": "સ્ફ્દ્સ્ફ",
			"landmarkGuj": "દ્સ્ફ્દ્સ્ફ",
			"areaGuj": "દ્સ્ફ્સ્દ્ફ",
			"stateGuj": "ગુજરાત",
			"districtGuj": null,
			"cityGuj": "વડોદરા",
			"countryGuj": "ભારત"
		},
		"noOfHumanWorking": {
			"code": "YES",
			"name": "Yes"
		},
		"assessmentDoneByVMC": {
			"code": "YES",
			"name": "Yes"
		},
		"propertyTaxNo": "4543543543543",
		"wardNo": {
			"code": "CITY",
			"name": "City"
		},
		"aadharNumber": null,
		"professionalTaxPECNo": "",
		"prcNo": null,
		"applicantVimaAmountPaid": {
			"code": "YES",
			"name": "Yes"
		},
		"number": '1111111111',
		"otherAddresses": "fsdfsdfsdfsdf",
		"nameOfEmployer": "sdfsdfsdfsdf",
		"nameOfEmployerGuj": "સ્દ્ફ્સ્દ્ફ્સ્દ્ફ્સ્દ્ફ",
		"residentialAddressOfEmployer": "dsfdsfsdf",
		"residentialAddressOfEmployerGuj": "દ્સ્ફ્દ્સ્ફ્સ્દ્ફ",
		"employerDesignation": "baroda",
		"employerMobileNumber": "1212121212",
		"employerEmailId": "abe@a.com",
		"nameOfManager": "dsfsdfdsf",
		"residentialAddressOfManager": "dfdsfsdf",
		"establishmentCategory": {
			"code": "COMMERCIAL_ESTABLISHMENT_MORE_THEN_TEN",
			"name": "Commercial Establishment employing Ten or More Employees"
		},
		"natureOfBusiness": {
			"code": "Public",
			"name": "Nature Of Business Public or Private"
		},
		"subCategoryOfBusiness":
		{
			"code": "Other",
			"name": "Sub Category Of Business"
		},
		"subestablishmentCategory": {
			"code": "SHOP_LIC_B_OFFICES_OTHERS",
			"name": "Offices Others"
		},
		"nameOfBusiness": "sfddsfdsfsdfsdf",
		"nameOfBusinessGuj": "સ્ફ્દ્દ્સ્ફ્દ્સ્ફ્સ્દ્ફ્સ્દ્ફ",
		"commencementOfBusinessDate": "2019-12-01",
		"enterHoliday": {
			"code": "SHOP_LIC_MONDAY"
		},

		"shopPersonList": [
			{

				"name": "sdfsdf",
				"address": "sdfsdfsdf",
				"serviceCode": "SHOP-ESTAB-LIC-NEW",
				"designation": "HEAD",
				"mobileNo": "1234567890",
				"emailId": "abee@d.com",
				"relationship": "SHOP_LIC_PARTNER",

				"gender": {
					"code": "MALE"
				},
				"age": 33,
				"personType": "EMPLOYER_FAMILY"
			}
		],
		"totalAdultEmployerFamily": 1,
		"totalYoungEmployerFamily": 0,
		"totalManEmployerFamily": 1,
		"totalWomenEmployerFamily": 0,
		"totalUnidentifiedEmployerFamily": 0,
		"totalFamilyMembers": 1,
		"occupancyList": [
			{

				"name": "fdsfsd",
				"address": "fdsfsdf",
				"serviceCode": "SHOP-ESTAB-LIC-NEW",
				"relationship":
				{
					"code": "SHOP_LIC_EMPLOYEES_RESIDENT",
				},
				"gender": {
					"code": "MALE"
				},
				"age": 23,
				"personType": "OCCUPANCY"
			}
		],
		"totalAdultOccupancy": 1,
		"totalYoungOccupancy": 0,
		"totalManOccupancy": 1,
		"totalWomenOccupancy": 0,
		"totalUnidentifiedOccupancy": 0,
		"totalOccupancy": 1,
		"organizationType": {
			"code": "SHOP_LIC_SELF_OWNERSHIP"
		},
		"workerCounts": [
			{
				"noOfMen": "12",
				"noOfWomen": "12",
				"workerType": "Worker",
				"total": "24"

			}

		],
		"shopPartnerList": [
			{
				"name": "nikul",
				"address": "mehsana",
				"designation": "HEAD",
				"mobileNo": "1234567890",
				"emailId": "abe@a.com",

			}

		],
		"partnerList": [
			{

				"name": "dsfsdfsdf",
				"address": "sdfsdfsdf",
				"serviceCode": "SHOP-ESTAB-LIC-NEW",
				"relationship": {
					"code": "SHOP_LIC_COMPANY"
				},
				"gender": {
					"code": "MALE"
				},

				"age": 33,
				"personType": "PARTNER"
			}
		],
		"totalAdultPartner": 1,
		"totalYoungPartner": 0,
		"totalManPartner": 1,
		"totalWomenPartner": null,
		"totalUnidentifiedPartner": 0,
		"totalPartner": 1,
		"totalAdultEmployee": "1",
		"totalYoungEmployee": "1",
		"totalManEmployee": "1",
		"totalWomenEmployee": "1",
		"totalUnidentified": null,
		"totalEmployee": 4,
		"attachments": [],
		"agree": false,


		"fileStatus": "DRAFT",
		"serviceName": null,
		"fileNumber": null,
		"pid": null,
		"outwardNo": null,
		"paymentStatus": null,
		"canEdit": true,
		"canDelete": true,
		"canSubmit": true,
		"firstName": "SHAN",
		"middleName": null,
		"lastName": "SANGEWAR",
		"aadhaarNo": null,
		"contactNo": "9673475273",
		"email": "shantanu.sangewar@nascentinfo.com",
		"serviceDetail": {
			"code": "SHOP-ESTAB-LIC-NEW",
			"name": "Issue of New License",
			"gujName": "નવા લાયસન્સનો ઇશ્યૂ",
			"feesOnScrutiny": true,
			"appointmentRequired": false
		}
	};



	updateServiceUploadDocument(ownershipType,organizationCode) {
		let array = (<FormArray>this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments'));
		for (let i = array.length - 1; i >= 0; i--) {
			array.removeAt(i)
		}
		const documentCodeList = this.filterDocumentList(ownershipType,organizationCode);
		const localUploadArray = [...this.serverUploadFilesArray];
		this.displayDocs = [];
		this.uploadFilesArray = [];	
		for (let file of localUploadArray) {
			if (this.checkFileNeedToAddInDocumentList(file, documentCodeList)) {
				file['mandatory'] = this.isFileMandatory(file, documentCodeList);
				this.displayDocs.push(file);
				
				if (file['mandatory']) {
					this.uploadFilesArray.push({
						'labelName': file.documentLabelEn,
						'fieldIdentifier': file.fieldIdentifier,
						'documentIdentifier': file.documentIdentifier,
						'mandatory' : file.mandatory
					})
				}

			} else {
				file['mandatory'] = false;
			}
		}

	
		// switch (event) {
		// 	case 'SHOP_LIC_COMPANY':
		// 	case 'SHOP_LIC_TRUST':
		// 	case 'PARTNERSHIP':
		// 	case 'SHOP_LIC_BOARD':
		// 		const localUploadArray = [...this.serverUploadFilesArray]
		// 		for (let file of localUploadArray) {
		// 			if (file['documentIdentifier'] === 'PARTNERSHIP_DEED') {
		// 				file['mandatory'] = false;
		// 			}
		// 			(<FormArray>this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(file));
		// 		}
		// 		break;
		// 	default:
		// 		for (let file of this.serverUploadFilesArray) {
		// 			if (file['documentIdentifier'] === 'PARTNERSHIP_DEED') {
		// 				file['mandatory'] = true;
		// 			}
		// 			(<FormArray>this.shopLicNewForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(file));
		// 		}
		// 		break;
		// }



	}

   
	checkFileNeedToAddInDocumentList(file,documentCodeList){
	
      if(documentCodeList.filter( obj => obj.documentIdentifier == file.documentIdentifier).length > 0){
		  return true;
	  } else {
		  return false;
	  }

	}

	isFileMandatory(file,documentCodeList){
		return documentCodeList.filter( obj => obj.documentIdentifier == file.documentIdentifier)[0].mandatory
	}
	

	ownershipChange(ownershipType) {
		this.shopLicNewForm.get('ownershipType').setValue(ownershipType);
		this.updateServiceUploadDocument(ownershipType,this.shopLicNewForm.get('organizationType').get('code').value)
		this.addWomenDocument();
	}

	/**
	 * This method return upload document list based on registration type and ownership type.
	 * @param ownershipType 
	 */
	filterDocumentList(ownershipType, organizationCode) {
		

		const isPartnerShipSelected =  (organizationCode == 'PARTNERSHIP') ? true : false;


		if (this.isIntimation) {
			return isPartnerShipSelected ? this.commonUploadDocumentForPartnerShip() : this.commonUploadDocument();
		} else {
			// Certificate type
			if (ownershipType == "OWN") {
				let docArray = [
					{
						documentIdentifier: 'LICENSE_COPY',
						mandatory: true
					},
					{
						documentIdentifier: 'OWN_PREMISES_PROOF',
						mandatory: true
					}
				];
			return docArray.concat(isPartnerShipSelected ? this.commonUploadDocumentForPartnerShip() : this.commonUploadDocument());
	
			} else if (ownershipType == "RENTED") {
				let docArray = [
					{
						documentIdentifier: 'LICENSE_COPY',
						mandatory: true
					},
					{
						documentIdentifier: 'RENTED_PREMISES_PROOF',
						mandatory: true
					},
					{
						documentIdentifier: 'RENTED_PREMISES_OWNER_PROOF',
						mandatory: true
					},
					{
						documentIdentifier: 'RENTED_PREMISES_NOC_FOR_OWN_BY_FAMILY_MEMBER',
						mandatory: false
					}
				];
				return docArray.concat(isPartnerShipSelected ? this.commonUploadDocumentForPartnerShip() : this.commonUploadDocument());
			}else {
				return [];
			}
		}


	}


	commonUploadDocumentForPartnerShip(){
		
		const docs = this.commonUploadDocument();
		docs.push({
			documentIdentifier: 'PARTNERSHIP_DEED',
			mandatory: true
		})

		docs.forEach(element => {
			if(element.documentIdentifier == 'SHOP_PAN_CARD') {
				element.mandatory = true;
			}
		});

		return docs;

	}

	addWomenDocument(){
		const localUploadArray = [...this.serverUploadFilesArray];
		let count = 0;
		for (let file of this.displayDocs) {
			if(file.documentIdentifier == 'CONSENT_OF_WOMAN_WOEKER_TO_WORK_IN_NIGHT_SHIFT_FORM_J'){
					count++;
			}
		}
		if(count == 0){
			
			if(this.totalNoOfWoman > 0){
				{
			
					this.womanDocument = [
						{
							documentIdentifier: 'CONSENT_OF_WOMAN_WOEKER_TO_WORK_IN_NIGHT_SHIFT_FORM_J',
							mandatory: true
						},
					]	
				}
				this.returnFile(this.womanDocument);
				}
			}
	}

	deleteWomenDocument(){
		
		 if(this.totalNoOfWoman == 0)
		{
			this.displayDocs.forEach((file,index)=> {
					if(file.documentIdentifier == 'CONSENT_OF_WOMAN_WOEKER_TO_WORK_IN_NIGHT_SHIFT_FORM_J'){
						this.displayDocs.splice(index, 1);
					}
			})
		}
	}

	commonUploadDocument(){
		
		
	 	const comonDocument = [
			{
				documentIdentifier: 'EMPLOYER_ID_PROOF',
				mandatory: true
			},
			{
				documentIdentifier: 'ESTABLISHMENT_PHOTO',
				mandatory: true
			},
			{
				documentIdentifier: 'SHOP_AADHAR_CARD',
				mandatory: false
			},
			{
				documentIdentifier: 'SHOP_PAN_CARD',
				mandatory: false
			},
			{
				documentIdentifier: 'SOCIETY_NOC',
				mandatory: false
			},
			{
				documentIdentifier: 'OTHER_DOC',
				mandatory: false
			},
			{
				documentIdentifier: 'EMPLOYER_PHOTO',
				mandatory: true
			},
			{
				documentIdentifier: 'PEC_OR_PRC_RECEIPT',
				mandatory: false
			},
			{
				documentIdentifier: 'NOTICE_OF_WEEKLY_HOLIDAY_FORM_K',
				mandatory: false
			},
			{
				documentIdentifier: 'FORM_Q',
				mandatory: false
			}
		
		];
		
		if(this.commonService.fromAdmin()){
				
			comonDocument.push({
					documentIdentifier: 'REVIEW_APPLICATION',
					mandatory: true
				})
			}

		
		return comonDocument;
	}

	/**
	*  Method is used cancel editable dataview.
	* @param row: table row id
	*/
	cancelRecordWithPersonType(row: any, index: number,personType : string) {
		
		try {
			if (row.newRecordAdded) {
				console.log('array',this.getArrayByType(personType))
				this.getArrayByType(personType).removeAt(index);
			} else {
				if (row.deepCopyInEditMode) {
					row.patchValue(row.deepCopyInEditMode);
				}
				row.isEditMode = false;
				row.newRecordAdded = false;
			}
		} catch (error) {

		}
	}

	// validatePecPrcNumber(formControl : FormControl){
	// 	  console.log("Pec/Prc ", formControl);
		  
	// 	  if(!formControl.value || formControl.value == ""){
	// 		  return true;
	// 	  } else {
	// 		  this.professionalTaxService.getSearchDetails(formControl.value,true).subscribe(res => {
    //               if(!res.data){
	// 				  formControl.setValue("");
	// 				  this.commonService.openAlert("Error", "Please enter valid EC/RC number", "error");
	// 			  }
	// 		  }, error => {
	// 			  formControl.setValue("");
	// 			  console.error("error",error);
	// 		  })
	// 	  }
	// }

	validatePECNumber(formControl:any){
		
		let numberValue = formControl.value.substring(0,3)
		if(!formControl.value || formControl.value == ""){
			return true;
		}
		else if("PEC"== numberValue){
			if(false == numberValue){
				formControl.setValue("");
			 	this.commonService.openAlert("Error", "Please enter valid PEC number","error");	 
			}error=>{
				formControl.setValue("");
				console.error("error",error);
			}
			
			// this.professionalTaxService.getVerifyNumber(numberValue,formControl.value).subscribe(res => {
			// 	console.log(res);
			// 	console.log(res.data);
			// 			if(false == res.data.success){
			// 				formControl.setValue("");
			// 				this.commonService.openAlert("Error", "Please enter valid PEC number","error");
			// 			}
			// 		},error =>{
			// 			formControl.setValue("");
			// 			console.error("error",error);
			// 		})
		}else{
			formControl.setValue("");
			this.commonService.openAlert("Error", "Please enter valid PEC number","error");
		}
		
	}

	validatePRCNumber(formControl:any){
		
		let numberValue = formControl.value.substring(0,3)
		if(!formControl.value || formControl.value == ""){
			return true;
		}else if("PRC" == numberValue){
			if(false == numberValue){
				formControl.setValue("");
			 	this.commonService.openAlert("Error", "Please enter valid PRC number","error");
			}error=>{
				formControl.setValue("");
				console.error("error",error);
			}
			// this.professionalTaxService.getVerifyNumber(numberValue,formControl.value).subscribe(res => {
			// 	if(false == res.data){
			// 		formControl.setValue("");
			// 		this.commonService.openAlert("Error", "Please enter valid PRC number","error");
			// 	}
			// },error =>{
			// 	formControl.setValue("");+
			// 	console.error("error",error);
			// })
		}else{
			formControl.setValue("");
			this.commonService.openAlert("Error", "Please enter valid PRC number","error");
		}
	}

	
	

	validatePecPropertyNumber(formControl : FormControl){
		
		if(!formControl.value || formControl.value == ""){
			return true;
		} else {
			this.professionalTaxService.isExistPropertyNoCheck(formControl.value).subscribe(res => {
				return true;
			}, error => {
				formControl.setValue("");
				if (error.error[0]){
					this.commonService.openAlert("error", error.error[0].message, "error");
				} else {
					this.commonService.openAlert("Error", "Property/Census No Not found", "error");
				}
					
			})
		}
  }


  setFormControlToTabIndexMap(){
	  this.formControlNameToTabIndex.set('establishmentName',0)
	  this.formControlNameToTabIndex.set('ownershipType',0)
	  this.formControlNameToTabIndex.set('otherAddresses',0)

	  this.formControlNameToTabIndex.set('nameOfEmployer',1)
	  this.formControlNameToTabIndex.set('employerDesignation',1)
	  this.formControlNameToTabIndex.set('employerMobileNumber',1)
	  this.formControlNameToTabIndex.set('alternateMobileNumber',1)
	  this.formControlNameToTabIndex.set('residentialAddressOfEmployer',1)
	  this.formControlNameToTabIndex.set('establishmentCategory',1)
	  this.formControlNameToTabIndex.set('businessSubCategory',1)
	  this.formControlNameToTabIndex.set('natureOfBusiness',1)
	  this.formControlNameToTabIndex.set('commencementOfBusinessDate',1)

	  this.formControlNameToTabIndex.set('organizationType',4)

	  this.formControlNameToTabIndex.set('agree',5)

  }

  patchValue2(){
	 
	const data = {
 
		"contactNo": "9898433579",
		"mobileNo": "9898433579",
		"email": "jil.patel@nascentinfo.com",
		"aadhaarNo": null,
		"agree": false,
		"paymentStatus": null,
		"canEdit": true,
		"canDelete": true,
		"canSubmit": true,
		"serviceCode": "SHOP-ESTAB-LIC-NEW",
		"canReceiptPrint": false,
		"fieldView": "ALL",
		"fieldList": null,
		"applicantName": null,
		"applicantNameGuj": null,
		"establishmentName": "fgfhgfh",
		"postalAddress": {
		  "buildingName": "1",
		  "buildingNameGuj": "૧",
		  "streetName": "gfhfghgf",
		  "streetNameGuj": "ગ્ફ્હ્ફ્ઘ્ગ્ફ",
		  "landmark": "gfhgfhfgh",
		  "landmarkGuj": "ગ્ફ્હ્ગ્ફ્હ્ફ્ઘ",
		  "area": "gfhgfh",
		  "areaGuj": "ગ્ફ્હ્ગ્ફ્હ",
		  "state": "GUJARAT",
		  "stateGuj": "ગુજરાત",
		  "district": null,
		  "districtGuj": null,
		  "city": "Vadodara",
		  "cityGuj": "વડોદરા",
		  "pincode": "454158",
		  "country": "INDIA",
		  "countryGuj": "ભારત"
		},
		"commencementOfBusinessDate": "2021-01-07",
		"otherAddresses": "gfh  gfghfh",
		"nameOfEmployer": "ghgfhf",
	   
		"residentialAddressOfEmployer": "ghfghgfh",
		"employerDesignation": "ghgfhgf",
		"employerMobileNumber": "4874584554",
		"employerEmailId": null,
		
		"shopPersonList": [
		  {
			
			"mobileNo": "5695266566",
			"canReceiptPrint": false,
			"fieldView": "ALL",
			"name": "fghfgh",
			"address": "gfhfghgf",
			"gender": {
			  "code": "MALE",
			  "name": "Male",
			  "gujName": "પુરૂષ"
			},
			"emailId": "ghfg@gmail.com",
			"designation": "ghgfhgf",
			"relationshipType": {
			  "code": "FATHER",
			  "name": "Father"
			}
		  }
		],
		"workerCounts": [
		  {
		   
			"canReceiptPrint": false,
			"fieldView": "ALL",
			"noOfMen": 1,
			"noOfWomen": 1,
			"total": 2,
			"workersType": "WORKERS"
		  }
		],
		"previousRegistrationNo": null,
		"serviceForm": null,
		"waterDrainageZoneId": 1,
		"waterDrainageZoneName": "East",
		"waterDrainageWardId": 5,
		"waterDrainageWardName": "Ward 1",
		"waterDrainageBlockId": 17,
		"waterDrainageBlockName": "Block 01",
		"shopPartnerList": [],
		"ownershipType": "OWN",
		
		"alternateMobileNumber": null,
		"landlineNumber": null,
		"prcNumber": null,
		"pecNumber": null,
		"censusNumber": null,
		"remarks": null,
		"oldRegistrationNumber": null,
		"oldRegistrationDate": null,
		"intimation": null,
		"certification": null,
		"transferCertificateNumber": null
	  }
		this.shopLicNewForm.patchValue(data);
	}

	getCommonWorkerType(){
		let workerGrid = <FormArray>this.shopLicNewForm.get('workerCounts');
		this.shopAndEstablishmentService.getSelectedWorkerType(this.workerTypeList,workerGrid)
	}

	onChangeSubCategory(event){
		if(event == BookingConstants.ANY_METAL_AND_STEEL_SHOPS || event == BookingConstants.ANY_GARAGE_REPAIRING_Shopes
			|| event == BookingConstants.ANY_OFFICES){
			 this.isSubCategory = true;
		}else{
			this.isSubCategory = false;
		}
	}
	
	returnFile(womanDocument:any){
		const localUploadArray = [...this.serverUploadFilesArray];
		const fileDocument = womanDocument[0];
		for (let file of localUploadArray) {
			if(file.documentIdentifier == fileDocument.documentIdentifier)	{	
				if (this.checkFileNeedToAddInDocumentList(file, this.womanDocument)) {
					file['mandatory'] = this.isFileMandatory(file, this.womanDocument);
					this.displayDocs.push(file);
					
					if (file['mandatory']) {
						this.uploadFilesArray.push({
							'labelName': file.documentLabelEn,
							'fieldIdentifier': file.fieldIdentifier,
							'documentIdentifier': file.documentIdentifier,
							'mandatory' : file.mandatory
						})
					}
		
				} else {
					file['mandatory'] = false;
				}
			}
		}
	}

	deletePersonRecord(persontype: string, index: any,item:any){
		const	Rnumber = parseInt(item.controls.noOfWomen.value)
		this.totalNoOfWoman = this.totalNoOfWoman - Rnumber 
		this.deleteWomenDocument();
		this.commonService.confirmAlert('Are you sure?', "", 'info', '', performDelete => {
			this.getArrayByType(persontype).removeAt(index);
			this.toastrService.success("Succesfully deleted", "Deleted");
         this.getCommonWorkerType()
		});
		this.isDisabledMorePerson = false;
	}     

	moreThanZeroWomenDocument(res,ownershipType,organizationType){
		this.totalNoOfWoman = 0;
		if(res.workerCounts != null){
			res.workerCounts.forEach( count => {
				this.totalNoOfWoman = this.totalNoOfWoman + count.noOfWomen;
			})
		}
		this.updateServiceUploadDocument(ownershipType,organizationType);

		let count = 0;
		for (let file of this.displayDocs) {
			if(file.documentIdentifier == 'CONSENT_OF_WOMAN_WOEKER_TO_WORK_IN_NIGHT_SHIFT_FORM_J'){
					count++;
			}
		}
		if(count == 0){
			if(this.totalNoOfWoman > 0){
				{
					this.womanDocument = [
						{
							documentIdentifier: 'CONSENT_OF_WOMAN_WOEKER_TO_WORK_IN_NIGHT_SHIFT_FORM_J',
							mandatory: true
						},

					];				

				}
				
			}
			this.returnFile(this.womanDocument);
		}	
				
	}
}
