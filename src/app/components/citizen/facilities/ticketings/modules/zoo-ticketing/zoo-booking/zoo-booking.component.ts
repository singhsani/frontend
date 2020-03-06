import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { TicketingsService } from '../../../shared-ticketing/services/ticketings.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { TicketingConstants, TicketingUtils } from '../../../config/ticketing-config';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { TranslatePipe } from 'src/app/shared/modules/translate/translate.pipe';
import { ToastrService } from 'ngx-toastr';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';

@Component({
  selector: 'app-zoo-booking',
  templateUrl: './zoo-booking.component.html',
  styleUrls: ['./zoo-booking.component.scss'],
  providers: [TranslatePipe]
})
export class ZooBookingComponent implements OnInit {

  @ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;
  // Loading Ticketing Configurations
  ticketingConstants = TicketingConstants;
  ticketingUtils: TicketingUtils;
  isVisibleIdNumber = false;
  isPanCardVisibleIdNumber = false;
  /**
   * language translate key.
  */
  translateKey = 'citizenZooTicketingScreen';
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
      description: this.pipe.transform("children_below_12_years_of_age", this.translateKey),
      priceField: 'CHILD'
    },
    {
      categoryName: 'Adults',
      description: this.pipe.transform("adults", this.translateKey),
      priceField: 'ADULT'
    },
    {
      categoryName: 'Camera',
      description: this.pipe.transform("camera_fees", this.translateKey),
      priceField: 'CAMERA'
    },
    {
      categoryName: 'Video Camera',
      description: this.pipe.transform("video_camera_fees", this.translateKey),
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


  // Ticket Details

  ticketBookingForm: FormGroup;
  subTotal: number = 0;
  totalAmount: number = 0;
  numberOfVisitors: number = 0;

  // Ticket Booking Table Row Data:

  ticketBookingRows: any[] = [
    {
      name: this.pipe.transform("children_below_12_years_of_age", this.translateKey),
      formGroupName: 'children',
      formControlName: 'totalChild',
      placeHolder: this.pipe.transform("number_of_children", this.translateKey),
      max: 3,
      priceField: 'CHILD'
    },
    {
      name: this.pipe.transform("adults", this.translateKey),
      formGroupName: 'adults',
      formControlName: 'totalAdult',
      placeHolder: this.pipe.transform("number_of_adults", this.translateKey),
      max: 3,
      priceField: 'ADULT'
    },
    {
      name: this.pipe.transform("camera", this.translateKey),
      formGroupName: 'camera',
      formControlName: 'totalCamera',
      placeHolder: this.pipe.transform("number_of_camera", this.translateKey),
      max: 3,
      priceField: 'CAMERA'
    },
    {
      name: this.pipe.transform("video_camera", this.translateKey),
      formGroupName: 'videoCamera',
      formControlName: 'totalVideoCamera',
      placeHolder: this.pipe.transform("number_of_video_camera", this.translateKey),
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
    private router: Router,
    public pipe: TranslatePipe,
    private toster: ToastrService,
    protected formService: FormsActionsService
  ) {
    this.ticketingUtils = new TicketingUtils(formService,toster);
    this.ticketingService.resourceType = 'zoo';
  }

  ngOnInit() {

    // Initialise ticket pricing and timing tables
    this.dataSourceForPricing.data = this.pricing;
    this.dataSourceForTiming.data = this.timing;
    this.isVisibleIdNumber = false;
    this.isPanCardVisibleIdNumber = false;

    this.ticketBookingFormControls();
    this.getLookUps();
    this.getZooVisitingRates();
    //this.profileData();
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
    this.ticketingService.getZooVisitingRates().subscribe((respRates) => {
      this.zooVisitingRates = respRates.data;
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
      idNumber: [null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      visitingDate: [moment().format('YYYY-MM-DD'), Validators.required],
      totalChild: [0, Validators.max(100)],
      totalAdult: [0, Validators.max(100)],
      totalCamera: [0, Validators.max(100)],
      totalVideoCamera: [0, Validators.max(100)],
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
  /**
   * Show applicant data(login user)
   */
  profileData() {
    this.ticketingService.getUserProfile().subscribe(res => {
      this.ticketBookingForm.get('applicantName').setValue(res.data.firstName + ' ' + res.data.lastName);
      this.ticketBookingForm.get('applicantMobile').setValue(res.data.cellNo);

    },
      err => {
        this.toster.error("Server Error");
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
          // this.ticketingUtils.redirectToPayment(err, this.commonService, this.ticketingService, this.ticketBookingForm, this.router);
             this.ticketingUtils.redirectToCCAvenuePayment(err, this.commonService, this.ticketingService, this.paymentGateway ,this.ticketBookingForm, this.router);
         
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

  CheckType(idCode){
    this.isVisibleIdNumber = false;
    this.isPanCardVisibleIdNumber = false;
    if(idCode === 'AADHARCARD'){
      this.isVisibleIdNumber = true;
      this.isPanCardVisibleIdNumber = false;
      this.ticketBookingForm.controls['idNumber'].setValue('');
      this.ticketBookingForm.controls['idNumber'].setValidators([Validators.required]);
      this.ticketBookingForm.controls['idNumber'].updateValueAndValidity();
    }else if(idCode === 'PANCARD'){
      this.isPanCardVisibleIdNumber = true;
      this.isVisibleIdNumber = false;
      this.ticketBookingForm.controls['idNumber'].setValidators([Validators.required, ValidationService.panValidatorforlastfour]);
      this.ticketBookingForm.controls['idNumber'].updateValueAndValidity();
    }else if(idCode === 'VOTINGCARD' || idCode === 'PASSPORT'){
      this.isVisibleIdNumber = false;
      this.isPanCardVisibleIdNumber = false;
      this.ticketBookingForm.controls['idNumber'].setValue('');
      this.ticketBookingForm.controls['idNumber'].setValidators([Validators.required]);
      this.ticketBookingForm.controls['idNumber'].updateValueAndValidity();
    }

  }

}
