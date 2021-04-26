import { Component, OnInit, ViewChild } from '@angular/core';
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

	attachmentList: any = [];
	appliedForData = [];
	projectData = [];

	addnewBtnown: boolean = true;
	addnewBtnPlot: boolean = true;
	addnewBtnfamily = true;

	showButtons: boolean = false;
	bankNameArray = [{ "id": 1, "code": "ALLAHABAD_BANK", "name": "Allahabad Bank" }, { "id": 3, "code": "BANK_OF_BARODA", "name": "Bank of Baroda" }, { "id": 4, "code": "BANK_OF_MAHARASHTRA", "name": "Bank of Maharashtra" }, { "id": 5, "code": "CANARA_BANK", "name": "Canara Bank" }, { "id": 6, "code": "BANK_OF_INDIA", "name": "Bank of India" }, { "id": 7, "code": "CENTRAL_BANK_OF_INDIA", "name": "Central Bank of India" }, { "id": 8, "code": "CORPORATION_BANK", "name": "Corporation India" }, { "id": 9, "code": "DENA_BANK", "name": "Dena India" }, { "id": 10, "code": "INDIAN_BANK", "name": "Indian India" }, { "id": 11, "code": "INDIAN_OVERSEAS_BANK", "name": "Indian Overseas India" }, { "id": 12, "code": "ORIENTAL_BANK_OF_COMMERCE", "name": "Oriental Bank of Commerce" }, { "id": 13, "code": "PUNJAB_NATIONAL_BANK", "name": "Punjab National Bank" }, { "id": 14, "code": "SYNDICATE_BANK", "name": "Syndicate Bank" }, { "id": 15, "code": "UNION_BANK_OF_INDIA", "name": "Union Bank of India" }, { "id": 16, "code": "UNITED_BANK_OF_INDIA", "name": "United Bank of India" }, { "id": 17, "code": "PUNJAB_AND_SIND_BANK", "name": "Punjab & Sind Bank" }, { "id": 18, "code": "UCO_BANK", "name": "UCO Bank" }, { "id": 19, "code": "VIJAYA_BANK", "name": "Vijaya Bank" }, { "id": 20, "code": "AXIS_BANK_LIMITED_BANK", "name": "Axis Bank Limited" }, { "id": 21, "code": "BANDHAN_BANK_LIMITED_BANK", "name": "Bandhan Bank Limited" }, { "id": 22, "code": "CATHOLIC_SYRIAN_BANK_LIMITED_BANK", "name": "Catholic Syrian Bank Limited" }, { "id": 23, "code": "CITY_UNION_BANK_LIMITED_BANK", "name": "City Union Bank Limited" }, { "id": 24, "code": "DCB_UNION_BANK_LIMITED_BANK", "name": "DCB Bank Limited" }, { "id": 25, "code": "DHANLAXMI_BANK_LIMITED_BANK", "name": "Dhanlaxmi Union Bank Limited" }, { "id": 26, "code": "FEDERAL_BANK_LIMITED_BANK", "name": "Federal Union Bank Limited" }, { "id": 27, "code": "HDFC_BANK_LIMITED_BANK", "name": "HDFC Bank Limited" }, { "id": 28, "code": "ICICI_BANK_LIMITED_BANK", "name": "ICICI Bank Limited" }, { "id": 29, "code": "KARUR_VYSYA_BANK_LIMITED", "name": "Karur Vysya Bank Limited" }, { "id": 30, "code": "JAMMU_AND_KASHMIR_BANK_LIMITED", "name": "Jammu & Kashmir Bank Limited" }, { "id": 31, "code": "KARNATAKA_BANK_LIMITED", "name": "Karnataka Bank Limited" }, { "id": 32, "code": "KOTAK_MAHINDRA_BANK_LIMITED", "name": "Kotak Mahindra Bank Limited" }, { "id": 33, "code": "LAKSHMI_VILAS_BANK_LIMITED", "name": "Lakshmi Vilas Bank Limited" }, { "id": 34, "code": "NAINITAL_BANK_LIMITED", "name": "Nainital Bank Limited" }, { "id": 35, "code": "R_B_L_BANK_LIMITED", "name": "RBL Bank Limited" }, { "id": 36, "code": "SOUTH_INDIAN_BANK_LIMITED", "name": "South Indian Bank Limited" }, { "id": 37, "code": "TAMILNAD_MERCANTILE_BANK_LIMITED", "name": "Tamilnad Mercantile Bank Limited" }, { "id": 38, "code": "YES_BANK_LIMITED", "name": "YES Bank Limited" }]

	formId: number;

	appId: number;
	apiCode: string;
	maxDate = moment(new Date()).subtract("18", "years").format("YYYY-MM-DD");

	public affordableHousingConfiguration: CitizenConfig = new CitizenConfig();
	MF_CATEGORY_TYPE: Array<any> = [];

	LOOKUP: any;

	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		public validationError: ValidationService,
		private formService: FormsActionsService,
		private router: Router,
		private commonService: CommonService,
		private toster: ToastrService,
		private affodableService: AffodableService) { }

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.formId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		},
			err => {
				this.toster.error(err.error.error_description);
			});
		this.getLookupData();
		this.getLookupDataApplyFor();
		this.getAllDocumentLists();
		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
			this.createFormData();
		}
		else {
			this.getMuttonFishLicNewData();
			this.affordableHousingFormControls();
			// create default one place of choice
			this.addRecordFormArray('placeOfChoice')

		}

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

	/**
	 * Method is used to get form data
	 */
	getMuttonFishLicNewData() {
		this.formService.getFormData(this.formId).subscribe(res => {
			try {
				this.affordableHousingForm.patchValue(res);



				// res.serviceDetail.serviceUploadDocuments.forEach(app => {
				// 	(<FormArray>this.affordableHousingForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.licenseConfiguration.createDocumentsGrp(app));
				// });
				//this.uploadFileArray = this.licenseConfiguration.requiredDocumentListMeetFish(this.muttonFishNewForm);

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

		this.affodableService.getProject(shcmeid).subscribe(
			(res: any) => {
				this.projectData = res;
			}, (err: any) => {

			})
	}

	/**
	 * define all gas connection form controls
	 */
	affordableHousingFormControls() {
		this.affordableHousingForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'AFFORD-HOUSE',
			serviceFormId: null,

			/* Step 1 controls start */
			schemeId: [null, [Validators.required, Validators.maxLength(100)]],
			projectId: [null, [Validators.required, Validators.maxLength(100)]],
			category: this.fb.group({
				code: [null, [Validators.required]],
				name: null,
			}),
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantMiddleName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantLastName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantFatherName: [null, [Validators.required, Validators.maxLength(100)]],
			dateOfBirth: [null, [Validators.required]],
			telephoneNumber: [null, [Validators.maxLength(15)]],
			mobileNumber: [null, [Validators.required, Validators.maxLength(10)]],
			email: [null, [ValidationService.emailValidator, Validators.maxLength(50)]],
			applicantHusbandWifeFirstName: [null, Validators.required, Validators.maxLength(100)],
			applicantHusbandWifeMiddleName: [null, Validators.required, Validators.maxLength(100)],
			applicantHusbandWifeLastName: [null, Validators.required, Validators.maxLength(100)],
			correspondanceAddress: this.fb.group(this.applicantCorrespondenceAddrComponent.addressControls()),
			/* Step 1 controls end */

			/* Step 2 controls start */
			occupation: [null, [Validators.required, Validators.maxLength(100)]],
			organizationName: [null, [Validators.required, Validators.maxLength(100)]],
			occupationDesignation: [null, [Validators.required, Validators.maxLength(100)]],
			drivingLicenseNumber: [null, [Validators.maxLength(50)]],
			voterIdNumber: [null, [Validators.maxLength(25)]],
			aadharCardNumber: [null, [Validators.required, Validators.maxLength(12), Validators.minLength(12)]],
			panCardNumber: [null, [Validators.required, ValidationService.panValidator, Validators.maxLength(10)]],
			rationCardNumber: [null, [Validators.maxLength(50)]],
			occupationAddress: this.fb.group(this.occupationAddrComponent.addressControls()),
			// /* Step 2 controls end */

			// /* Step 3 controls start */
			bankAccountNumber: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(18)]],
			bank: this.fb.group({
				code: [null, [Validators.required]],
				name: null,
			}),
			bankBranch: [null, [Validators.required, Validators.maxLength(100)]],
			bankIFSC: [null, [Validators.required, ValidationService.ifscCodeValidator, Validators.maxLength(11)]],
			bankMicrCode: [null, [Validators.required, Validators.maxLength(9)]],
			// /* Step 3 controls end */

			// /* Step 4 controls start */
			aggregateAnnualIncomeAmount: [null, [Validators.required, Validators.maxLength(10)]],
			aggregateAnnualIncomeAmountInWords: [null, [Validators.required, Validators.maxLength(200)]],
			familyMembers: this.fb.array([]),
			placeOfChoice: this.fb.array([]),
			canEdit: [true],
			// /* Step 4 controls end */

			// /* Step 5 controls start */
			ownHouseDetail: this.fb.array([]),
			// /* Step 5 controls end */

			// /* Step 5 controls start */
			ownLandPlotDetail: this.fb.array([]),
			// /* Step 5 controls end */

			// /* Step 6 controls start */
			nomineeName: [null, [Validators.required, Validators.maxLength(100)]],
			nomineeApplicantRelationShip: [null, [Validators.required, Validators.maxLength(100)]],
			nomineeAddress: this.fb.group(this.nomineeAddrComponent.addressControls()),
			licenseAgreed: [true],
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
	 * This method is use for get all the checklist
	 */
	getAllDocumentLists() {
		this.affodableService.getAllDocuments().subscribe(res => {
			this.attachmentList = _.cloneDeep(res);
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
			case 'placeOfChoice':
				formGroupData = this.fb.group({
					name: [null, [Validators.required, Validators.maxLength(200)]]
				})
				break;
			case 'ownHouseDetail':
			case 'ownLandPlotDetail':
				formGroupData = this.fb.group({
					name: [null, [Validators.required, Validators.maxLength(200)]],
					flatNo: [null, [Validators.required, Validators.maxLength(200)]],
					street: [null, [Validators.required, Validators.maxLength(200)]],
					city: [null, [Validators.required, Validators.maxLength(200)]],
					district: [null, [Validators.required, Validators.maxLength(200)]],
					pincode: [null, [Validators.required, Validators.maxLength(200)]]
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
	 * create form array
	 * @param key  - identify for form array
	 */
	getFormsArray(key: string): FormArray {
		let formArrayData: FormArray;
		switch (key) {
			case 'familyMembers':
				formArrayData = this.affordableHousingForm.get('familyMembers') as FormArray;
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
			case 'familyMembers':
				this.getFormsArray('familyMembers').push(this.createFormGroup("familyMembers", {}));
				let newlyadded = this.getFormsArray('familyMembers').controls;
				if (newlyadded.length) {
					this.editRecord((newlyadded[newlyadded.length - 1]));
					(<any>newlyadded[newlyadded.length - 1]).newRecordAdded = true;
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
				let newlyadded11 = this.getFormsArray('ownHouseDetail').controls;
				if (newlyadded11.length) {
					this.editRecord((newlyadded11[newlyadded11.length - 1]));
					(<any>newlyadded11[newlyadded11.length - 1]).newRecordAdded = true;
				}
				break;
			case 'ownLandPlotDetail':
				this.createFormGroup("placeOfChoice", {})
				this.getFormsArray('ownLandPlotDetail').push(this.createFormGroup("ownLandPlotDetail", {}));
				var newlyadded22 = this.getFormsArray('ownLandPlotDetail').controls;
				if (newlyadded22.length) {
					this.editRecord((newlyadded22[newlyadded22.length - 1]));
					(<any>newlyadded22[newlyadded22.length - 1]).newRecordAdded = true;
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
	onSubmit(dateChanged?: boolean) {

		if (this.affordableHousingForm.invalid) {
			//this.commonService.prrintInvalidForm(this.affordableHousingForm);
			let count = this.affordableHousingConfiguration.getAllErrors(this.affordableHousingForm);
			debugger;
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
		this.onSubmitUsingAPI(dateChanged);

	}

	/**
	 * This method is use for submit info using API
	 */
	onSubmitUsingAPI(dateChanged?: boolean) {
		//this.affordableHousingForm.get('formStatus').setValue('APPROVED');
		this.mandatoryFileCheck(this.affordableHousingForm.get('serviceFormId').value, this.attachmentList).then(data => {
			if (data.status) {
				this.formService.saveFormData(this.affordableHousingForm.getRawValue()).subscribe(res => {
					if (Object.keys(res).length) {
						console.log("tet", this.affordableHousingForm.get('serviceFormId').value)
						this.formService.submitFormData(this.affordableHousingForm.get('serviceFormId').value).subscribe(res => {
							this.commonService.openAlert(" Successful", "", "success", `</b>`);
							this.resetForm();
							},(err)=> {
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
		const data = {
			"applicantName": "Raju Bhai Patel",
			"applicantFatherName": "Ghanshyam Patel",
			"dateOfBirth": "2021-02-05",
			"telephoneNumber": null,
			"mobileNumber": "4555555555",
			"email": null,
			"correspondanceAddress": {

				"addressType": "CORRESPONDANCE_ADDRESS",
				"buildingName": "1",
				"streetName": null,
				"landmark": null,
				"area": "jkhkhg",
				"state": "Anhui Province",
				"district": null,
				"city": "Anqing",
				"country": "CHINA",
				"pincode": "111111",
				"buildingNameGuj": "૧",
			},
			"occupation": "jhkhjkhj",
			"organizationName": "khjkhj",
			"occupationDesignation": "jkhjk",
			"drivingLicenseNumber": null,
			"voterIdNumber": null,
			"aadharCardNumber": "122222222222",
			"panCardNumber": "ABCDE1235A",
			"rationCardNumber": null,
			"occupationAddress": {

				"addressType": "OCCUPATION_ADDRESS",
				"buildingName": "1",
				"streetName": null,
				"landmark": null,
				"area": "dfdasgfsdf@gmail.com",
				"state": "Anhui Province",
				"district": null,
				"city": "Anqing",
				"country": "CHINA",
				"pincode": "222222",

			},
			"bankAccountNumber": "54444444444444",
			"bank": {
				"code": "BANK_OF_BARODA",
				"name": null
			},
			"bankBranch": "uiiiiiiiiiii",
			"bankIFSC": "LKLK0000000",
			"bankMicrCode": "154444444",
			"aggregateAnnualIncomeAmount": 1000,
			"aggregateAnnualIncomeAmountInWords": "One thousand",
			"canEdit": true,
			"ownHouseDetail": [],
			"ownLandPlotDetail": [],
			"nomineeName": "dffffffff",
			"nomineeApplicantRelationShip": "dffffffffff",
			"nomineeAddress": {

				"addressType": "NOMINEE",
				"buildingName": "1",
				"streetName": null,
				"landmark": null,
				"area": "dfs",
				"state": "GUJARAT",
				"district": null,
				"city": "Ahmedabad",
				"country": "INDIA",
				"pincode": "111111",
				"buildingNameGuj": "૧",
				"streetNameGuj": null,
				"landmarkGuj": null,
				"areaGuj": "દ્ફ્સ",
				"stateGuj": null,
				"districtGuj": null,
				"cityGuj": null,
				"countryGuj": null
			}
		}
		this.affordableHousingForm.patchValue(data);
	}
}
