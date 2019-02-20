import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { BookingService } from '../../shared-booking/services/booking-service.service';

@Component({
  selector: 'app-band-booking',
  templateUrl: './band-booking.component.html',
  styleUrls: ['./band-booking.component.scss']
})
export class BandBookingComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private atp: AmazingTimePickerService,
    private bookingService: BookingService,
    private toster: ToastrService,
    private router: Router
  ) {
    this.bookingService.resourceType = 'band';
  }

  /**
   * Method is used to initialize view.
   */
  ngOnInit() {
  }

  

}
