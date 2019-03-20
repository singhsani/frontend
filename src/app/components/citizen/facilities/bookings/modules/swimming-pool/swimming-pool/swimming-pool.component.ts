import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';

import { ValidationService } from 'src/app/shared/services/validation.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'src/app/shared/modules/translate/translate.service';
import { BookingService } from '../../../shared-booking/services/booking-service.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';

@Component({
  selector: 'app-swimming-pool',
  templateUrl: './swimming-pool.component.html',
  styleUrls: ['./swimming-pool.component.scss']
})
export class SwimmingPoolComponent implements OnInit {

  @ViewChild('postalAddressEstablishment') postalAddressEstablishment: any;

  swimmimgPoolBookingForm: FormGroup;
  translateKey: string = 'swimmingPoolScreen';
  isFileUploaded: boolean = false;

  formId: number;
  apiCode: string;
  public tabIndex: number = 0;
  disableDate = new Date(moment().format('YYYY-MM-DD'));
  SWIMMING_POOL: Array<any> = [];
  applicantageyear: number = null;
  applicantagedays: number = null;
  /**
  * Loading Booking Configuration
  */
  bookingUtils: BookingUtils = new BookingUtils();
  bookingConstants = BookingConstants;

  // required attachment array
  public uploadFilesArray: Array<any> = [];

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
    public validationError: ValidationService,
    private bookingService: BookingService,
    private formService: FormsActionsService,
    private commonService: CommonService,
    private toastrService: ToastrService,
    public translateService: TranslateService,
    private router: Router) { this.bookingService.resourceType = 'swimmingPool'; }

	/**
	 * This method call initially required methods.
	 */
  ngOnInit() {
    this.swimmingPoolFormControls();
    this.getLookupData();
    this.getResourceList();
  }

	/**
	* Method is used to get lookup data
	*/
  getLookupData() {

  }

  /**
   * This method for get resource list
   */
  getResourceList() {
    this.bookingService.getResourceList().subscribe(resp => {
      this.SWIMMING_POOL = resp.data;
    })
  }

	/**
	* Method is used to set form controls
	* 'Guj' control is consider as a Gujarati fields
	*/
  swimmingPoolFormControls() {
    this.swimmimgPoolBookingForm = this.fb.group({
      uniqueId: [null],
      version: [null],
      cancelledDate: [null],
      status: [null],
      refNumber: [null],
      resourceType: [null],
      resourceCode: [null],
      swimmingPoolName: this.fb.group({
        code: [null, Validators.required],
        name: [null],
      }),
      membershipType: this.fb.group({
        code: [null, Validators.required],
        name: [null],
      }),
      category: this.fb.group({
        code: [null, Validators.required],
        name: [null],
      }),
      batchDuration: this.fb.group({
        code: [null, Validators.required],
        name: [null],
      }),
      batchFor: this.fb.group({
        code: [null, Validators.required],
        name: [null],
      }),
      batchName: this.fb.group({
        code: [null, Validators.required],
        name: [null],
      }),
      /* Step 1 controls start */
      applicantFirstName: [null, [Validators.required, Validators.maxLength(30)]],
      applicantMiddleName: [null, [Validators.required, Validators.maxLength(30)]],
      applicantLastName: [null, [Validators.required, Validators.maxLength(30)]],
      mobileNumber: [null, [Validators.required, Validators.maxLength(10)]],
      emergancyNumber: [null, [Validators.required, Validators.maxLength(10)]],
      birthDate: [null, [Validators.required, Validators.maxLength(10)]],
      bloodGroup: this.fb.group({
        code: [null, Validators.required],
        name: [null],
      }),
      age: [null],
      emailId: [null],
      idProof: this.fb.group({
        code: [null, Validators.required],
        name: [null],
      }),
      idProofNo: [null, [Validators.required, Validators.maxLength(12)]],
      // postalAddress: this.fb.group(this.postalAddressEstablishment.addressControls()),

      /* Step 2 controls start */
      nameOfEmployer: [null, [Validators.required, Validators.maxLength(100)]],
      nameOfEmployerGuj: [null, [Validators.required, Validators.maxLength(300)]],
      residentialAddressOfEmployer: [null, [Validators.required, Validators.maxLength(500)]],
      residentialAddressOfEmployerGuj: [null, [Validators.required, Validators.maxLength(1500)]],
      nameOfManager: [null, [Validators.required, Validators.maxLength(60)]],
      residentialAddressOfManager: [null, [Validators.required, Validators.maxLength(500)]],
      categoryOfBusiness: this.fb.group({
        code: [null, Validators.required],
        name: [null],
      }),
      subCategoryOfBusiness: this.fb.group({
        code: [null, Validators.required],
        name: [null],
      }),
      nameOfBusiness: [null, [Validators.required, Validators.maxLength(200)]],
      nameOfBusinessGuj: [null, [Validators.required, Validators.maxLength(600)]],
      commencementOfBusinessDate: [null, Validators.required],
      enterHoliday: this.fb.group({
        code: [null, Validators.required]
      }),
      /* Step 2 controls end */

      /* Step 3 controls start */
      familyList: this.fb.array([]),

      totalAdultEmployerFamily: [null],
      totalYoungEmployerFamily: [null],
      totalManEmployerFamily: [null],
      totalWomenEmployerFamily: [null],
      totalUnidentifiedEmployerFamily: [null],
      totalFamilyMembers: [null],
      /* Step 3 controls end */

      /*  */
      attachment: [null]
      /*  */

    });

  }

  /**
	* Method is used for calculate age
	*/
  calculateAge() {
    let bday = moment(this.swimmimgPoolBookingForm.get("birthDate").value, "YYYY-MM-DD");
    this.applicantageyear = bday.diff(bday, 'years', false);
    this.applicantagedays = bday.diff(bday.add(this.applicantageyear, 'years'), 'days', false);

    this.swimmimgPoolBookingForm.get("age").setValue(this.applicantageyear);
  }


	/**
	 * Method is create required document array
	 */
  requiredDocumentList() {
    this.uploadFilesArray = [];
    let organizationCategory = this.swimmimgPoolBookingForm.get('typeOfOrganisation').value.code;
    if (organizationCategory) {
      _.forEach(this.swimmimgPoolBookingForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {


        if (value.dependentFieldName == null && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
          this.uploadFilesArray.push({
            'labelName': value.documentLabelEn,
            'fieldIdentifier': value.fieldIdentifier,
            'documentIdentifier': value.documentIdentifier
          })
        }

        if (value.dependentFieldName) {
          let dependentFieldArray = value.dependentFieldName.split(",");
          if (dependentFieldArray.includes(organizationCategory) && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
            this.uploadFilesArray.push({
              'labelName': value.documentLabelEn,
              'fieldIdentifier': value.fieldIdentifier,
              'documentIdentifier': value.documentIdentifier
            })
          }
        }

      });
    }
  }


	/**
	 * Method is used to return array
	 * @param data : person data array 
	 * @param persontype : person array type 
	 */
  createArray(data?: any): FormGroup {

    return this.fb.group({
      serviceFormId: this.formId,
      id: data.id ? data.id : null,
      name: [data.name ? data.name : null, [Validators.required, Validators.maxLength(100)]],
			/* contactNo: [data.contactNo ? data.contactNo : null],
			email: [data.email ? data.email : null],
			aadhaarNo: [data.aadhaarNo ? data.aadhaarNo : null], */
      address: [data.address ? data.address : null, [Validators.required, Validators.maxLength(150)]],
      // serviceCode: "SWIMMING-LIC",
      relationship: this.fb.group({
        //code: [data.relationship ? (data.relationship.code ? data.relationship.code : null) : null]//
        code: [data.relationship ? (data.relationship.code ? data.relationship.code : null) : null, [Validators.required]],
      }),
      gender: this.fb.group({
        //code: [data.gender ? (data.gender.code ? data.gender.code : null) : null]
        code: [data.gender ? (data.gender.code ? data.gender.code : null) : null, [Validators.required]],
      }),
      age: [data.age ? data.age : null, [Validators.required, ValidationService.employeeAgeValidate]],
      // employee: [data.employee ? data.employee : null],
      personType: [data.personType ? data.personType : null]
    })

  }

	/**
	 * Method is used to add array in form
	 * @param persontype : person array type
	 */
  addItem() {
    let returnArray: any;
    returnArray = this.swimmimgPoolBookingForm.get('familyList') as FormArray;
    return returnArray;
  }

	/**
	 * Method is used when user click for add person
	 * @param persontype : person array type
	 */
  addMorePerson(persontype?: string) {

    let isEditAnotherRow = this.isTableInEditMode();
    if (!isEditAnotherRow) {
      // if (persontype === "PARTNER") {
      if (this.swimmimgPoolBookingForm.get('age').value && this.addItem().controls.length >= 10) {
        this.toastrService.warning("Parners not allowed more than 10");
        return false;
        // }
      }

      this.addItem().push(this.createArray({
        personType: persontype
      }));
      // this.swimmimgPoolBookingForm.get('employerFamilyList').setValidators([Validators.required]);
      let newlyadded = this.addItem().controls;
      if (newlyadded.length) {
        this.editRecord((newlyadded[newlyadded.length - 1]));
        (newlyadded[newlyadded.length - 1]).newRecordAdded = true;
      }
    }
    else {
      this.commonService.openAlert("Warning", "You can add new recode after save existing recode.", "warning");
    }
  }

	/**
	 * This method is change date format.
	 * @param date : selected date
	 * @param controlType : form control name
	 */
  dateFormat(date, controlType: string) {
    this.swimmimgPoolBookingForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
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
	 * @param formType : form vontrol name
	 * @param fieldsType : set value in this from control
	 * @param filterType : filter type
	 */
  calulateNumberOfPerson(formType: string, fieldsType: string, filterType: string) {
    let countNumber = [];
    let data = (<FormArray>this.swimmimgPoolBookingForm.get(formType)).controls;
    if (data.length) {
      countNumber = data.filter((obj: any) => obj.get('age').value >= 14 && obj.get('age').value <= 18)

      this.swimmimgPoolBookingForm.get(fieldsType).setValue(countNumber.length);
      return countNumber.length;
    }
  }

	/**
	*  Method is used check table is in edit mode
	*/
  isTableInEditMode() {
    return this.addItem().controls.find((obj: any) => obj.isEditMode === true);
  }

	/**
	*  Method is used edit editable data view.
	* @param row: table row id
	*/
  editRecord(row: any) {
    row.isEditMode = true;
    row.deepCopyInEditMode = Object.assign({}, row.value);
  }

	/**
	* Method is used when user click for remove person
	*/
  deleteRecord(index: any) {
    this.commonService.confirmAlert('Are you sure?', "", 'info', '', performDelete => {
      this.addItem().removeAt(index);
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

	/**
	*  Method is used cancel editable dataview.
	* @param row: table row id
	*/
  cancelRecord(row: any, index: number) {
    try {
      if (row.newRecordAdded) {
        this.addItem().removeAt(index);
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
	* Method is used when get business category dropdown data
	* @event is value is "YES" , "NO" and null
	*/
  getCategoryDropdownData(event) {
    // this.swimmingAndEstablishmentService.getCategoryByFilter(event).subscribe(res => {
    //   this.businessCategory = res;
    // })
  }
	/**
	* Method is used when get business sub category dropdown data
	* @event is value fro category dropdown
	*/
  getSubCategoryDropdownData(event) {
    // this.swimmingAndEstablishmentService.getSubCategory(event).subscribe(res => {
    //   this.businessSubCategory = res;
    // })
  }

	/**
	* Method is used when change data of NoOfHumanWorking dropdown
	* @event is value of NoOfHumanWorking dropdown
	*/
  // onChangeNoOfHumanWorking(event) {
  //   try {
  //     this.swimmimgPoolBookingForm.get('categoryOfBusiness').reset();
  //     this.swimmimgPoolBookingForm.get('subCategoryOfBusiness').reset();
  //     this.getCategoryDropdownData(event);
  //   } catch (error) {
  //     console.log(error.message)
  //   }
  // }

	/**
	* Method is used when change data of NoOfHumanWorking dropdown
	* @event is value of NoOfHumanWorking dropdown
	*/
  onChangeCategorySelect(event) {
    try {
      this.swimmimgPoolBookingForm.get('subCategoryOfBusiness').reset();
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

    try {
      (<FormArray>this.swimmimgPoolBookingForm.get('partnerList')).controls = [];
      this.swimmimgPoolBookingForm.get('partnerList').setValue([]);
      this.swimmimgPoolBookingForm.get('attachments').setValue([]);
      if (event == "SWIMMING_LIC_SELF_OWNERSHIP") {
        // remove all controll becose if dropdown value is "SWIMMING_LIC_SELF_OWNERSHIP" then user add only one record.
        this.addMorePerson('PARTNER');
      }
      this.requiredDocumentList();
			/*let categoryAttachment = this.swimmimgPoolBookingForm.get('attachments').value;
			switch (event) {
				case 'SWIMMING_LIC_SELF_OWNERSHIP':
					// remove all controll becose if dropdown value is "SWIMMING_LIC_SELF_OWNERSHIP" then user add only one record.
					this.addMorePerson('PARTNER');
					if (categoryAttachment && categoryAttachment.length) {
						let setNewAttachData = categoryAttachment.filter(attachObj => attachObj.labelName != "PhotoofLicenseHolder" && attachObj.labelName != "OrganizationalOwnershipAgreementCopy");
						this.swimmimgPoolBookingForm.get('attachments').setValue(setNewAttachData);
					}
					break;
				case 'SWIMMING_LIC_PARTNERSHIP':
				case 'SWIMMING_LIC_CO_OPERATIVE_SOCIETY':
					if (categoryAttachment && categoryAttachment.length) {
						let setNewAttachData = categoryAttachment.filter(attachObj => attachObj.labelName != "OrganizationRentalAgreement" && attachObj.labelName != "SaleOrPurchaseDeed");
						this.swimmimgPoolBookingForm.get('attachments').setValue(setNewAttachData);
					}
					break;
				case 'SWIMMING_LIC_COMPANY':
					if (categoryAttachment && categoryAttachment.length) {
						let setNewAttachData = categoryAttachment.filter(attachObj => attachObj.labelName != "OrganizationRentalAgreement" && attachObj.labelName != 'ListOfDirectors' && attachObj.labelName != "Prescribedcertificate" && attachObj.labelName != 'SaleOrPurchaseDeed' && attachObj.labelName != 'DeedPagesPartners');
						this.swimmimgPoolBookingForm.get('attachments').setValue(setNewAttachData);
					}
					break;
				case 'SWIMMING_LIC_TRUST':
				case 'SWIMMING_LIC_BOARD':
					if (categoryAttachment && categoryAttachment.length) {
						let setNewAttachData = categoryAttachment.filter(attachObj => attachObj.labelName != "Prescribedcertificate" && attachObj.labelName != "ChairmanMember" && attachObj.labelName != 'RegiAddressProof');
						this.swimmimgPoolBookingForm.get('attachments').setValue(setNewAttachData);
					}
					break;
			}*/
    } catch (error) {
      console.log(error.message)
    }

  }

	/**
	 * This method set total employee.
	 */
  getTotalEmployeePerson() {
    let totalAdultEmployee = this.swimmimgPoolBookingForm.get('totalAdultEmployee').value || 0;
    let totalYoungEmployee = this.swimmimgPoolBookingForm.get('totalYoungEmployee').value || 0;
    let totalManEmployee = this.swimmimgPoolBookingForm.get('totalManEmployee').value || 0;
    let totalWomenEmployee = this.swimmimgPoolBookingForm.get('totalWomenEmployee').value || 0;
    let totalUnidentified = this.swimmimgPoolBookingForm.get('totalUnidentified').value || 0;

    let totalcount = parseInt(totalAdultEmployee) + parseInt(totalYoungEmployee) + parseInt(totalManEmployee) + parseInt(totalWomenEmployee) + parseInt(totalUnidentified);

    this.swimmimgPoolBookingForm.get('totalEmployee').setValue(totalcount);
    return totalcount;
  }

  /**
   * This method required for final form submition.
   * @param flag - flag of invalid control.
   */
  handleErrorsOnSubmit(flag) {
    // switch (true) {
    //   case flag <= 21:
    //     this.licenseConfiguration.tabIndex = 0;
    //     break;
    //   case flag <= 33:
    //     this.licenseConfiguration.tabIndex = 1;
    //     break;
    //   case flag <= 40:
    //     this.licenseConfiguration.tabIndex = 2;
    //     break;
    //   case flag <= 47:
    //     this.licenseConfiguration.tabIndex = 3;
    //     break;
    //   case flag <= 55:
    //     this.licenseConfiguration.tabIndex = 4;
    //     break;
    //   case flag <= 61:
    //     this.licenseConfiguration.tabIndex = 5;
    //     break;
    //   case flag <= 62:
    //     this.licenseConfiguration.tabIndex = 6;
    //     break;
    //   default:
    //     this.licenseConfiguration.tabIndex = 0;
    // }
    this.checkDynamicTableValidate();
  }

	/**
	 * this method is use for check validate dynamic attachment for employee family list , person occupying list and Partner list
	 */
  checkDynamicTableValidate(): void {
    try {
      this.addItem().controls.forEach(element => {
        if (element.invalid) {
          element.isEditMode = true;
        }
      });

    } catch (error) {
      console.error(error.message);
    }

  }
}
