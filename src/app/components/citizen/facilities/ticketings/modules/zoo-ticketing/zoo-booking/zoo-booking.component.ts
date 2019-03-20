import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { TicketingsService } from '../../../shared-ticketing/services/ticketings.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { TicketingConstants } from '../../../config/ticketing-config';
import * as moment from 'moment';

@Component({
  selector: 'app-zoo-booking',
  templateUrl: './zoo-booking.component.html',
  styleUrls: ['./zoo-booking.component.scss']
})
export class ZooBookingComponent implements OnInit {

  // Loading Ticketing Configurations

  ticketingConstants = TicketingConstants;

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
  guideLineFlag: boolean = true;
  showTicketsBookingForm: boolean = false;
  bankDetailsFlag: boolean = false;

  /**
    * Pricing data for ticket bookings for visiting zoo
   */
  pricing: any[] = [
    {
      categoryName: 'Children',
      description: 'Ticket(Children below 12 years of Age)',
      price: 5
    },
    {
      categoryName: 'Adults',
      description: 'Ticket(Adults)',
      price: 20
    },
    {
      categoryName: 'Camera',
      description: 'Camera Fees',
      price: 50
    },
    {
      categoryName: 'Video Camera',
      description: 'Video Camera Fees',
      price: 100
    }
  ];

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
  ]


  /**
   * Used for material table data population and pagination.
  */
  dataSourceForPricing = new MatTableDataSource();
  dataSourceForTiming = new MatTableDataSource();

  /**
   * language translate key.
  */
  translateKey: string = 'zooBooking';

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
      rate: 5
    },
    {
      name: 'Adults',
      formGroupName: 'adults',
      formControlName: 'totalAdult',
      placeHolder: 'Number Of Adults',
      max: 4,
      rate: 20
    },
    {
      name: 'Camera',
      formGroupName: 'camera',
      formControlName: 'totalCamera',
      placeHolder: 'Number Of Camera',
      max: 3,
      rate: 50
    },
    {
      name: 'Video Camera',
      formGroupName: 'videoCamera',
      formControlName: 'totalVideoCamera',
      placeHolder: 'Number Of Video Camera',
      max: 3,
      rate: 100
    }
  ]

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

  idTypes: string[] = [
    'Aadhar Card',
    'Pan Card',
    'Voter Id Card',
    'Passport'
  ]


  /**
   * @param fb - Declare FormBuilder property.
   * @param validationError - Declare validation service property
   * @param formService - Declare form service property 
   * @param uploadFileService - Declare upload file service property.
   * @param commonService - Declare sweet alert.
   * @param shopAndEstablishmentService - Call only shop licence api.
   * @param toastrService - Show massage with timer.
  */


  constructor(
    private fb: FormBuilder,
    private ticketingService: TicketingsService,
    private commonService: CommonService
  ) {

    this.ticketingService.resourceType = 'zoo';
  }

  ngOnInit() {

    this.dataSourceForPricing.data = this.pricing;
    this.dataSourceForTiming.data = this.timing;

    this.ticketBookingFormControls();
    // this.bankDetailsFormControls();
    this.getLookUps();
  }

  /**
	  * Get all booking category list from api.
	*/
  getLookUps() {
    this.ticketingService.getDataFromLookups().subscribe((respData) => {
      this.BANKS = respData.BANK;
    });
  }


  ticketBookingFormControls() {
    this.ticketBookingForm = this.fb.group({
      "id": null,
      "uniqueId": null,
      "version": null,
      "cancelledDate": null,
      "status": null,
      "refNumber": null,
      "resourceType": null,
      "payableServiceType": null,
      "resourceCode": null,
      // "accountHolderName": null,
      // "accountNo": null,
      // "bankName": null,
      // "ifscCode": null,
      "scheduleList": null,
      "attachments": null,
      "bookingDate": null,
      "amount": 0.0,
      "personSubTotal": 0.0,
      "totalAmount": 0.0,
      "paymentMode": null,
      "totalPayableAmount": 0.0,

      visitingDate: [null, Validators.required],
      totalChild: [''],
      totalAdult: [''],
      totalCamera: [''],
      totalVideoCamera: [''],
      applicantName: [null, Validators.required],
      applicantMobile: [null, Validators.required],
      idType: this.fb.group({
        code: [null, Validators.required]
      }),
      idNumber: [null, Validators.required],
      bankName: this.fb.group({
        code: [null, Validators.required],
      }),
      accountHolderName: [null, [Validators.required]],
      accountNo: [null, [Validators.required]],
      ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],
      termsCondition: null,
      agree: null,
    })

  }

  computeTotalAndVisitors() {
    const f = this.ticketBookingForm.value;
    this.numberOfVisitors = Number(f.totalChild) + Number(f.totalAdult);
    this.totalAmount = (Number(f.totalChild) * 5) + (Number(f.totalAdult) * 20) + (Number(f.totalCamera) * 50) + (Number(f.totalVideoCamera) * 100);
    
    this.ticketBookingForm.get('amount').setValue(this.totalAmount);
    this.ticketBookingForm.get('totalAmount').setValue(this.totalAmount);
    this.ticketBookingForm.get('personSubTotal').setValue(this.numberOfVisitors);

  }

  redirecToPayment() {
    if (!this.bankDetailsForm.get('agree').value) {
      this.commonService.openAlert("Feild Error", this.ticketingConstants.AGREE_MESSAGE, 'warning')
      return;
    } else if (!this.bankDetailsForm.get('termsCondition').value) {
      this.commonService.openAlert("Feild Error", this.ticketingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning')
      return;
    } else {
    }
  }

  resetForm() {
    this.ticketBookingForm.reset();
    this.numberOfVisitors = 0;
    this.subTotal = 0;
    this.totalAmount = 0;
  }

}
