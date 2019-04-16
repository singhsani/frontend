import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { TicketingsService } from '../../../shared-ticketing/services/ticketings.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { TicketingConstants, TicketingUtils } from '../../../config/ticketing-config';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zoo-booking',
  templateUrl: './zoo-booking.component.html',
  styleUrls: ['./zoo-booking.component.scss']
})
export class ZooBookingComponent implements OnInit {

  // Loading Ticketing Configurations
  ticketingConstants = TicketingConstants;
  ticketingUtils: TicketingUtils = new TicketingUtils();

  /**
	  * displayColumns are used for display the columns in material table.
	*/
  displayedColumnsForPricingTable: string[] = [
    'id',
    'description',
    'price'
  ];

  displayedColumnsForTimingTable: string[] = [
    'id',
    'months',
    'slot'
  ];

  /**
    * Flags
  */
  guideLineFlag = true;
  showTicketsBookingForm = false;
  bankDetailsFlag = false;

  /**
    * Pricing data for ticket bookings for visiting zoo
   */
  pricing: any[] = [
    {
      categoryName: 'Children',
      description: 'Children below 12 years of Age',
      priceField: 'CHILD'
    },
    {
      categoryName: 'Adults',
      description: 'Adults',
      priceField: 'ADULT'
    },
    {
      categoryName: 'Camera',
      description: 'Camera Fees',
      priceField: 'CAMERA'
    },
    {
      categoryName: 'Video Camera',
      description: 'Video Camera Fees',
      priceField: 'VIDEOCAMERA'
    }
  ];

  zooVisitingRates: any;

  /**
    * Timing data for ticket bookings for visiting zoo
  */
  timing: any[] = [
    {
      'months': 'July to March',
      'slot': '9:00 AM To 6:00 PM'
    },
    {
      'months': 'April to June',
      'slot': '9:00 AM To 6:30 PM'
    }
  ];


  /**
   * Used for material table data population and pagination.
  */
  dataSourceForPricing = new MatTableDataSource();
  dataSourceForTiming = new MatTableDataSource();

  /**
   * language translate key.
  */
  translateKey = 'citizenZooTicketingScreen';

  // Ticket Details

  ticketBookingForm: FormGroup;
  subTotal: number;
  totalAmount: number;
  numberOfVisitors: number;

  // Ticket Booking Table Row Data:

  ticketBookingRows: any[] = [
    {
      name: 'Children',
      formGroupName: 'children',
      formControlName: 'totalChild',
      placeHolder: 'Number Of Children',
      max: 4,
      priceField: 'CHILD'
    },
    {
      name: 'Adults',
      formGroupName: 'adults',
      formControlName: 'totalAdult',
      placeHolder: 'Number Of Adults',
      max: 4,
      priceField: 'ADULT'
    },
    {
      name: 'Camera',
      formGroupName: 'camera',
      formControlName: 'totalCamera',
      placeHolder: 'Number Of Camera',
      max: 3,
      priceField: 'CAMERA'
    },
    {
      name: 'Video Camera',
      formGroupName: 'videoCamera',
      formControlName: 'totalVideoCamera',
      placeHolder: 'Number Of Video Camera',
      max: 3,
      priceField: 'VIDEOCAMERA'
    }
  ];

  // Bank Details
  bankDetailsForm: FormGroup;

  /**
	 * LookUps & Arrays.
	*/

  BANKS: Array<any> = [];

  /**
	 * Minimum start date.
	*/
  startMinDate = moment(new Date()).toISOString();

  // Contact Details

  idTypes: any[];


  /**
   * @param fb - Declare FormBuilder property.
   * @param ticketingService - Declare Ticketing Service
   * @param commonService - Declare sweet alert.
   * @param router - Declare Routing Property.
  */

  constructor(
    private fb: FormBuilder,
    private ticketingService: TicketingsService,
    private commonService: CommonService,
    private router: Router
  ) {

    this.ticketingService.resourceType = 'zoo';
  }

  ngOnInit() {

    // Initialise ticket pricing and timing tables
    this.dataSourceForPricing.data = this.pricing;
    this.dataSourceForTiming.data = this.timing;

    this.ticketBookingFormControls();
    this.getLookUps();
    this.getZooVisitingRates();
  }

  /**
	  * Get all booking category list from api.
	*/
  getLookUps() {
    this.ticketingService.getDataFromLookups().subscribe((respData) => {
      this.BANKS = respData.BANK;
      this.idTypes = respData.IDTYPE;
    });
  }

  /**
	  * Get Zoo Visiting Rates from api.
	*/
  getZooVisitingRates() {
    this.ticketingService.getZooVisitingRates().subscribe((respData) => {
      console.log(respData);
      this.zooVisitingRates = respData.data;
    });
  }

  changeDateFormat(e) {
    this.ticketBookingForm.get('visitingDate').setValue(moment(e.value).format('YYYY-MM-DD'));
  }


  ticketBookingFormControls() {
    // Currently the form is filled temporarily with some dummy data
    this.ticketBookingForm = this.fb.group({
      id: null,
      uniqueId: null,
      version: null,
      cancelledDate: null,
      status: null,
      refNumber: null,
      resourceType: null,
      payableServiceType: null,
      resourceCode: 'SARDARBAUGHZOO',
      scheduleList: null,
      attachments: null,
      bookingDate: null,
      amount: null,
      personSubTotal: null,
      totalAmount: null,
      paymentMode: null,
      totalPayableAmount: null,
      applicantName: ['', Validators.required],
      applicantMobile: ['', Validators.required],
      idType: this.fb.group({
        code: [null, Validators.required]
      }),
      idNumber: ['', Validators.required],
      visitingDate: [moment().format('YYYY-MM-DD'), Validators.required],
      totalChild: [],
      totalAdult: [],
      totalCamera: [],
      totalVideoCamera: [],
      bankName: this.fb.group({
        code: [null],
      }),
      accountHolderName: [null],
      accountNo: [null],
      ifscCode: [null],
      termsCondition: [true],
      agree: [true],
    });

  }

  // Will Compute total amount based on the user input
  computeTotalAndVisitors() {
    const f = this.ticketBookingForm.value;
    this.numberOfVisitors = Number(f.totalChild) + Number(f.totalAdult);
    this.totalAmount = (Number(f.totalChild) * 5) + (Number(f.totalAdult) * 20) + (Number(f.totalCamera) * 50) + (Number(f.totalVideoCamera) * 100);

    this.ticketBookingForm.get('amount').setValue(this.totalAmount);
    this.ticketBookingForm.get('totalAmount').setValue(this.totalAmount);
    this.ticketBookingForm.get('personSubTotal').setValue(this.numberOfVisitors);

  }

  redirecToPayment() {
    this.ticketingService.bookZooTickets(this.ticketBookingForm.value).subscribe(res => {
      console.log(res);
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
    this.numberOfVisitors = 0;
    this.subTotal = 0;
    this.totalAmount = 0;
  }

}
