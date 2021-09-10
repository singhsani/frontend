import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';
import { BookingService } from 'src/app/components/citizen/facilities/bookings/shared-booking/services/booking-service.service';

@Component({
  selector: 'bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {

  @Input('form') atithigruhForm: FormGroup;

  stadiumTranslateKey: string = "citizenStadiumScreen";
  BankOptions: any = [];

  constructor(private bookingService: BookingService) { }

  ngOnInit() {

    this.bookingLookups();
    this.createFormControls();

  }

  /**
   * This method is used to create form controls
   */
  createFormControls() {
    this.atithigruhForm.addControl('bankName', new FormGroup({
      code: new FormControl(null, [Validators.required]),
    }));
    this.atithigruhForm.addControl('accountHolderName', new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]));
    this.atithigruhForm.addControl('accountNo', new FormControl(null, [Validators.required, Validators.maxLength(18), Validators.minLength(9)]))
    this.atithigruhForm.addControl('ifscCode', new FormControl(null, [Validators.required, ValidationService.ifscCodeValidator]))
  }

  /**
	* Method is used to get all bank lookups
	*/
  bookingLookups() {
    this.bookingService.getBankNames().subscribe(resp => {
      this.BankOptions = resp.data;
    });
  }

}
