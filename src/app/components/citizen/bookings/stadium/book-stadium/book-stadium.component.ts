import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { BookingConstants, BookingUtils } from '../../config.enum';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CommonService } from '../../../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

export interface BookingDetails {
  administrationCharges: string
  bookingDate: string
  electricCharges: any
  endTime: string
  gstAmount: any
  id: number
  rent: number
  shiftType: string
  showTax: number
  startTime: string
  subTotal: number
  total: string
  uniqueId: number
  version: number
}

@Component({
  selector: 'app-book-stadium',
  templateUrl: './book-stadium.component.html',
  styleUrls: ['./book-stadium.component.scss']
})
export class BookStadiumComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("confirmationModel") confirmationModel: TemplateRef<any>;
  @ViewChild("receiptModel") receiptModel: TemplateRef<any>;
  @ViewChild('address') addressComp: any;


  /**
   * instance variable for stadium booking facility.
   */


  translateKey: string = "stadiumScreen";
  guideLineFlag: boolean = true;
  head_lines: string;

  /**
   * Booking Constants and utils
   */

  bookingConstants = BookingConstants;
  bookingUtils: BookingUtils = new BookingUtils();

  /**
   * Flags for hide/show
   */
  showStadiumSearchForm: boolean = false;
  showPaymentReciept: boolean = false;
  showStadiumApplicationForm: boolean = false;

  /**
   * Forms declaration
   */
  stadiumSearchForm: FormGroup;
  stadiumApplicationForm: FormGroup;

  /**
   * resources
   */
  STADIUMS: Array<any> = [];

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
  BANKS: Array<any> = [];
  PURPOSES: Array<any> = [];
  CANCELLATION_TYPE: Array<any> = [];

  displayedColumns: Array<string> = ['id', 'shiftType', 'bookingDate', 'startTime', 'endTime', 'rent', 'electricCharges', 'administrationCharges', 'showTax', 'subTotal', 'gstAmount', 'total'];

  bookingDetailsDataSource = new MatTableDataSource<BookingDetails>([]);


  constructor(private bookingService: BookingService,
    private router: Router,
    private _fb: FormBuilder, private toster: ToastrService,
    private modalService: BsModalService,
    private commonService: CommonService,
    private CD: ChangeDetectorRef) {
    this.bookingService.resourceType = this.bookingConstants.STADIUM_RESOURCE_TYPE;
  }

  ngOnInit() {
    /**
		 * Static headlines
		 */
    this.head_lines = `Online Stadium Booking facility is the convenient and
		easy way to book the Stadium of Vadodara Municpal Corporation. You can
    view the availiblity details of the stadium and select booking date.
    The booking is confirmed on the successfull online payment of the rent amount
    for selected date`;

    this.createStadiumAvailiblityForm();
    this.createStadiumApplicationForm();
    this.getLookUpData();
    this.getResourceList();
  }

  /**
   * Getting lookup data for Stadium booking.
   */
  getLookUpData() {
    this.bookingService.getDataFromLookups().subscribe(resp => {
      console.log(resp);
      this.BANKS = resp.BANK;
      this.CANCELLATION_TYPE = resp.CANCELLATION_TYPE;
      this.PURPOSES = resp.PURPOSE;
    });
  }

  /**
   * 
   */
  getResourceList() {
    this.bookingService.getResourceList().subscribe(resp => {
      console.log(resp);
      this.STADIUMS = resp.data;
    })
  }

  /**
	 * Method is used to create town hall search form.
	 */
  createStadiumAvailiblityForm() {
    this.stadiumSearchForm = this._fb.group({
      code: [null, [Validators.required]],
      purpose: this._fb.group({
        code: [null, [Validators.required]],
        name: null
      }),
      startDate: [moment(new Date()).add(1, 'day').toISOString(), Validators.required],
      endDate: [moment(new Date()).add(1, 'day').toISOString(), Validators.required]
    });
  }

  /**
	 * Method is used to get available slot wise townhalls.
	 */
  searchBooking() {
    this.selectedShift = [];

    if (this.stadiumSearchForm.valid) {
			/**
		    * Filter Object to get list of available dates.
		    */
      let filterData = {
        resourceName: this.stadiumSearchForm.get('code').value,
        startDate: moment(this.stadiumSearchForm.get('startDate').value).format("YYYY-MM-DD"),
        endDate: moment(this.stadiumSearchForm.get('endDate').value).format("YYYY-MM-DD"),
      }

			/**
			 * calling api to get all available slots.
			 */
      this.bookingService.getAllSlots(filterData).subscribe(resp => {
        //console.log(resp);
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
      this.bookingUtils.getAllErrors(this.stadiumSearchForm);
      this.commonService.openAlert("Feild Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
    }
  }

  /**
	 * Selection Parts is being started from  here.
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
  removeSelectedShift(shift, index) {
    this.selectShift(shift, false);
  }

  createStadiumApplicationForm() {
    this.stadiumApplicationForm = this._fb.group({
      accountHolderName: null,
      accountNo: null,
      applicantAddress: this._fb.group(this.addressComp.addressControls()),
      applicantMobile: null,
      confirmMobile: null,
      applicantName: null,
      attachment: null,
      bankName: this._fb.group({
        code: [null, [Validators.required]],
        name: null
      }),
      bookingDate: null,
      bookingFrom: null,
      bookingPurposeMaster: this._fb.group({
        code: [null, [Validators.required]],
        name: null
      }),
      bookingTo: null,
      cancelledDate: null,
      concessionPercentage: 0,
      concessionRequired: false,
      emailId: null,
      confirmEmailId: null,
      id: 3,
      ifscCode: null,
      refNumber: null,
      resourceCode: null,
      resourceType: null,
      scheduleList: [],
      status: null,
      uniqueId: null,
      version: 0
    });
  }

  submitStadiumApplication(): void {
    let errCount = this.bookingUtils.getAllErrors(this.stadiumApplicationForm);
    if (this.stadiumApplicationForm.invalid) {
      this.handleErrorsOnSubmit(errCount);
      this.commonService.openAlert("Feild Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
      return;
    }
    else if (!this.emailMatcher() || !this.mobileNumberMatcher()) {
      this.handleErrorsOnSubmit(7);
      this.commonService.openAlert("Feild Error", !this.emailMatcher() ? this.bookingConstants.EMAIL_MIS_MATCH_MESSAGE : this.bookingConstants.MOB_NO_MIS_MATCH_MESSAGE, 'warning')
      return;
    } else {
      this.bookingService.commonBookSlot(this.stadiumApplicationForm.value).subscribe(resp => {
        if (resp.data.status == this.bookingConstants.SUBMITTED) {
          this.commonService.commonAlert("Stadium Booking", "Stadium Booked Successfully", "success", "Print Acknowledgement Receipt", false, '', pA => {
            this.bookingService.printAcknowledgementReceipt(resp.data.refNumber).subscribe(acknowledgementHTML => {
              let sectionToPrint: any = document.getElementById('sectionToPrint');
              sectionToPrint.innerHTML = acknowledgementHTML;
              setTimeout(() => {
                window.print();
                this.router.navigate(['citizen/booking/cancel-booking']);
              });
            }, err => {
              this.commonService.openAlert("Error", err.error[0].message, "warning")
            })
          }, rA => {
            this.router.navigate(['citizen/booking/cancel-booking']);
          })
        }
      }, (err) => {
        this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
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
        purposeOfBooking: this.stadiumSearchForm.get('purpose').value,
        startDate: this.filteredReponse.data.startDate,
        endDate: this.filteredReponse.data.endDate,
        appointments: this.selectedShift.map(shifts => shifts.uniqueId)
      }

      this.bookingService.shortListBookings(shortListData).subscribe(resp => {
        this.showStadiumSearchForm = false;
        this.stadiumApplicationForm.patchValue(resp.data);
        if (resp.data.status == this.bookingConstants.DRAFT) {
          this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
            this.paymentObject = payResp.data;
            this.CD.detectChanges();
            this.showPaymentReciept = true;
            this.CD.detectChanges();
            this.confirmRef.hide();
            this.receiptRef = this.modalService.show(this.receiptModel, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-lg customWidth' }));
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
  selectShift(shift, checked) {

    if (checked) {
      let data = this.selectedShift.find(uniqueId => uniqueId == shift.uniqueId)
      if (!data) {
        shift.slotStatus = 'CHECKED';
        this.selectedShift.push(shift);
      }
    } else {
      let data = this.selectedShift.findIndex(uniqueId => uniqueId.uniqueId == shift.uniqueId);
      if (data > -1) {
        shift.slotStatus = this.bookingConstants.AVAILABLE;
        this.selectedShift.splice(data, 1);
      }
    }
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
    this.confirmRef = this.modalService.show(confirmationModel, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-lg customWidth' }));
  }

  /**
	 * Method is used to match number and comfirm number.
	 */
  mobileNumberMatcher(): boolean {
    if (this.stadiumApplicationForm.get('applicantMobile').value && this.stadiumApplicationForm.get('confirmMobile').value) {
      return this.stadiumApplicationForm.get('applicantMobile').value.toString() == this.stadiumApplicationForm.get('confirmMobile').value.toString();
    }
    return false
  }

	/**
	 * Method is used to match email and confirm email.
	 */
  emailMatcher(): boolean {
    if (this.stadiumApplicationForm.get('emailId').value && this.stadiumApplicationForm.get('confirmEmailId').value) {
      return this.stadiumApplicationForm.get('emailId').value.toString() == this.stadiumApplicationForm.get('confirmEmailId').value.toString()
    }
    return false
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
	 * @param count - count of invalid control.
	 */
  handleErrorsOnSubmit(count) {
		/**
		 * No Of controls on perticular tab
		 */
    let step1 = 4;
    let step2 = 11;
    let step3 = 17;

		/**
		 * Redirection
		 */
    if (count < step1) {
      this.tabIndex = 0;
      return false;
    } else if (count < step2) {
      this.tabIndex = 1;
      return false;
    } else if (count < step3) {
      this.tabIndex = 2;
      return false;
    }
  }



}
