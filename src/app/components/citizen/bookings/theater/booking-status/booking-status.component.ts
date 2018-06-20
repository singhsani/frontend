import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { ValidationService } from '../../../../../shared/services/validation.service';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss']
})
export class BookingStatusComponent implements OnInit {
  checkBookingStatsForm: FormGroup;
  translateKey = "theaterBookingStatusScreen";

  constructor(private fb: FormBuilder,
    private bookingService: BookingService,
    private toster: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.createStatusForm();
  }

  createStatusForm(){
    this.checkBookingStatsForm = this.fb.group({
      bookingNumber: this.fb.control(null, [Validators.required])
    })
  }

  checkBookingStatus(){
    console.log(this.checkBookingStatsForm.value);
  }

}
