
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ManageRoutes } from './../../../../../config/routes-conf';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { Location } from '@angular/common';
import { CommonService } from '../../.././../../shared/services/common.service';
import { FoodService } from '../common/services/food.service';
@Component({
  selector: 'app-food-renew',
  templateUrl: './food-renew.component.html',
  styleUrls: ['./food-renew.component.scss']
})
export class FoodRenewComponent implements OnInit {

  // Select id for edit form
  formId: number;
  apiCode: string;
  foodlicForm: FormGroup;

  @ViewChild('permanantAddressEstablishment') permanantAddressEstablishment: any;

  foodLicNewForm: FormGroup;
  translateKey: string = 'foodScreen';

  tabIndex: number = 0;

  //File and image upload
  uploadModel: any = {};
  private showButtons: boolean = false;

  //Lookups Array
  WARD: Array<any> = [];
  FOOD_BUSINESS_CATE_MANU : Array<any> = [];
  FOOD_BUSINESS_CATE_OTH :  Array<any> = [];
  LOOKUP: any;
  // SOUTH_ZONE : Array<any> = [];
  // EAST_ZONE : Array<any> = [];
  // WEST_ZONE : Array<any> = [];
  // NORTH_ZONE : Array<any> = [];
  FIRM_ZONE : Array<any> = [];
  FOOD_BUSINESS_TURNOVER : Array<any> = [];
  FOOD_BUSINESS_TYPES : Array<any> = [];
  FOOD_IS_REG_OR_LIC : Array<any> = [];
  FOOD_LICENCE_NO_OF_YEAR : Array<any> = [];
  FOOD_LIC_FEES_TYPE : Array<any> = [];
  FOOD_MANUFACTURER_PROCESSOR_BUSINESSTYPE : Array<any> = [];
  FOOD_OTHERS_BUSINESSTYPE : Array<any> = [];
  FOOD_PAYMENT_MODE : Array<any> = [];
  FOOD_REG_LIC_SINGLE_OR_MULTIPLE : Array<any> = [];

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
    private toastrService: ToastrService,
    private FoodService:FoodService,
		private location: Location
  ) { }

	// serach api variable
	serachLicenceObj = {
		isDisplayRenewLicenceForm: <boolean>false,
		searchLicenceNumber: <string>""
	}

	/**
	 * This method for serach licence using licence number.
	 */
	searchLicence() {
		this.FoodService.searchLicence(this.serachLicenceObj.searchLicenceNumber).subscribe(
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

  ngOnInit(){}
    	/**
	 * This method is use to create new record for citizen.
	 * @param searchData: exciting licence number data
	 */
	createRecordPatchSerachData(searchData: any) {
		// this.getLookupData();
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {

			this.formId = res.serviceFormId;
			this.foodLicNewForm.patchValue(searchData);

			this.foodLicNewForm.patchValue({
				id: res.id,
				uniqueId: res.uniqueId,
				version: res.version,
				refNumber: this.serachLicenceObj.searchLicenceNumber,
				serviceFormId: res.serviceFormId,
				createdDate: res.createdDate,
				updatedDate: res.createdDate,
				serviceType: res.serviceType,
				// deptFileStatus: res.deptFileStatus,
				fileStatus: res.fileStatus,
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

				// newRegistration: res.newRegistration,
				// renewal: res.renewal,
				// adminCharges: res.adminCharges,
				// netAmount: res.netAmount,
				licenseIssueDate: res.licenseIssueDate,
				// licenseRenewalDate: res.licenseRenewalDate,
				// loinumber: res.loinumber,
				attachments: [],

			});

			this.showButtons = true;
			// this.foodLicNewForm.get('refNumber').patchValue(this.serachLicenceObj.searchLicenceNumber);

			this.foodLicNewForm.disable();
			// this.enableFielList();

			let currentUrl = this.location.path().replace('false', this.formId.toString());
			this.location.go(currentUrl);
		});
  }

}
