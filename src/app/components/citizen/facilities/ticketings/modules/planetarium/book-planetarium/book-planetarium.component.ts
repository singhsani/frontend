import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TicketingsService } from '../../../shared-ticketing/services/ticketings.service';

@Component({
  selector: 'app-book-planetarium',
  templateUrl: './book-planetarium.component.html',
  styleUrls: ['./book-planetarium.component.scss']
})
export class BookPlanetariumComponent implements OnInit {

  /**
   * instance variables
   */

  translateKey: string = 'planetariumScreen';

  ticketBookingForm: FormGroup;

  minDate = moment(new Date()).add(1, 'day').toISOString();

  /**
   * Lookups & Data
   */

  CATEGORIES: Array<any> = [{
    name: "General Show",
    code: "GENERAL"
  }, {
    name: "Special Show (Students)",
    code: "SPECIAL"
  }];

  PLANETARIUMSHOWS: Array<any> = [{
    name: "4:00 To 4:30 – Gujrathi",
    code: "GUJ"
  }, {
    name: "5:00 To 5:30 – English",
    code: "ENG"
  }, {
    name: "6:00 To 6:30 – Hindi",
    code: "HIN"
  }, {
    name: "Extra Show",
    code: "EXT"
  }];

  IDTYPES: Array<any> = [{
    name: "Aadhar Card",
    code: "AADHAR"
  }, {
    name: "ID Card",
    code: "IDCARD"
  }, {
    name: "Driving License",
    code: "DL"
  }];

  RATE : number = 10;

  constructor(private _fb: FormBuilder, 
    private tService: TicketingsService) { }

  ngOnInit() {
    this.createTicketBookingForm();
  }

  createTicketBookingForm() {
    this.ticketBookingForm = this._fb.group({
      visitingDate: [null, [Validators.required]],
      category: this._fb.group({
        name: [null, [Validators.required]],
        code: [null, [Validators.required]]
      }),
      planetariumShows: this._fb.group({
        name: [null, [Validators.required]],
        code: [null, [Validators.required]]
      }),
      seats : [null, [Validators.required, Validators.max(4), Validators.min(1)]],
      noOfVisitors: [null],
      firstName: [null, [Validators.required]],
      middleName: [null],
      lastName: [null, [Validators.required]],
      schoolName: [null],
      schoolMobileNumber: [null],
      schoolEmailId: [null],
      mobileNumber: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      idType: this._fb.group({
        name: [null, [Validators.required]],
        code: [null, [Validators.required]]
      }),
      idNumber: [null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      termsCondition: [null, [Validators.required]],
      // agree: [null, [Validators.required]],
      attachments: []
    })
  }

  confirmBooking() {
    console.log(this.ticketBookingForm.value)
  }
}
