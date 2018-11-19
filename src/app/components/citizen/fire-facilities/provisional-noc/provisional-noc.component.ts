import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { CommonService } from '../../../../shared/services/common.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-provisional-noc',
	templateUrl: './provisional-noc.component.html',
	styleUrls: ['./provisional-noc.component.scss']
})
export class ProvisionalNocComponent implements OnInit {

	@ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

	provisionalNocForm: FormGroup;
	translateKey: string = 'provisionaNocScreen';

	formId: number;
	apiCode: string;
	tabIndex: number = 0;

	//File and image upload
	uploadModel: any = {};
	private showButtons: boolean = false;

	//Lookups Array
	FS_AREA_ZONE: Array<any> = [];
	FS_APPLIED_FOR: Array<any> = [];
	FS_FIRE_VENDOR_TYPE: Array<any> = [];
	FS_PREVIOUSLY_NOC_TAKEN: Array<any> = [];
	FS_USAGE_TYPE: Array<any> = [];
	FS_AFTERNOON: Array<any> = [];
	FS_PURPOSE_OF_BUILDING_USE: Array<any> = [];
	LOOKUP: any;

	// required attachment array
	private uploadFileArray: Array<any> =
		[
			{ labelName: 'Approved Key Plan, Site Plan,Evaculation	Section Plan Vuda / VMC', fieldIdentifier: '1' },
			{ labelName: 'Approved Layout plan Vuda / VMC', fieldIdentifier: '2' },
			{ labelName: 'Approved Approach Road Vuda / VMC', fieldIdentifier: '3' },
			{ labelName: 'Measurement of Tank (underground,overhead) with map', fieldIdentifier: '4' },
			{ labelName: 'Explosive license(For LPG,CNG,Petrol pump, gas station,Gas storage)', fieldIdentifier: '5' },
			{ labelName: 'Raja chithi of vmc / permission letter of vuda', fieldIdentifier: '6' },

			{ labelName: 'Completion Certificate', fieldIdentifier: '7' },
			{ labelName: 'Structural Stability Certificate', fieldIdentifier: '8' },
			{ labelName: 'Escalator / Lift approved by Govt Certificate', fieldIdentifier: '9' },
			{ labelName: 'Fire Drawing Floor wise i.e. also approved by compliance Authority', fieldIdentifier: '10' },

		];

	/**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     * @param uploadFileService - Declare upload file service property.
     * @param commonService - Declare sweet alert.
	 * @param toastrService - Show massage with timer.
     */
	constructor(
		private fb: FormBuilder,
		private validationService: ValidationService,
		private router: Router,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private commonService: CommonService,
		private toastrService: ToastrService
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

		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getFinalFireNocLicNewData();
			this.getLookupData();
			this.provisionalNocFormControls();
		}
	}

	/**
	 * Method is used to get form data
	 */
	getFinalFireNocLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.provisionalNocForm.patchValue(res);
				this.showButtons = true;
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
			this.FS_APPLIED_FOR = res.FS_APPLIED_FOR;
			this.FS_AREA_ZONE = res.FS_AREA_ZONE;
			this.FS_FIRE_VENDOR_TYPE = res.FS_FIRE_VENDOR_TYPE;
			this.FS_PREVIOUSLY_NOC_TAKEN = res.FS_PREVIOUSLY_NOC_TAKEN;
			this.FS_USAGE_TYPE = res.FS_USAGE_TYPE;
			this.FS_PURPOSE_OF_BUILDING_USE = res.FS_PURPOSE_OF_BUILDING_USE
		});
	}

	/**
	 * Method is used to set form controls
	 * 'Guj' control is consider as a Gujarati fields
	 */
	provisionalNocFormControls() {
		this.provisionalNocForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-PROVI',
			/* Step 1 controls start */
			appliedForId: this.fb.group({
				code: [null]
			}),
			usageTypeId: this.fb.group({
				code: [null]
			}),
			subjectTo: [null, [Validators.required, Validators.maxLength(50)]],
			purposeOfBuildingUse: [],
			architectName: [null, [Validators.required, Validators.maxLength(100)]],
			architectNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
			architectFirmName: [null, [Validators.required, Validators.maxLength(50)]],
			architectFirmNameGuj: [null, [Validators.required, Validators.maxLength(150)]],
			architectRegistrationNumber: [null],
			architectPermanentAddress: [null, [Validators.required, Validators.maxLength(150)]],
			architectPermanentAddressGuj: [null, [Validators.required, Validators.maxLength(450)]],

			architectContactNo: [null],
			siteAddress: [null, [Validators.required, Validators.maxLength(300)]],
			siteAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
			fireVendorType: this.fb.group({
				code: [null]
			}),
			fireVendorRegistrationNumber: [null],
			fireVendorName: [null],
			fireVendorAddress: [null, [Validators.required, Validators.maxLength(300)]],
			fireVendorOfficeAddress: [null, [Validators.required, Validators.maxLength(300)]],
			fpNo: [null, [Validators.required, Validators.maxLength(5)]],
			rsNo: [null, [Validators.required, Validators.maxLength(5)]],
			tikaNo: [null, [Validators.required, Validators.maxLength(5)]],
			tpNo: [null, [Validators.required, Validators.maxLength(5)]],
			buildingLocation: [null, [Validators.required, Validators.maxLength(5)]],
			blockNo: [null, [Validators.required, Validators.maxLength(5)]],
			opNo: [null, [Validators.required, Validators.maxLength(5)]],
			cityServayNo: [null, [Validators.required, Validators.maxLength(5)]],
			buildingHeight: [null, [Validators.required, Validators.maxLength(5)]],
			totalBuildingFloor: [null, [Validators.required, Validators.maxLength(5)]],
			noOfBasement: [null, [Validators.required, Validators.maxLength(3)]],
			lowerBasement: [null, [Validators.required, Validators.maxLength(2)]],
			upperBasement: [null, [Validators.required, Validators.maxLength(2)]],
			basementArea: [null, [Validators.required, Validators.maxLength(3)]],
			multipleTowers: [null, [Validators.required, Validators.maxLength(1)]],
			noOfTowers: [null, [Validators.required, Validators.maxLength(3)]],
			noOfVentilation: [null, [Validators.required, Validators.maxLength(3)]],
			ventilationProvisionDetail: [null, [Validators.required, Validators.maxLength(5)]],
			plotArea: [null, [Validators.required, Validators.maxLength(4)]],
			constructionArea: [null, [Validators.required, Validators.maxLength(4)]],
			//	no_of_approached_road:[null],
			drawingProvided: [null, Validators.required],
			siteAddressWithBuildingName: [null, [Validators.required, Validators.maxLength(200)]],
			otherInformation: [null, [Validators.required, Validators.maxLength(200)]],
			gaslineInUnderground: [null, Validators.required],
			undergroundCabling: [null, Validators.required],
			ongcLineInUnderground: [null, Validators.required],
			areaZone: this.fb.group({
				code: [null]
			}),
			previouslyNocTaken: this.fb.group({
				code: [null]
			}),
			undergroundWaterTankLength: [null, [Validators.required, Validators.maxLength(3)]],
			undergroundWaterTankBreadth: [null, [Validators.required, Validators.maxLength(3)]],
			undergroundWaterTankHeight: [null, [Validators.required, Validators.maxLength(3)]],
			undergroundWaterTankCapacity: [null, [Validators.required, Validators.maxLength(3)]],
			undergroundWaterTankVolume: [null, [Validators.required, Validators.maxLength(3)]],
			undergroundWatertankMapApproved: [null, Validators.required],
			overgroundWaterTankLength: [null, [Validators.required, Validators.maxLength(5)]],
			overgroundWaterTankBreadth: [null, [Validators.required, Validators.maxLength(5)]],
			overgroundWaterTankHeight: [null, [Validators.required, Validators.maxLength(5)]],
			overgroundWaterTankCapacity: [null, [Validators.required, Validators.maxLength(5)]],
			overgroundWaterTankVolume: [null, [Validators.required, Validators.maxLength(5)]],
			overgroundWatertankMapApproved: [null, Validators.required],
			/* Step 4 controls start*/
			attachments: []
			/* Step 4 controls end */
		});
	}

	/**
 	* Method is used to set data value to upload method.
 	* @param indentifier - file identifier
 	* @param labelName - file label name.
 	* @param formPart - file form part
 	* @param variableName - file variable name.
 	*/
	setDataValue(indentifier: number, labelName: string, formPart: string, variableName: string) {
		this.uploadModel = {
			fieldIdentifier: indentifier.toString(),
			labelName: labelName,
			formPart: formPart,
			variableName: variableName,
			serviceFormId: this.formId,
		}
		return this.uploadModel;
	}

	/**
 	 * This method use to get output event of tab change
 	 * @param evt - Tab index
 	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}
}
