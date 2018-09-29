import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss']
})
export class BookingStatusComponent implements OnInit {

  /**
   * Booking Status Form Group.
   */
  checkBookingStatsForm: FormGroup;

  /**
   * Language translation key.
   */
  translateKey = "theaterBookingStatusScreen";

  /**
   * confirmation to display booking status.
   */
  showStatus: any;

  /**
   * Avilable status array.
   */
  availableStatus: Array<any> = [];

  /**
   * 
   */
  displayedColumnsForStatus: Array<string> = ['id', 'bookingNumber', 'applicantName', 'currentStatus'];

  /**
   * 
   * @param fb - from builder.
   * @param bookingService - booking service.
   * @param toster - toaster service.
   * @param router - routng service.
   */
  constructor(private fb: FormBuilder,
  ) { }

  /**
   * Method initializes the view.
   */
  ngOnInit() {

    /**
     * Step -1 to create status form.
     */
    this.createStatusForm();
  }

  /**
   * Create Booking Status Form.
   */
  createStatusForm() {
    this.checkBookingStatsForm = this.fb.group({
      bookingNumber: this.fb.control(null, [Validators.required])
    })
  }

  /**
   * Call API for Checking status 
   */
  checkBookingStatus() {
    this.showStatus = {
      bookingNumber: this.checkBookingStatsForm.get('bookingNumber').value,
      applicantName: "",
      currentStatus: ""
    }
    this.availableStatus.push(this.showStatus);
    console.log(this.checkBookingStatsForm.value);
  }
}
