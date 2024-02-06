import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepLabel, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ManageRoutes } from './../../../../../config/routes-conf';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { PaginationService } from '../../../../../core/services/citizen/data-services/pagination.service';
import { CertificateConfig } from '../../certificate-config';
import { CommonService } from '../../../../../shared/services/common.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LicenseConfiguration } from '../../../licences/license-configuration';

@Component({
	selector: 'app-marriage-duplicate',
	templateUrl: './marriage-duplicate.component.html',
	styleUrls: ['./marriage-duplicate.component.scss']
})
export class MarriageDuplicateComponent implements OnInit {

	/**
	 * get element having id as MatPaginator from view.
	 */
	@ViewChild(MatPaginator) paginator: MatPaginator;

	/**
	 * get element having id as MatSort from view.
	 */
	@ViewChild(MatSort) sort: MatSort;
	config: CertificateConfig;

	marriageDuplicateForm: FormGroup;
	marriageSearchForm: FormGroup;
	duplicateCopyDetailsForm : FormGroup;
	applicantDetailsForm : FormGroup;
	translateKey: string = 'duplicateMarriageRegScreen';

	appId: number;
	apiCode: string;
	tabIndex: number = 0;

	/**
	 * row data.
	 */
	rowData: any = {};

	maxYear = new Date().getFullYear();


	// Marriage date 
	disablefutureDate = new Date(moment().format('YYYY-MM-DD'));

	// Step Titles
	stepLable1: string = "applicant_basic_details";
	stepLable2: string = "marriage_details";

	/**
	 * display table column.
	 */
	displayedColumns: any = [
		'id',
		// 'seq',
		'marriageRegNo',
		'marriageRegDate',
		'groomName',
		'brideName',
		'marriageDate',
		'action'
	];

	/**
 * data source useful to display data.
 */
	dataSource = new MatTableDataSource();

	/**
	 * length of result in paginator.
	 */
	resultsLength: number = 0;

	/**
	 * total paze size.
	 */
	pageSize: number = 20;

	/**
	 * flag to load result from api.
	 */
	isLoadingResults: boolean = false;

	/**
	 * show search form.
	 */
	showSearchForm: boolean = false;

	/**
	 * show hide duplicate form.
	 */
	isVisibeDuplicateForm: boolean = true;
	DUPLICATE_COPY_MODE_DUPLICATE_MARRIAGE:Array<any> = [];
	YES_NO: Array<any> = [];
	MARITAL_STATUS: Array<any> = [];
	RELIGION: Array<any> = [];
	licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

    /**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     */
	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private route: ActivatedRoute,
		private paginationService: PaginationService,
		private formService: FormsActionsService,
		private commonService: CommonService,
		private toster: ToastrService
	) {
		this.config = new CertificateConfig(this.paginationService);
	}

	/**
	 * Component life cycle intializes first after constructor.
	 */
	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});
		this.marriageSearchControls();
		this.marriageDuplicateControls();
		if (this.appId) {
			this.isVisibeDuplicateForm = false;
			this.getMarriageDuplicateData();
			this.getLookupData();
		} else {
			this.showSearchForm = true;
		}
	}

	/**
	 * Method is used to create marriage search form controls.
	 */
	marriageSearchControls() {
		this.marriageSearchForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			deptFileStatus: null,
			serviceCode: "HEL-DUPMR",
			marriageRegNumber: null,
			marriageDate: ['', Validators.required],
			marriageRegDate: null,
			marriageRegYear: ['', [Validators.max(this.maxYear), Validators.min(this.maxYear - 100)]],
			groomName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
			brideName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]]
		});
	}

	/**
	 * Method is used to create duplicate form controls.
	 */
	marriageDuplicateControls() {
       
		this.duplicateCopyDetailsForm = this.fb.group({
			duplicateCopyMode: this.fb.group({
				code: [null, [Validators.required]],
				gujName: null,
				id: null,
				name: null,
				orderSequence: null,
				type: null,
				uniqueId: null,
				version: null
			}),
			totalCopies: [null, Validators.required],
		})

         this.applicantDetailsForm = this.fb.group({

		 })

		this.marriageDuplicateForm = this.fb.group({
			//step1
			// duplicateCopies: this.fb.group({
			// 	code: [null, [Validators.required]],
			// 	id: null,
			// 	name: null,
			// }),
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			// deptFileStatus: null,
			serviceCode: "HEL-DUPMR",
			marriageRegNumber: null,
			marriageDate: null,
			marriageRegDate: null,
			marriageRegYear: null,
			groomName: null,
			brideName: null,

			fieldView: "ALL",
			fieldList: null,
			applicantName: null,
			applicantNameGuj: null,
			brideimage : null,
			groomimage: null,
			// id: null,
			// 	uniqueId: null,
			// 	version:null,
			// 	serviceFormId:null,
			// 	createdDate:null,
			// 	updatedDate:null,
			// 	serviceType:null,
			// fileStatus:null,
			// fileStatusName:null,
			// deptFileStatus:null,
			// serviceName:null,
			// fileNumber:null,
			// pid:null,
			// outwardNo:null,
			// loiNumber:null,
			// firstName:null,
			// lastName:" "Jha"",
			// middleName:" null",
			// contactNo:" "7875689111"",
			// mobileNo:" "7875689111"",
			// email:" "aashish".jha@nascentinfo.com",
			// aadhaarNo:" null",
			// agree:" false",
			// paymentStatus:" null",
			// canEdit:" true",
			// canDelete:" true",
			// canSubmit:" true",

			// serviceCode:" "HEL"-DUPMR",
			// fieldView:" "ALL"",
			// fieldList:" null",
			// applicantName:" "aashish" Jha",
			// applicantNameGuj:" null",
			// marriageRegNumber:" null",
			// marriageDate:" null",
			// marriageRegDate:" null",
			// marriageRegYear:" null",
			// groomName:" null",
			// brideName:" null",
			// duplicateCopyMode:" {},"
			// duplicateCopies:" {},"
			// totalCopies:" null"
		});

		this.commonService.createCloneAbstractControl(this.duplicateCopyDetailsForm, this.marriageDuplicateForm);
		this.commonService.createCloneAbstractControl(this.applicantDetailsForm , this.marriageDuplicateForm)
	}

	/**
	 * Method is used to create death record after search data found.
	 * @param data - original json.
	 */
	createDuplicateMRRecord(data) {
		this.formService.createFormData().subscribe(res => {
			this.marriageDuplicateForm.patchValue(res);
			this.marriageDuplicateForm.patchValue(res);
			this.duplicateCopyDetailsForm.patchValue(res);
			this.updateDuplicateRecordValue(data);
			this.appId = res.serviceFormId;
			let cururl = this.location.path().replace('false', this.appId.toString());
			this.location.go(cururl);
		}, err => {
			this.commonService.openAlert("Warning", "Something Went Wrong", "warning");
		});
	}
	
	/**
	 * Method is used to update duplicate form data with original json.
	 * @param data - original json.
	 */
	updateDuplicateRecordValue(data) {
		this.marriageDuplicateForm.get("marriageRegNumber").setValue(data.marriageRegNo);
		this.newgnDateconvert('marriageDate',data.marriageDate);
		// this.marriageDuplicateForm.get("marriageDate").setValue(data.marriageDate);
		this.newgnDateconvert('marriageRegDate', data.marriageRegDate);
		// this.marriageDuplicateForm.get("marriageRegDate").setValue(data.marriageRegDate);
		this.marriageDuplicateForm.get("marriageRegYear").setValue(data.marriageRegYear);
		this.marriageDuplicateForm.get("groomName").setValue(data.groomName);
		this.marriageDuplicateForm.get("brideName").setValue(data.brideName);
		this.marriageDuplicateForm.get("brideimage").setValue(data.brideimage);
		this.marriageDuplicateForm.get("groomimage").setValue(data.groomimage);
	}

	  /**
		* This method for convert newgn response date to yyyy-mm-dd formate
		*/
		newgnDateconvert(controlName: any, date) {
			let dateString = date;
			let dateParts = dateString.split("-");
			let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
	
			this.marriageDuplicateForm.get(controlName).setValue(moment(dateObject).format("YYYY-MM-DD"));
		}

	/**
	 * Method is used to get marriage duplicate form data.
	 */
	getMarriageDuplicateData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.marriageDuplicateForm.patchValue(res);
			this.duplicateCopyDetailsForm.patchValue(res)
			this.marriageDuplicateForm.patchValue(res)
		});
	}

	/**
	 * This method use for checkbox change event
	 * @param event - Checkbox event
	 * @param data - Row Data
	 */
	onChkBoxClick(event, data) {
		if (event.checked)
			this.rowData = data;
		else
			this.rowData = {};
	}

	/**
	 * This method is use for get lookup data
	 */
	getLookupData() {
		this.formService.getDataFromLookups().subscribe(res => {
			this.DUPLICATE_COPY_MODE_DUPLICATE_MARRIAGE = res.DUPLICATE_COPY_MODE_DUPLICATE_MARRIAGE;
			this.YES_NO = res.YES_NO;
			this.RELIGION = res.RELIGION;
			this.MARITAL_STATUS = res.MARITAL_STATUS;
		});
	}

    /**
	 * This method is change date formate
	 */
	dateFormate(date, controlType) {
		this.marriageSearchForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}


	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		let step1 = 3;
		let step2 = 4;

		if (count <= step1) {
			this.tabIndex = 0;
			return false;
		} else if (count <= step2) {
			this.tabIndex = 1;
			return false;
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
	 * Method is used to get all application list.
	 */
	getApplicationDetails() {
		if (this.marriageSearchForm.valid) {
			this.getAllData()
		} else {
			this.config.getAllErrors(this.marriageSearchForm);
			this.commonService.openAlert("Field Error", this.config.ALL_FEILD_REQUIRED_MESSAGE, "warning");
		}
	}

	/**
	 * This method use to get all the citizen data with pagination.
	 */
	getAllData() {
		this.paginator.pageSize = 5;
		this.paginator.pageIndex = 0;
		this.config.getAllData(this.sort, this.paginator, this.pageSize, this.marriageSearchForm.get('apiType').value, this.marriageSearchForm).subscribe((res: any) => {
			if (res.data != null) {

				let newgnData = JSON.parse(res.data);
				let prod_array = [];
				for (let i = 0; i < newgnData.length; i += 1) {
					prod_array.push(newgnData[i]);
				}
				this.dataSource.data = prod_array;

				this.resultsLength = prod_array.length;
			}
			else {
				this.toster.warning('No Record Found');
				this.dataSource.data = [];
				this.resultsLength =0;
			}
		}, err => {
			this.toster.error(err);
		});
		// merge(this.sort.sortChange, this.paginator.page)
		// 	.pipe(
		// 		startWith({}),
		// 		switchMap(() => {
		// 			this.isLoadingResults = true;
		// 			this.paginationService.apiType = this.marriageDuplicateForm.get('apiType').value;
		// 			this.paginationService.pageIndex = (this.paginator.pageIndex + 1);
		// 			this.paginationService.pageSize = this.pageSize;
		// 			return this.paginationService!.getSearchDataWithPagination(this.marriageDuplicateForm.value);
		// 		}),
		// 		map(data => {
		// 			this.isLoadingResults = false;
		// 			this.resultsLength = data.totalRecords;
		// 			return data.data;
		// 		}),
		// 		catchError(() => {
		// 			this.isLoadingResults = false;
		// 			return observableOf([]);
		// 		})
		// 	).subscribe(data => {
		// 		if (!data.length) {
		// 		} else {
		// 			this.dataSource.data = data;
		// 		}
		// 	});
	}

	// getCertificate(){
    //     let certificate = 'certificate';
    //     this.formService.getCertificatOrLiglePrintForDuplicateMrg(certificate,this.appId).subscribe(res => {
    //         let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
    //         sectionToPrintReceipt.innerHTML = res;
    //         setTimeout(() => {
    //             window.print();
    //         }, 300);
    //     },
    //         err => {
    //             this.commonService.openAlert('Error!', err.error[0].message, 'error');
    //         }
    //     )
    // }

	// liglePrint() {
    //     let service = 'legalprint';
    //     this.formService.getCertificatOrLiglePrintForDuplicateMrg(service, this.appId).subscribe(res => {
    //         let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
    //         sectionToPrintReceipt.innerHTML = res;
    //         setTimeout(() => {
    //             window.print();
    //         }, 300);
    //     },
    //         err => {
    //             this.commonService.openAlert('Error!', err.error[0].message, 'error');
    //         }
    //     )
    // }

	/**
	 * This method use for redirect to duplicate form
	 * @param data - Row data
	 */
	redirectToDuplicate(data) {
		this.getLookupData();
		this.createDuplicateMRRecord(data);
		this.showSearchForm = false;
		this.isVisibeDuplicateForm = false;
	}

	getlength(event){
		return false
	}
}
