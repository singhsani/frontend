import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { CommonService } from '../../../../../shared/services/common.service';

@Component({
	selector: 'app-theater-list',
	templateUrl: './theater-list.component.html',
	styleUrls: ['./theater-list.component.scss']
})
export class TheaterListComponent implements OnInit {

	showTheaterBookingForm:boolean= false;
	translateKey="theaterBookingScreen"

	searchTheaterForm: FormGroup;
	theaterBookingForm: FormGroup;
	
	theaters: Array<any> = [];
	Category: Array<any> = [{ name: 'School', code: 'school' }, { name: 'Organization', code:'organization'}];
	availableStots: Array<any> = [];

	displayedColumns: Array<string> = ['id', 'start', 'end', 'slotStatus'];

	constructor(
		private fb: FormBuilder,
		private bookingService: BookingService,
		private toster: ToastrService,
		private validationService: ValidationService,
		private router: Router,
		private commonService: CommonService
	) {
		this.bookingService.resourceType = 'amphiTheater';
	}

	/**
	 * Method Initialzes first.
	 */
	ngOnInit() {

		this.searchTheaterForm = this.fb.group({
			code: null,
			catcode:null,
			date: moment().add(1,'day').format("YYYY-MM-DD")
		});

		this.bookingService.getResourceList().subscribe(res => {
			this.theaters = res.data;
			if (res.data.length) {
				this.searchTheaterForm.get('code').setValue(res.data[0].code);
				this.searchBooking();
			}
		},
			err => {
				this.toster.error(err.error.error_description);
			}
		);
	}

	/**
	 * Method is used to craete theater booking form.
	 */
	createTheaterBookingForm(){
		this.theaterBookingForm= this.fb.group({
			organizationName: this.fb.control(null, [Validators.required]),
			address: this.fb.control(null, [Validators.required]),
			mobileNumber: this.fb.control(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
			emailID: this.fb.control(null, [Validators.required, Validators.email, ValidationService.emailValidator]),
			confirmEmailID: this.fb.control(null, [Validators.required, Validators.email, ValidationService.emailValidator]),
		})
	}

	/**
	 * Method is used to filter slots on specific date.
	 */
	searchBooking() {
		let resourceName = this.searchTheaterForm.value.code;
		let date = moment(this.searchTheaterForm.value.date).format("YYYY-MM-DD");
		this.bookingService.getAllSlots(resourceName, date).subscribe(res => {
			console.log(res);
			this.availableStots = res.data;
		}, err => {
			this.toster.error(err.error.message);
		});

	}

	/**
	 * 
	 * @param uniqueId 
	 * @param index 
	 */
	bookSlots(uniqueId: string, index: number) {
		this.createTheaterBookingForm();
		this.showTheaterBookingForm = true;


		// this.bookingService.bookSlot(uniqueId, '').subscribe(res => {
		// 	this.searchBooking();
		// }, err => {
		// 	this.toster.error(err.message);
		// });
	}

	/**
	 * 
	 */
	confirmBooking(){
		console.log(this.theaterBookingForm.value);
	}

	emailMatcher(): boolean{
		if (this.theaterBookingForm.get('confirmEmailID').value !== this.theaterBookingForm.get('emailID').value){
			return true;	
		} else {
			return false;
		}
	}

	

}
