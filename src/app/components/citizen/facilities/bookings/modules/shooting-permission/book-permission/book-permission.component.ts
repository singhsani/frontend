import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
//import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';
import { MatPaginator, MatSort } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'src/app/shared/modules/translate/translate.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { BookingService } from '../../../shared-booking/services/booking-service.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';

@Component({
  selector: 'app-book-permission',
  templateUrl: './book-permission.component.html',
  styleUrls: ['./book-permission.component.scss']
})
export class BookPermissionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("confirmationModel") confirmationModel: TemplateRef<any>;
  @ViewChild("receiptModel") receiptModel: TemplateRef<any>;
  @ViewChild('orgAddress') orgAddress: any;
  @ViewChild('applicantAddress') applicantAddress: any;
  @ViewChild('fileInput') fileInput: any;

  /**
   * instance variable for bookPermission booking facility.
   */
  translateKey: string = "bookPermissionScreen";
  guideLineFlag: boolean = true;
  head_lines: string;
  endDate:any;
  isConfirmMobileNumber = false

  isFileUploaded: boolean = false;
  /**
   * Booking Constants and utils
   */
  bookingConstants = BookingConstants;
  bookingUtils: BookingUtils;

  /**
   * Flags for hide/show
   */
  showPermissionSearchForm: boolean = false;
  showPaymentReciept: boolean = false;
  showPermissionApplicationForm: boolean = false;

  /**
   * Forms declaration
   */
  bookPermissionSearchForm: FormGroup;
  bookPermissionApplicationForm: FormGroup;
  organizationdetails : FormGroup;
  bookingDetails : FormGroup;

  public formControlNameToTabIndex = new Map();
  /**
   * resources
   */
  SHOOTING_PERMISSION: Array<any> = [];
  wardZoneLevel1List=[];
  parkList : Array<any> = [];
  zoneList: Array<any> = [];
  purposeList : Array<any> = [];

  /*
   * Datepicker with max validation
   */
  maxEndDate: any;
  disablefutureDate = moment(new Date()).add(1, 'day').toISOString();

  /**
   * Local Arrays and Maps
   */
  selectedShift: Array<any> = [];
  filteredReponse: any;
  paymentObject: any;
  Dates: Array<any> = [];
  availableStots: Array<any> = []
  tabIndex: number = 0;

  /**
	 * ngx-bootstrap models.
	 */
  confirmRef: BsModalRef;
  receiptRef: BsModalRef;

  /**
   * LookUps Constants
   */
  // BANKS: Array<any> = [];
  PURPOSES: Array<any> = [];
  CANCELLATION_TYPE: Array<any> = [];
  gujHeadLines : string;
  showSelectLanguage : boolean = true;
  btnProceed : boolean = true

  constructor(private bookingService: BookingService,
    private router: Router,
    private _fb: FormBuilder, private toster: ToastrService,
    private modalService: BsModalService,
    private commonService: CommonService,
    private TranslateService: TranslateService,
    private CD: ChangeDetectorRef,
		protected formService: FormsActionsService,
		protected toaster: ToastrService,
    ) {
      this.bookingUtils = new BookingUtils(formService, toster);
    this.bookingService.resourceType = this.bookingConstants.SHOOTING_PERMISSION_PLACE;
  }

  ngOnInit() {
    /**
		 * Static headlines
		 */
    this.head_lines = `Online Permission Booking facility is the convenient and
		easy way to book the Permission of Vadodara Municpal Corporation. You can
    view the availiblity details of the bookPermission and select booking date.
    The booking is confirmed on the successfull online payment of the rent amount
    for selected date`;
    this.gujHeadLines = `ઓનલાઈન પરમિશન બુકિંગ સુવિધા એ વડોદરા મ્યુનિસિપલ કોર્પોરેશનની પરવાનગી બુક કરવાની અનુકૂળ અને સરળ રીત છે. તમે બુક પરમિશનની ઉપલબ્ધતા વિગતો જોઈ શકો છો અને બુકિંગ તારીખ પસંદ કરી શકો છો. પસંદ કરેલ તારીખ માટે ભાડાની રકમની સફળ ઓનલાઈન ચુકવણી પર બુકિંગની પુષ્ટિ થાય છે`

    this.createPermissionAvailiblityForm();
    this.createPermissionApplicationForm();
    this.getLookUpData();
    // this.getResourceList();
    this.getWardZoneFirstLevel();
    		/**
		     * Update Permanent Address If 'officeResidentialAddressSame' is checked.
		     */

		this.organizationdetails.controls.organizationAddress.valueChanges.subscribe(data => {
			if (this.organizationdetails.get('officeResidentialAddressSame').value) {
				this.onSameAddressChange({ checked: true });
				return;
			}
		});
    this.setFormControlToTabIndexMap();
  }

/**
 * This method is used to patch organization address to applicant address
 * @param event - checkbox event
 */
	onSameAddressChange(event) {
		let id = this.organizationdetails.get('applicantAddress.id').value;
		if (event.checked) {
			this.organizationdetails.get('applicantAddress').patchValue(this.organizationdetails.get('organizationAddress').value);
			if (this.organizationdetails.get('organizationAddress').get('country').value) {
				this.applicantAddress.getStateLists(this.organizationdetails.get('organizationAddress').get('country').value);
			}
		} else {
			this.organizationdetails.get('applicantAddress').reset();
		}
		this.organizationdetails.get('applicantAddress.id').setValue(id);
	}

  /**
   * Getting lookup data for Permission booking.
   */
  getLookUpData() {
    this.bookingService.getDataFromLookups().subscribe(resp => {
      // this.BANKS = resp.BANK;
      this.CANCELLATION_TYPE = resp.CANCELLATION_TYPE;
      this.PURPOSES = resp.PURPOSE;
      this.PURPOSES.forEach(element => {        
           this.purposeList.push(element) 
           this.PURPOSES = this.purposeList.sort((a, b) => {
            if(a.name > b.name) {
              return 1;
            } else if(a.name < b.name) {
              return -1;
            } else {
              return 0;
            }
          });
        
      });
    });
  }

  /**
   * This method for get resource list
   */
  getResourceList() {
    this.bookingService.getResourceList().subscribe(resp => {
      this.SHOOTING_PERMISSION = resp.data;
      // this.getAvaillableSlot(resp.data);
    })
  }

  /**
	 * Method is used to create town hall search form.
	 */
  createPermissionAvailiblityForm() {
    this.bookPermissionSearchForm = this._fb.group({
      code: [null, [Validators.required]],
      purpose: this._fb.group({
        code: [null, [Validators.required]],
        name: null
      }),
      startDate: [moment(new Date()).add(1, 'day').format('YYYY-MM-DD'), Validators.required],
      endDate: [null, Validators.required],
      waterDrainageZoneId: [null,Validators.required],

    });
    this.maxEndDate = moment(new Date()).add(moment.duration(1, 'M')).format('YYYY-MM-DD');

    let futureMonth = new Date(new Date().getFullYear()+"-12-31");
    this.maxEndDate = moment(futureMonth).format("YYYY-MM-DD");
  }

  /**
   *
   * @param date
   */
  onDateChange(date){
    let futureMonth = new Date(date.getFullYear()+"-12-31");
    this.maxEndDate = moment(futureMonth).format("YYYY-MM-DD");
  }

  /**
	 * Method is used to get available slot wise townhalls.
	 */
  searchBooking() {
    this.selectedShift = [];

    if (this.bookPermissionSearchForm.valid) {
			/**
		    * Filter Object to get list of available dates.
		    */
      let filterData = {
        resourceName: this.bookPermissionSearchForm.get('code').value,
        startDate: moment(this.bookPermissionSearchForm.get('startDate').value).format("YYYY-MM-DD"),
        endDate: moment(this.bookPermissionSearchForm.get('endDate').value).format("YYYY-MM-DD"),
      }

			/**
			 * calling api to get all available slots.
			 */
      this.bookingService.getAllSlots(filterData).subscribe(resp => {

        this.filteredReponse = resp;
        let temp = resp.data.scheduleList;
        this.Dates = temp.sort((a, b) => {
          if ((new Date(a.key).getTime()) >= (new Date(b.key).getTime())) {
            return 1
          } else {
            return -1
          }
        });
        this.availableStots = resp.data;
      });
    } else {
      this.bookingUtils.getAllErrors(this.bookPermissionSearchForm);
      this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
    }
  }


  /**
	 * Selection Parts is being started from here.
	 */
  filterMonths(): Array<any> {
    return this.bookingUtils.DateArray.filter(month => this.Dates.find(d => d.key.split('-')[1] == month.id));
  }

  /**
	 * Used to get shifts of perticular month
	 * @param id - month id
	 */
  filterAcc(id) {
    return this.Dates.filter(t => t.key.split('-')[1] == id);
  }

  /**
 * Method is used to check all date wise shifts in month.
 * @param month - perticular month object.
 */
  checkedAllinMonth(month) {
    let myArray = this.filterAcc(month.id);
    for (let i = 0; i < myArray.length; i++) {
      for (let j = 0; j < myArray[i].slotList.length; j++) {
        if (myArray[i].slotList[j].slotStatus == this.bookingConstants.AVAILABLE) {
          return true;
        }
      }
    }
    return false;
  }


  /**
	 * Method is used to select all shifts in perticular month.
	 * @param checked - checked event
	 * @param month - perticular month
	 * @param i - index
	 */
  selectAllShiftsInMonth(checked, month, i): void {
    if (checked) {
      this.filterAcc(month.id).forEach(obj => {
        this.selectedShift = this.selectedShift.concat(obj.slotList.filter(status => status.slotStatus == this.bookingConstants.AVAILABLE).map((data) => {
          data.slotStatus = 'CHECKED';
          return data;
        }))
      })
    } else {
      this.filterAcc(month.id).forEach(obj => {
        obj.slotList.forEach(nestObj => {
          let index = this.selectedShift.findIndex(myData => myData.uniqueId == nestObj.uniqueId);
          if (index > -1) {
            nestObj.slotStatus = this.bookingConstants.AVAILABLE;
            this.selectedShift.splice(index, 1)
          }
        })
      })
    }
  }

  /**
	 * Method is used to remove selected townhalls.
	 * @param shift - shift with details
	 * @param index - index
	 */
  removeSelectedShift(shift, selectedShift, index) {
    this.selectShift(shift, false , selectedShift);
  }

  createPermissionApplicationForm() {
   // step 1
    this.organizationdetails = this._fb.group({
      organizationAddress: this._fb.group(this.orgAddress.addressControls()),
      applicantAddress: this._fb.group(this.applicantAddress.addressControls()),
      emailId: [null, [Validators.required, ValidationService.emailValidator]],
      confirmEmailId: [null, [Validators.required, ValidationService.emailValidator]],
      applicantMobile: [null, [Validators.required, ValidationService. mobileNumberValidation]],
      confirmMobile: [null, [Validators.required, ValidationService. mobileNumberValidation]],
      relationshipWithOrg: [null],
      presidentName: [null],
      orgName: [null],
      orgContactNo: [null],
      applicantName: [null],
      officeResidentialAddressSame:null,
  })

   // step 2
   this.bookingDetails=this._fb.group({
    accountHolderName: [null, [Validators.required, Validators.maxLength(50)]],
    accountNo: [null, [Validators.required, Validators.maxLength(20)]],
    bankName: this._fb.group({
        code: [null, [Validators.required]],
        // name: null
    }),
    ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator, Validators.maxLength(11), Validators.minLength(11)]],

})



    // this.bookPermissionApplicationForm = this._fb.group({
    //   uniqueId: [null],
    //   version: [null],
    //   cancelledDate: [null],
    //   status: [null],
    //   refNumber: [null],
    //   resourceType: [null],
    //   resourceCode: [null],
    //   scheduleList: [],
    //   bookingPurposeMaster: this._fb.group({
    //     code: [null, [Validators.required]],
    //     name: null
    //   }),
    //   gardenPark: [null],
    //   bookingFrom: [null],
    //   bookingTo: [null],
    //   remarks: [null],
    //   organizationAddress: this._fb.group(this.orgAddress.addressControls()),
    //   applicantAddress: this._fb.group(this.applicantAddress.addressControls()),
    //   officeResidentialAddressSame:null,
    //   orgName: [null],
    //   orgContactNo: [null],
    //   confirmMobile: [null],
    //   applicantName: [null],
    //   applicantMobile: [null],
    //   emailId: [null, [Validators.required, ValidationService.emailValidator]],
    //   confirmEmailId: [null, [Validators.required, ValidationService.emailValidator]],
    //   relationshipWithOrg: [null],
    //   presidentName: [null],
    //   shootingPurpose: [null],
    //   bookingDate: [null],


  //for All Form remaining Data
      this.bookPermissionApplicationForm = this._fb.group({
        uniqueId: [null],
      version: [null],
      cancelledDate: [null],
      status: [null],
      refNumber: [null],
      resourceType: [null],
      resourceCode: [null],
      scheduleList: [],
      bookingPurposeMaster: this._fb.group({
        code: [null, [Validators.required]],
        name: null
      }),
      gardenPark: [null],
      bookingFrom: [null],
      bookingTo: [null],
      remarks: [null],
      officeResidentialAddressSame:null,
      applicantName: [null],
      applicantMobile: [null],
      relationshipWithOrg: [null],
      presidentName: [null],
      shootingPurpose: [null],
      bookingDate: [null],
      bookingFormId : null,
        attachments: [],
        });

      // accountHolderName: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      // accountNo: [null, [Validators.required, Validators.maxLength(18), Validators.minLength(9)]],
      // bankName: this._fb.group({
      //   code: [null, [Validators.required]],
      //   name: null
      // }),
      // ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],
      this.commonService.createCloneAbstractControl(this.organizationdetails,this.bookPermissionApplicationForm);
      this.commonService.createCloneAbstractControl(this.bookingDetails,this.bookPermissionApplicationForm);


  }

  /**
   * Method is used to submit shooting permission application form.
   */
  submitPermissionApplication(): void {
   // let errCount = this.bookingUtils.getAllErrors(this.bookPermissionApplicationForm);
    if (this.bookingDetails.invalid) {
     // this.handleErrorsOnSubmit(errCount);
      this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
      return;
    }

    else if (!this.bookingUtils.matcher(this.organizationdetails, 'emailId', 'confirmEmailId') || !this.bookingUtils.matcher(this.organizationdetails, 'applicantMobile', 'confirmMobile')) {
      this.commonService.openAlert("Field Error", !this.bookingUtils.matcher(this.organizationdetails, 'emailId', 'confirmEmailId') ? this.bookingConstants.EMAIL_MIS_MATCH_MESSAGE : this.bookingConstants.MOB_NO_MIS_MATCH_MESSAGE, 'warning');
      //this.handleErrorsOnSubmit(7);
      return;
    } else if (!this.isFileUploaded) {
     // this.handleErrorsOnSubmit(32);
      this.commonService.openAlert(this.bookingConstants.FEILD_ERROR_TITLE, 'Attachment Required!', 'warning')
      return;
    }
    else {
      this.bookingService.commonBookSlot(this.bookPermissionApplicationForm.value).subscribe(resp => {
        if (resp.data.status == this.bookingConstants.SUBMITTED) {
          this.commonService.commonAlert("Shooting Permission Booking", "Your Application has been submitted.", "success", "Print Acknowledgement Receipt", false, '', pA => {
              this.bookingService.printAcknowledgementReceipt(resp.data.refNumber).subscribe(acknowledgementHTML => {
                let sectionToPrint: any = document.getElementById('sectionToPrint');
                  sectionToPrint.innerHTML = acknowledgementHTML;
                  setTimeout(() => {
                      window.print();
                      this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
                  },300);
                //   setTimeout(() => {
                //     this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
                // },500);
              }, err => {
                  this.commonService.openAlert("Error", err.error[0].message, "warning")
              })
          }, rA => {
             this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
          })
      }
      }, (err) => {
         if (err.error[0].code == this.bookingConstants.INVALID_BOOKING_STATUS) {
          this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "", cb => {
            this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL])
          })
        } else {
          this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
        }
      })
      return;
    }
  }

  /**
	 * Method is used to shortlist selected townhalls.
	 */
  confirmShortlist() {

    if (this.selectedShift.length > 0) {

      let shortListData = {
        resourceCode: this.filteredReponse.data.resourceCode,
        purposeOfBooking: this.bookPermissionSearchForm.get('purpose').value,
        startDate: this.filteredReponse.data.startDate,
        endDate: this.filteredReponse.data.endDate,
        appointments: this.selectedShift.map(shifts => shifts.uniqueId)
      }

      this.bookingService.shortListBookings(shortListData).subscribe(resp => {
        this.showPermissionSearchForm = false;
        this.bookPermissionApplicationForm.patchValue(resp.data);
        this.organizationdetails.patchValue(resp.data);
        this.bookingDetails.patchValue(resp.data);
        this.orgAddress.getCountryLists();
        this.applicantAddress.getCountryLists();
        if (resp.data.status == this.bookingConstants.DRAFT) {
          this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
            this.paymentObject = payResp.data;
            this.CD.detectChanges();
            this.showPaymentReciept = true;
            this.CD.detectChanges();
            this.confirmRef.hide();
            this.receiptRef = this.modalService.show(this.receiptModel, Object.assign({ ignoreBackdropClick: true }, { class: 'gray .modal-md' }));
          })
        }
      }, (err) => {
        this.commonService.openAlert("Error", err.error[0].message, "warning");
      });
    } else {
      this.toster.show(this.bookingConstants.SELECT_SHIFT_MESSAGE);
    }
  }

  /**
	 * Method is used to select available shift.
	 * @param shift - shift object.
	 * @param checked - checked event
	 */
  selectShift(shift, checked ,selectedShift) {

    if (checked) {
      let data = this.selectedShift.find(uniqueId => uniqueId == shift.uniqueId)
      if (!data) {
        shift.slotStatus = this.bookingConstants.CHECKED;
        this.selectedShift.push(shift);
      }
    } else {
      let data = this.selectedShift.findIndex(uniqueId => uniqueId.uniqueId == shift.uniqueId);
      if (data > -1) {
        shift.slotStatus = this.bookingConstants.AVAILABLE;
        this.selectedShift.splice(data, 1);
      }
    }
    return selectedShift;
  }

  /**
	 * Method is used to shortlist all selected dates.
	 */
  shortlistShifts(confirmationModel: TemplateRef<any>) {
    this.selectedShift.sort((a, b) => {
      if ((new Date(a.start).getTime()) >= (new Date(b.start).getTime())) {
        return 1;
      } else {
        return -1;
      }
    });
    this.confirmRef = this.modalService.show(confirmationModel, Object.assign({ ignoreBackdropClick: true }, { class: 'gray .modal-md' }));
  }

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
  onTabChange(evt) {
    this.tabIndex = evt;
  }


	/**
	 * Method is used to handle error/validation on submit
	 * @param controlName - count of invalid control.
	 */
  handleErrorsOnSubmit(controlName) {
		// /**
		//  * No Of controls on perticular tab
		//  */
    // let step1 = 26;
    // let step2 = 31;

		// /**
		//  * Redirection
		//  */
    // if (count < step1) {
    //   this.tabIndex = 0;
    //   return false;
    // } else if (count < step2) {
    //   this.tabIndex = 1;
    //   return false;
    // }
    const key = this.bookingUtils.getInvalidFormControlKey(controlName);
		const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 0;

		this.tabIndex = index;
		return false;
  }
  setFormControlToTabIndexMap(){
    // // index 0
		// this.formControlNameToTabIndex.set("organizationName", 0);
		// this.formControlNameToTabIndex.set("orgTelephoneNo", 0);
		// this.formControlNameToTabIndex.set("organizationAddress", 0);
		// this.formControlNameToTabIndex.set("program_purpose", 0);

		// // index 1
		// this.formControlNameToTabIndex.set("applicantName", 1);
		// this.formControlNameToTabIndex.set("applicantMobile", 1);
		// this.formControlNameToTabIndex.set("emailId", 1);
		// this.formControlNameToTabIndex.set("panCard", 1);
		// this.formControlNameToTabIndex.set("gstNo", 1);
		// this.formControlNameToTabIndex.set("relationshipWithOrg", 1);


		// index 2
		this.formControlNameToTabIndex.set('bankName', 1)
		this.formControlNameToTabIndex.set('accountHolderName', 1)
		this.formControlNameToTabIndex.set('accountNo', 1)
		this.formControlNameToTabIndex.set('ifscCode', 1)
        this.formControlNameToTabIndex.set('agree', 1)
        this.formControlNameToTabIndex.set('termsCondition', 1)

  }

  getWardZoneFirstLevel() {
		this.bookingService.getZoneListForShooting().subscribe(
			(data) => {
        if (data) {
					this.wardZoneLevel1List = data.data;
          this.wardZoneLevel1List.forEach(element => {
               this.zoneList.push(element) 
               this.wardZoneLevel1List = this.zoneList.sort((a, b) => {
                if(a.zoneName > b.zoneName) {
                  return 1;
                } else if(a.zoneName < b.zoneName) {
                  return -1;
                } else {
                  return 0;
                }
              });
          });          
        }
			},
			(error) => {
				console.log('error', error);
			})
	}

  onChangedWardZone(event){
    if (event != undefined) {
      if(event){
        this.Dates = []
      }
      this.bookingService.getGardenList(event).subscribe(resp => {
        this.SHOOTING_PERMISSION = resp.data;
       this.SHOOTING_PERMISSION .forEach(element => {
           this.parkList.push(element) 
           this.SHOOTING_PERMISSION = this.parkList.sort((a, b) => {
            if(a.name > b.name) {
              return 1;
            } else if(a.name < b.name) {
              return -1;
            } else {
              return 0;
            }
          });
        
      });
      })
    }
    else {
      this.Dates = []
    }
  }

  getAvaillableSlot(data){
    this.bookingService.getAvailableStots(data).subscribe(respData => {
      this.endDate = moment(respData.data.endDate, "DD-MM-YYYY").toDate();
    })
  }

  maxDateForSlot(event){
    if (event != undefined) {
      this.getAvaillableSlot(event)
    }
    else {
      this.Dates = []
    }
  }

  onConfirmMobileNumber(event){
    if(event.target.value != '' )
    this.isConfirmMobileNumber = true

  }
  checkValidation(controlName,isSubmitted){
		if(controlName.invalid){
			this.handleErrorsOnSubmit(controlName)
		}else{
			const organizationalAry = Object.keys(controlName.value);
			organizationalAry.forEach(element => {
				this.bookPermissionApplicationForm.get(element).setValue(controlName.get(element).value);
			});
			this.commonService.setValueToFromControl(controlName,this.bookPermissionApplicationForm);
			this.tabIndex= this.tabIndex +1;
			if(isSubmitted){
				this.submitPermissionApplication();
			}
		}
    }

     /**
       * Get user data
       */
     getUserProfile() {
      this.bookingService.getUserProfile().subscribe(resp => {
          this.organizationdetails.get('applicantName').setValue(resp.data.firstName + ' ' + resp.data.lastName);
          this.organizationdetails.get('applicantMobile').setValue(resp.data.cellNo);
          this.organizationdetails.get('confirmMobile').setValue(resp.data.cellNo);
          this.organizationdetails.get('emailId').setValue(resp.data.email);
          this.organizationdetails.get('confirmEmailId').setValue(resp.data.email);
        },
        err => {
          this.toster.error("Server Error");
        });
      this.organizationdetails.get('applicantAddress').get('country').setValue('INDIA');
      this.organizationdetails.get('applicantAddress').get('state').setValue('GUJARAT');
      this.organizationdetails.get('applicantAddress').get('city').setValue('Vadodara');
    }

    clickProcess(event){
      if(event.checked == true){
              this.btnProceed = false;
              this.organizationdetails.get('termsCondition').setValue(true)
        }else{
            this.btnProceed = true;
              this.organizationdetails.get('termsCondition').setValue(false)
        }
      }

      selectLanguage(event) {
        this.btnProceed = true;
        if (event == 'gu') {
          this.showSelectLanguage = true;
        }
        else {
          this.showSelectLanguage = false
        }
    
      }
}
