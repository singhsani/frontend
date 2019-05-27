import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TicketingsService } from '../../../shared-ticketing/services/ticketings.service';
import { TicketingConstants, TicketingUtils } from '../../../config/ticketing-config';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-planetarium',
  templateUrl: './book-planetarium.component.html',
  styleUrls: ['./book-planetarium.component.scss']
})
export class BookPlanetariumComponent implements OnInit {

  translateKey: string = 'planetariumScreen';

  ticketBookingForm: FormGroup;
  subTotal: number;
  totalAmount: number;
  numberOfVisitors: number;

  minDate = moment(new Date()).add(1, 'day').toISOString();

  // Loading Ticketing Configurations
  ticketingConstants = TicketingConstants;
  ticketingUtils: TicketingUtils = new TicketingUtils();
  planetariumVisitingRates: any;
  /**
   * Lookups & Data
   */
  BANKS: Array<any> = [];
  idTypes: Array<any> = [];
  CANCELLATION_TYPE: Array<any> = [];
  PLANETARIUM_SHOWS_TIMING: Array<any> = [];
  PLANETARIUM_SHOW_CATEGORY: Array<any> = [];
  PLANETARIUM_VISITOR: Array<any> = [];
  PURPOSE: Array<any> = [];
  resourceName: Array<any> = [];

  /**
   * @param fb - Declare FormBuilder property.
   * @param ticketingService - Declare Ticketing Service
   * @param commonService - Declare sweet alert.
   * @param router - Declare Routing Property.
  */
  constructor(
    private _fb: FormBuilder,
    private ticketingService: TicketingsService,
    private commonService: CommonService,
    private router: Router
  ) {

    this.ticketingService.resourceType = 'planetarium';
  }

  ngOnInit() {
    this.createTicketBookingForm();
    this.getLookUps();
    this.getFormData();
    this.getZooVisitingRates();
  }
  /**
	* Get all booking category list from api.
	*/
  getLookUps() {
    this.ticketingService.getDataFromLookups().subscribe((respData) => {
      this.BANKS = respData.BANK;
      this.idTypes = respData.IDTYPE;
      this.CANCELLATION_TYPE = respData.CANCELLATION_TYPE;
      this.PLANETARIUM_SHOWS_TIMING = respData.PLANETARIUM_SHOWS_TIMING;
      this.PLANETARIUM_SHOW_CATEGORY = respData.PLANETARIUM_SHOW_CATEGORY;
      this.PLANETARIUM_VISITOR = respData.PLANETARIUM_VISITOR;
      this.PURPOSE = respData.PURPOSE;

    });
  }

  /**
   * get form data
   */
  getFormData() {
    this.ticketingService.getFormData().subscribe(res => {
      this.resourceName = res.data;
    });
    // this.ticketingService.getFormData();
  }
  /** 
   * Change Date format
   */
  changeDateFormat(e) {
    this.ticketBookingForm.get('visitingDate').setValue(moment(e.value).format('YYYY-MM-DD'));
  }

  /**
   * set visitors as per lookup selection
   */
  setVisitors(){
    let visitors = Number(this.ticketBookingForm.get('visitors').get('code').value);
    this.ticketBookingForm.get('visitorNo').setValue(visitors);
  }

  /**
    * Get PLANETARIUM Visiting Rates from api.
   */
  getZooVisitingRates() {
    this.ticketingService.getZooVisitingRates().subscribe((respData) => {
      this.planetariumVisitingRates = respData.data;
      this.ticketBookingForm.get('rate').setValue(this.planetariumVisitingRates.visitorCharge)
    });
  }

  /**
   * Create form controls.
   */
  createTicketBookingForm() {
    this.ticketBookingForm = this._fb.group({
      id: [null],
      uniqueId: [null],
      version: [null],
      cancelledDate: [null],
      bookingDate: [moment(new Date()).format('YYYY-MM-DD')],
      status: [null],
      refNumber: [null],
      resourceType: [null],
      payableServiceType: [null],
      resourceCode: [null],
      resourceCodeLK: this._fb.group({
        name: [null],
        code: [null, [Validators.required]]
      }),
      visitingDate: [null, [Validators.required]],
      showCategory: this._fb.group({
        name: [null, [Validators.required]],
        code: [null, [Validators.required]]
      }),
      planetariumShowTiming: this._fb.group({
        name: [null, [Validators.required]],
        code: [null, [Validators.required]]
      }),
      seats: [null, [Validators.required, Validators.max(4), Validators.min(1)]],
      visitorNo: [null],
      visitors: this._fb.group({
        name: [null, [Validators.required]],
        code: [null, [Validators.required]]
      }),
      rate: [null],
      amount: [null],
      idType: this._fb.group({
        name: [null, [Validators.required]],
        code: [null, [Validators.required]]
      }),
      idNumber: [null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      applicantName: [null],
      applicantMobile: [null],
      paymentMode: this._fb.group({
        name: [null, [Validators.required]],
        code: [null, [Validators.required]]
      }),

      firstName: [null, [Validators.required]],
      middleName: [null],
      lastName: [null, [Validators.required]],

      accountHolderName: null,
      accountNo: null,
      bankName: null,
      ifscCode: null,
      attachments: [],

      scheduleList: null,
      bookingPurposeMaster: this._fb.group({
        name: [null],
        code: [null]
      }),
      termsCondition: [null],
      agree: [null]
    })
  }

  confirmBooking() {
    console.log(this.ticketBookingForm.value);
  }

  // Will Compute total amount based on the user input
  computeTotalAndVisitors() {
    const f = this.ticketBookingForm.value;

    this.totalAmount = Number(f.visitorNo) * (Number(f.rate));

    this.ticketBookingForm.get('amount').setValue(this.totalAmount);
  }

  /**
   * redirect to Payment 
   */
  redirecToPayment() {
    
    this.ticketingService.bookPlanetariumTickets(this.ticketBookingForm.value, this.ticketBookingForm.get('resourceCodeLK').get('code').value).subscribe(res => {
      if (!this.ticketBookingForm.get('agree').value) {
        this.commonService.openAlert('Feild Error', this.ticketingConstants.AGREE_MESSAGE, 'warning');
        return;
      } else if (!this.ticketBookingForm.get('termsCondition').value) {
        this.commonService.openAlert('Feild Error', this.ticketingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning');
        return;
      }
    },
      err => {
        if (err.status === 402) {

          this.ticketBookingForm.get('refNumber').setValue(err.error.data.refNumber);
          // this.ticketingService.getTotalAmount(err.error.data.refNumber).subscribe(data => {
          // console.log(data);
          // this.ticketBookingForm.get('totalAmount').setValue(err.error.data.TOTAL);
          this.ticketingUtils.redirectToPayment(err, this.commonService, this.ticketingService, this.ticketBookingForm, this.router);
          // return;
          // });
        }
      });
  }

  resetForm() {
    this.ticketBookingForm.reset();
  }

}
