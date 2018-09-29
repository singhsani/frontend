import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';


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

  constructor(private fb: FormBuilder){}

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
