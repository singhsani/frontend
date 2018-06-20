import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';


@Component({
  selector: 'app-book-theater',
  templateUrl: './book-theater.component.html',
  styleUrls: ['./book-theater.component.scss']
})
export class BookTheaterComponent implements OnInit {
  theaterBookingForm: FormGroup;
  theaters: Array<any> = [];
  availableStots: Array<any> = [];
  displayedColumns: Array<string> = ['id', 'start', 'end', 'slotStatus'];

  constructor(private fb: FormBuilder,
    private bookingService: BookingService,
    private toster: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.createTheaterBookingForm();
  }

  bookTheater(){
    console.log("theatr booked");
  }

  createTheaterBookingForm(){
    this.theaterBookingForm = this.fb.group({
      code: '',
      date: moment(new Date()).add(1, 'day').format("YYYY-MM-DD")
    })
  }

}
