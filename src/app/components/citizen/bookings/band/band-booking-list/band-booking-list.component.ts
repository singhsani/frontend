import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { FormGroup, FormBuilder, Form, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { CommonService } from '../../../../../shared/services/common.service';
import { ValidationService } from '../../../../../shared/services/validation.service';

@Component({
  selector: 'app-band-booking-list',
  templateUrl: './band-booking-list.component.html',
  styleUrls: ['./band-booking-list.component.scss']
})
export class BandBookingListComponent implements OnInit {


  searchBookedBandForm: FormGroup;
  shortlistBandForm: FormGroup;
  confirmBandBookingForm: FormGroup;

  showConfirmBookingForm: boolean = false;
  showConfirmPaymentForm: boolean = false;
  showShortListForm: boolean = false;

  paymentTransactionId: string;
  bandBookingPaymentAmount: Number = 0;

  Bands: Array<any> = [];
  TemporaryBookedBands: Array<any> = [];
  availableBands: Array<any> = [];

  displayedColumns: Array<string> = ['id', 'startTime', 'endTime', 'status'];
  translateKey: string = 'bandListScreen';

  minBandBookingDate = new Date();

  constructor(
    private fb: FormBuilder,
    private atp: AmazingTimePickerService,
    private bookingService: BookingService,
    private toster: ToastrService,
    private router: Router,
    private commonService: CommonService,
  ) {
    this.bookingService.resourceType = 'band';
  }

  /**
   * Method is used to initialize.
   */
  ngOnInit() {
    this.getBandResourceList();
    this.createBandShortListForm();
    this.createBandBookingListForm();
    this.createConfirmBandBookingForm();
    this.showShortListForm = true;
  }

  /**
   * Method is used to create Band Booking form.
   */
  createBandBookingListForm() {
    this.searchBookedBandForm = this.fb.group({
      code: [null, Validators.required],
      date: [moment(new Date()).format("YYYY-MM-DD"), Validators.required]
    });
  }

  /**
   * Method is used to create Band Srotlist form.
   */
  createBandShortListForm() {
    this.shortlistBandForm = this.fb.group({
      startTime: [null, Validators.required],
      endTime: new FormControl({ value: null }, [Validators.required])
    });
  }

  /**
   * Method is used to create confirm band booking form.
   */
  createConfirmBandBookingForm() {
    {
      this.confirmBandBookingForm = this.fb.group({
        id: null,
        uniqueId: null,
        version: null,
        status: null,
        cancelledDate: null,
        bookingDate: [null, Validators.required],
        endTime: [null, Validators.required],
        startTime: [null, Validators.required],
        applicantName: [null, Validators.required],
        applicantMobile: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        applicantPermanentAddress: [null, Validators.required],
        requiredPlaceAddress: [null, Validators.required]
      });
    }
  }

  /**
   * Method is used to open time picker for start time.
   */
  openStartTimePicker() {
    const amazingTimePicker = this.atp.open({
      onlyHour: true,
      time: '09:00',
      rangeTime: {
        start: '09:00',
        end: '21:00'
      },
      theme: 'material-purple',
    });
    amazingTimePicker.afterClose().subscribe(time => {
      if (time.length == 5) {
        this.shortlistBandForm.get('startTime').setValue(time + ":00");
      }
    });
  }

  /**
   * Method is used to open time picker for end time.
   */
  openEndTimePicker() {
    const amazingTimePicker = this.atp.open({
      onlyHour: true,
      time: '09:00',
      rangeTime: {
        start: '09:00',
        end: '21:00'
      },
      theme: 'material-purple',
    });
    amazingTimePicker.afterClose().subscribe(time => {
      if (time.length == 5) {
        this.shortlistBandForm.get('endTime').setValue(time + ":00");
      }
    });
  }


  /**
   * Method is used to get resource list.
   */
  getBandResourceList() {
    this.bookingService.getResourceList().subscribe(res => {
      this.Bands = res.data;
    },
      err => {
        this.toster.error(err.error.error_description);
      }
    );
  }

  /**
   * Method is used to get booked band list.
   */
  getBookedBandList() {
    this.bookingService
      .getBookedBands(moment(this.searchBookedBandForm.get('date').value).format("YYYY-MM-DD"), this.searchBookedBandForm.get('code').value)
      .subscribe(respDate => {
        this.showShortListForm = true;
        this.availableBands = respDate.data;
        if (this.availableBands.length == 0) {
          this.commonService.openAlert("Not Found", "Band Are Not Available You Can book bands on specified date & time", "warning");
        }
      }, err => {
        this.toster.error(err.error.error_description);
      });
  }

  /**
   * Method is used to get shortlisted band list.
   */
  getShortListedBandList() {
    this.bookingService
      .shortListBands(moment(this.searchBookedBandForm.get('date').value).format("YYYY-MM-DD"),
        this.shortlistBandForm.get('startTime').value, this.shortlistBandForm.get('endTime').value,
        this.searchBookedBandForm.get('code').value).subscribe(respData => {
          this.confirmBandBookingForm.patchValue(respData.data);
          this.showShortListForm = false;
          this.showConfirmBookingForm = true;
        }, err => {
          if (err.status == 602) {
            this.commonService.openAlert("Band Already Booked", err.error[0].message, "warning");
          }
        });
  }

  /**
   * Method is used to confirm band booking.
   */
  confirmBandBooking() {
    this.showConfirmBookingForm = false;
    this.bookingService.confirmBandBooking(this.confirmBandBookingForm.value).subscribe(respData => {
      if (respData.success) {
        this.commonService.successAlert("Success", "Band SucessFully Booked", "success");
        this.showConfirmPaymentForm = false;
        this.showConfirmBookingForm = false;
        this.commonService.successAlert("Success", "Band SucessFully Booked", "success");
        this.getBookedBandList();
        return;
      }
    }, err => {
      if (err.status == 402) {
        this.bandBookingPaymentAmount = err.error.data.amount;
        this.paymentTransactionId = err.error.data.transactionId;
        this.showConfirmPaymentForm = true;
      }
    })
  }

  /**
   * Method is used to make payment after booking confirm.
   */
  makePaymentAfterConfirmBooking() {
    this.bookingService.makePaymentService(this.paymentTransactionId).subscribe(respData => {
      this.confirmBandBooking();
    }, err => {
      this.toster.error(err.message)
    })
  }
}
