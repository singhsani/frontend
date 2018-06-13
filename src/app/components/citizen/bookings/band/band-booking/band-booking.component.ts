import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
  selector: 'app-band-booking',
  templateUrl: './band-booking.component.html',
  styleUrls: ['./band-booking.component.scss']
})
export class BandBookingComponent implements OnInit {

  shortlistBandForm: FormGroup;
  Bands: Array<any> = [];
  availableBands: Array<any> = [];
  displayedColumns: Array<string> = ['id', 'startTime', 'endTime', 'status'];
  translateKey: string = 'bandListScreen';

  constructor(
    private fb: FormBuilder,
    private atp: AmazingTimePickerService,
    private bookingService: BookingService,
    private toster: ToastrService,
    private router: Router
  ) {
    this.bookingService.resourceType = 'band';
  }

  ngOnInit() {
    this.getBandResourceList();
    this.createBandBookingListForm();
  }

  openTimePicker() {
    const amazingTimePicker = this.atp.open({
      changeToMinutes: true,
      theme: 'material-purple',
    });
    amazingTimePicker.afterClose().subscribe(time => {
      if (time.length == 5) {
        this.shortlistBandForm.get('birthTime').setValue(time + ":00");
      }
    });
  }

  createBandBookingListForm() {
    this.shortlistBandForm = this.fb.group({
      code: null,
      date: null
    })
  }

  getBandResourceList() {
    this.bookingService.getResourceList().subscribe(res => {
      console.log(res);
      this.Bands = res.data;
    },
      err => {
        this.toster.error(err.error.error_description);
      }
    );
  }

  getBookedBandList() {
    this.bookingService.getBookedBands(moment(this.shortlistBandForm.get('date').value).format("YYYY-MM-DD"), this.shortlistBandForm.get('code').value)
      .subscribe(respDate => {
        this.availableBands = respDate.data;
        console.log(respDate);
      }, err => {
        this.toster.error(err.error.error_description);
      })
  }

}
