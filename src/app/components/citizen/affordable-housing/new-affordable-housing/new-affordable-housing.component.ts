import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { CitizenConfig } from '../../citizen-config';
import { ValidationService } from '../../../../shared/services/validation.service';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
	selector: 'app-new-affordable-housing',
	templateUrl: './new-affordable-housing.component.html',
	styleUrls: ['./new-affordable-housing.component.scss']
})
export class NewAffordableHousingComponent implements OnInit {

	@ViewChild('applicantCorrespondenceAddr') applicantCorrespondenceAddrComponent: any;
	@ViewChild('occupationAddr') occupationAddrComponent: any;
	@ViewChild('nomineeAddr') nomineeAddrComponent: any;
	affordableHousingForm: FormGroup;
	translateKey: string = 'affordableHousingScreen';
	actionBarKey: string = 'adminActionBar';
	tabIndex: number = 0;

	appliedForData = [
		{ "code": "BSUP", "name": "BSUP (Basic Services for Urban Poor)" },
		{ "code": "RAY", "name": "RAY (Rajiv Awas Yojna)" },
		{ "code": "MGY", "name": "MGY (Mukhyamantri Gruh Yojana)" },
		{ "code": "PMAY", "name": "PMAY (Pradhan Mantri Awas Yojana)" },
		{ "code": "ISSR", "name": "ISSR" }
	];

	categoriesData = [
		{ "code": "SC", "name": "SC" },
		{ "code": "ST", "name": "ST" },
		{ "code": "Baxi_Panch", "name": "Baxi Panch" },
		{ "code": "Blind", "name": "Blind/Handicapped" },
		{ "code": "Defence", "name": "Defence" },
		{ "code": "General", "name": "General" }
	];

	bankNameArray = [{ "id": 1, "code": "ALLAHABAD_BANK", "name": "Allahabad Bank" }, { "id": 3, "code": "BANK_OF_BARODA", "name": "Bank of Baroda" }, { "id": 4, "code": "BANK_OF_MAHARASHTRA", "name": "Bank of Maharashtra" }, { "id": 5, "code": "CANARA_BANK", "name": "Canara Bank" }, { "id": 6, "code": "BANK_OF_INDIA", "name": "Bank of India" }, { "id": 7, "code": "CENTRAL_BANK_OF_INDIA", "name": "Central Bank of India" }, { "id": 8, "code": "CORPORATION_BANK", "name": "Corporation India" }, { "id": 9, "code": "DENA_BANK", "name": "Dena India" }, { "id": 10, "code": "INDIAN_BANK", "name": "Indian India" }, { "id": 11, "code": "INDIAN_OVERSEAS_BANK", "name": "Indian Overseas India" }, { "id": 12, "code": "ORIENTAL_BANK_OF_COMMERCE", "name": "Oriental Bank of Commerce" }, { "id": 13, "code": "PUNJAB_NATIONAL_BANK", "name": "Punjab National Bank" }, { "id": 14, "code": "SYNDICATE_BANK", "name": "Syndicate Bank" }, { "id": 15, "code": "UNION_BANK_OF_INDIA", "name": "Union Bank of India" }, { "id": 16, "code": "UNITED_BANK_OF_INDIA", "name": "United Bank of India" }, { "id": 17, "code": "PUNJAB_AND_SIND_BANK", "name": "Punjab & Sind Bank" }, { "id": 18, "code": "UCO_BANK", "name": "UCO Bank" }, { "id": 19, "code": "VIJAYA_BANK", "name": "Vijaya Bank" }, { "id": 20, "code": "AXIS_BANK_LIMITED_BANK", "name": "Axis Bank Limited" }, { "id": 21, "code": "BANDHAN_BANK_LIMITED_BANK", "name": "Bandhan Bank Limited" }, { "id": 22, "code": "CATHOLIC_SYRIAN_BANK_LIMITED_BANK", "name": "Catholic Syrian Bank Limited" }, { "id": 23, "code": "CITY_UNION_BANK_LIMITED_BANK", "name": "City Union Bank Limited" }, { "id": 24, "code": "DCB_UNION_BANK_LIMITED_BANK", "name": "DCB Bank Limited" }, { "id": 25, "code": "DHANLAXMI_BANK_LIMITED_BANK", "name": "Dhanlaxmi Union Bank Limited" }, { "id": 26, "code": "FEDERAL_BANK_LIMITED_BANK", "name": "Federal Union Bank Limited" }, { "id": 27, "code": "HDFC_BANK_LIMITED_BANK", "name": "HDFC Bank Limited" }, { "id": 28, "code": "ICICI_BANK_LIMITED_BANK", "name": "ICICI Bank Limited" }, { "id": 29, "code": "KARUR_VYSYA_BANK_LIMITED", "name": "Karur Vysya Bank Limited" }, { "id": 30, "code": "JAMMU_AND_KASHMIR_BANK_LIMITED", "name": "Jammu & Kashmir Bank Limited" }, { "id": 31, "code": "KARNATAKA_BANK_LIMITED", "name": "Karnataka Bank Limited" }, { "id": 32, "code": "KOTAK_MAHINDRA_BANK_LIMITED", "name": "Kotak Mahindra Bank Limited" }, { "id": 33, "code": "LAKSHMI_VILAS_BANK_LIMITED", "name": "Lakshmi Vilas Bank Limited" }, { "id": 34, "code": "NAINITAL_BANK_LIMITED", "name": "Nainital Bank Limited" }, { "id": 35, "code": "R_B_L_BANK_LIMITED", "name": "RBL Bank Limited" }, { "id": 36, "code": "SOUTH_INDIAN_BANK_LIMITED", "name": "South Indian Bank Limited" }, { "id": 37, "code": "TAMILNAD_MERCANTILE_BANK_LIMITED", "name": "Tamilnad Mercantile Bank Limited" }, { "id": 38, "code": "YES_BANK_LIMITED", "name": "YES Bank Limited" }]

	appId: number;
	apiCode: string;
	maxDate: Date = new Date();

	public affordableHousingConfiguration: CitizenConfig = new CitizenConfig();


	constructor(private fb: FormBuilder, private commonService: CommonService) { }

	ngOnInit() {
		this.affordableHousingFormControls();
		// create default one place of choice
		this.addRecordFormArray('placeOfChoice')
	}

	/**
	 * define all gas connection form controls
	 */
	affordableHousingFormControls() {
		this.affordableHousingForm = this.fb.group({
			apiType: null,
			serviceCode: null,

			/* Step 1 controls start */
			appliedFor: this.fb.group({
				code: [null, [Validators.required]],
				name: null,
			}),
			category: this.fb.group({
				code: [null, [Validators.required]],
				name: null,
			}),
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			fatherName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantDob: [null, [Validators.required]],
			contactNo: [null, [Validators.maxLength(15)]],
			mobile: [null, [Validators.required, Validators.maxLength(10)]],
			email: [null, [ValidationService.emailValidator, Validators.maxLength(50)]],
			applicantCorrespondenceAddress: this.fb.group(this.applicantCorrespondenceAddrComponent.addressControls()),
			/* Step 1 controls end */

			/* Step 2 controls start */
			applicantOccupation: [null, [Validators.required, Validators.maxLength(100)]],
			organisationName: [null, [Validators.required, Validators.maxLength(100)]],
			designationHeld: [null, [Validators.required, Validators.maxLength(100)]],
			drivingLicense: [null, [Validators.maxLength(50)]],
			voterID: [null, [Validators.maxLength(25)]],
			aadharID: [null, [Validators.required, Validators.maxLength(20)]],
			panNo: [null, [Validators.required, Validators.maxLength(20)]],
			rationCardNo: [null, [Validators.maxLength(50)]],
			occupationAddress: this.fb.group(this.occupationAddrComponent.addressControls()),
			/* Step 2 controls end */

			/* Step 3 controls start */
			bankAccountNo: [null, [Validators.required, Validators.maxLength(50)]],
			bank: this.fb.group({
				code: [null, Validators.required], name: null,
			}),
			branchName: [null, [Validators.required, Validators.maxLength(200)]],
			IFSCCode: [null, [Validators.required, Validators.maxLength(20)]],
			MICRCode: [null, [Validators.required, Validators.maxLength(25)]],
			/* Step 3 controls end */

			/* Step 4 controls start */
			annualIncome: [null, [Validators.required, Validators.maxLength(10)]],
			annualIncomeWords: [null, [Validators.required, Validators.maxLength(200)]],
			familyMemberList: this.fb.array([]),
			placeOfChoice: this.fb.array([]),
			canEdit: [true],
			/* Step 4 controls end */

			/* Step 5 controls start */
			ownHouseDetail: this.fb.array([]),
			/* Step 5 controls end */

			/* Step 5 controls start */
			ownLandPlotDetail: this.fb.array([]),
			/* Step 5 controls end */

			/* Step 6 controls start */
			nomineeName: [null, [Validators.required, Validators.maxLength(100)]],
			relationWithApplicant: [null, [Validators.required, Validators.maxLength(100)]],
			nomineeAddress: this.fb.group(this.nomineeAddrComponent.addressControls()),
			Accept: [false, [Validators.required]]
			/* Step 6 controls end */
		});
	}

	/**
   * This method use for set the date in form controls
   * @param fieldName - get the selected field's name
   * @param date get the selected date value
   */
	onDateChange(fieldName, date) {
		this.affordableHousingForm.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
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
	handleErrorsOnSubmit(flag) {
		let step0 = 16;
		if (flag != null) {
			if (flag <= step0) {
				this.tabIndex = 0;
				return false;
			} else {
				console.log("else condition");
			}
		}
	}



	/**
	 * Method is used edit editable data view.
	 * @param row table row 
	 */
	editRecord(row: any) {
		row.isEditMode = true;
		row.deepCopyInEditMode = Object.assign({}, row.value);
	}




	/**
	 * Method is used save editable dataview.
	 * @param row table row
	 */
	saveRecord(row: any) {
		if (row.valid) {
			row.isEditMode = false;
			row.newRecordAdded = false;
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
	}


	/**
	 * this methode is used for create form group
	 * @param key - identify for create group for which array
	 * @param data - data is used for when get form 
	 */
	createFormGroup(key: string, data: any): FormGroup {

		let formGroupData: FormGroup;
		switch (key) {
			case 'familyMemberList':
				formGroupData = this.fb.group({
					id: data.id ? data.id : null,
					name: [data.name ? data.name : null, [Validators.required, Validators.maxLength(100)]],
					relationship: [data.relationship ? data.relationship : null, [Validators.required, Validators.maxLength(100)]],
					age: [data.age ? data.age : null, [Validators.required]]
				})
				break;
			case 'placeOfChoice':
				formGroupData = this.fb.group({
					place: [null, [Validators.required, Validators.maxLength(200)]]
				})
				break;
			case 'ownHouseDetail':
			case 'ownLandPlotDetail':
				formGroupData = this.fb.group({
					name: [null, [Validators.required, Validators.maxLength(200)]],
					flatNo: [null, [Validators.required, Validators.maxLength(200)]],
					street: [null, [Validators.required, Validators.maxLength(200)]],
					city: [null, [Validators.required, Validators.maxLength(200)]],
					district: [null, [Validators.required, Validators.maxLength(200)]]
				})
				break;
				// formGroupData = this.fb.group({
				// 	name: [null, [Validators.required, Validators.maxLength(200)]],
				// 	flatNo: [null, [Validators.required, Validators.maxLength(200)]],
				// 	street: [null, [Validators.required, Validators.maxLength(200)]],
				// 	city: [null, [Validators.required, Validators.maxLength(200)]],
				// 	district: [null, [Validators.required, Validators.maxLength(200)]]
				// })
				// break;

			default:
				break;
		}
		return formGroupData;
	}

	/**
	 * create form array
	 * @param key  - identify for form array
	 */
	getFormsArray(key: string): FormArray {
		let formArrayData: FormArray;
		switch (key) {
			case 'familyMemberList':
				formArrayData = this.affordableHousingForm.get('familyMemberList') as FormArray;
				break;
			case 'placeOfChoice':
				formArrayData = this.affordableHousingForm.get('placeOfChoice') as FormArray;
				break;
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
		switch (key) {
			case 'familyMemberList':
				this.getFormsArray('familyMemberList').push(this.createFormGroup("familyMemberList", {}));
				var memberadded = this.getFormsArray('familyMemberList').controls;
				if (memberadded.length) {
					this.editRecord((memberadded[memberadded.length - 1]));
					(<any>memberadded[memberadded.length - 1]).newRecordAdded = true;
				}
				break;
			case 'placeOfChoice':
				if (this.getFormsArray('placeOfChoice').length < 5) {
					this.getFormsArray('placeOfChoice').push(this.createFormGroup("placeOfChoice", {}));
				} else {
					this.commonService.openAlert("Warning", "You can add maximum 5 place of choice", "warning");
				}
				break;
			case 'ownHouseDetail':
				this.getFormsArray('ownHouseDetail').push(this.createFormGroup("ownHouseDetail", {}));
				var houseAdd = this.getFormsArray('ownHouseDetail').controls;
				if (houseAdd.length) {
					this.editRecord((houseAdd[houseAdd.length - 1]));
					(<any>houseAdd[houseAdd.length - 1]).newRecordAdded = true;
				}
				break;
			case 'ownLandPlotDetail':
				this.createFormGroup("placeOfChoice", {})
				this.getFormsArray('ownLandPlotDetail').push(this.createFormGroup("ownLandPlotDetail", {}));
				var newlyadded = this.getFormsArray('ownLandPlotDetail').controls;
				if (newlyadded.length) {
					this.editRecord((newlyadded[newlyadded.length - 1]));
					(<any>newlyadded[newlyadded.length - 1]).newRecordAdded = true;
				}
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
			case 'familyMemberList':
				this.getFormsArray('familyMemberList').removeAt(idx);
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
}
