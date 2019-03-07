import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-zoo-booking',
  templateUrl: './zoo-booking.component.html',
  styleUrls: ['./zoo-booking.component.scss', './../../../../my-applications/my-applications.component.scss']
})
export class ZooBookingComponent implements OnInit {

  /**
	  * displayColumns are used for display the columns in material table.
	*/
  displayedColumnsForPricingTable: any = [
    'id',
    'description',
    'price'
  ];

  displayedColumnsForTimingTable: any = [
    'id',
    'months',
    'slot'
  ];

  /**
    * Flags
  */
  guideLineFlag: boolean = true;
  showTicketsBookingForm: boolean = false;

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
    * Pricing data for ticket bookings for visiting zoo
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

  // TIcket Booking Table Row Data:

  ticketBookingRows: any[] = [
    {
      name: 'Children',
      formGroupName: 'children',
      formControlName: 'numberOfChildren',
      placeHolder: 'Number Of Children',
      max: 4,
      rate: 5
    },
    {
      name: 'Adults',
      formGroupName: 'adults',
      formControlName: 'numberOfAdults',
      placeHolder: 'Number Of Adults',
      max: 4,
      rate: 20
    },
    {
      name: 'Camera',
      formGroupName: 'camera',
      formControlName: 'numberOfCamera',
      placeHolder: 'Number Of Camera',
      max: 3,
      rate: 50
    },
    {
      name: 'Video Camera',
      formGroupName: 'videoCamera',
      formControlName: 'numberOfVideoCamera',
      placeHolder: 'Number Of Video Camera',
      max: 3,
      rate: 100
    }
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
  ) { }

  ngOnInit() {

    this.dataSourceForPricing.data = this.pricing;
    this.dataSourceForTiming.data = this.timing;

    this.shopLicNewFormControls();
  }

  shopLicNewFormControls() {
    this.ticketBookingForm = this.fb.group({
      children: this.fb.group({
        numberOfChildren: [null],
        fees: []
      }),
      adults: this.fb.group({
        numberOfAdults: [null],
        fees: []
      }),
      camera: this.fb.group({
        numberOfCamera: [null],
        fees: []
      }),
      videoCamera: this.fb.group({
        numberOfVideoCamera: [null],
        fees: []
      })
    })

    this.ticketBookingForm.valueChanges.subscribe( f => {
      console.log(f);
      this.numberOfVisitors = Number(f.children.numberOfChildren) + Number(f.adults.numberOfAdults) + Number(f.camera.numberOfCamera) + Number(f.videoCamera.numberOfVideoCamera);
      this.totalAmount = (Number(f.children.numberOfChildren) * 5) + (Number(f.adults.numberOfAdults) * 20) + (Number(f.camera.numberOfCamera) * 50) + (Number(f.videoCamera.numberOfVideoCamera) * 100);
    })
  }

}
