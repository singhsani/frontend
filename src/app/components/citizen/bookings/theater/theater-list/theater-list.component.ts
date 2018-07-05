import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';

@Component({
	selector: 'app-theater-list',
	templateUrl: './theater-list.component.html',
	styleUrls: ['./theater-list.component.scss']
})
export class TheaterListComponent implements OnInit {

	/**
	 * boolean flags to handle view.
	 */
	showTheaterBookingForm: boolean = false;
	showBookingInfo: boolean = false;
	showShortListData: boolean = false;

	/**
	 * Translation Key.
	 */
	translateKey = "theaterBookingScreen";

	/**
	 * Forms.
	 */
	searchTheaterForm: FormGroup;
	theaterBookingForm: FormGroup;

	/**
	 * LookUps & Arrays.
	 */
	theaters: Array<any> = [];
	Category: Array<any> = [];
	availableStots: Array<any> = [];

	/**
	 * Function Objects.
	 */
	bookingObject: any;
	categoryObject: any;
	paymentObject: any;

	/**
	 * display colums in table.
	 */
	displayedColumns: Array<string> = ['id', 'start', 'end', 'slotStatus', 'action'];

	/**
	 * Min date shoudl be current date.
	 */
	private minBookingDate: Date = new Date();

	/**
	 * 
	 * @param fb - formbuilder.
	 * @param bookingService - booking service for api reference.
	 * @param toster - toaster service.
	 * @param validationService - validation service.
	 * @param router -routing service.
	 * @param formService - form service for api reference.
	 * @param commonService - common services for popups.
	 */
	constructor(
		private fb: FormBuilder,
		private bookingService: BookingService,
		private toster: ToastrService,
		private validationService: ValidationService,
		private router: Router,
		private formService: FormsActionsService,
		private commonService: CommonService
	) {
		/**
		 * Assingning resource type in constructor.
		 */
		this.bookingService.resourceType = 'amphiTheater';
	}

	/**
	 * Method Initialzes first.
	 */
	ngOnInit() {
		/**
		 * Show ShortListed data.
		 */
		this.showShortListData = true;

		/**
		 * Create theater Searching form.
		 */
		this.createSearchTheaterForm();

		/**
		 * Get All resources list of theater.
		 */
		this.getTheaterResourceList();

		/**
		 * Get All lookups of category.
		 */
		this.getCategoryLookUps();
	}

	/**
	 * Create theater search f 
	 */
	createSearchTheaterForm() {
		this.searchTheaterForm = this.fb.group({
			code: [null, [Validators.required]],
			category: this.fb.group({
				code: [null, [Validators.required]]
			}),
			date: moment().add(1, 'day').format("YYYY-MM-DD")
		});
	}

	/**
	 * Get all theater resource list.
	 */
	getTheaterResourceList() {
		this.bookingService.getResourceList().subscribe(res => {
			if (res.data.length) {
				this.searchTheaterForm.get('code').setValue(res.data[0].code);
				this.bookingObject = res.data[0];
				this.searchBooking();
			}
			this.theaters = res.data;
		},
			err => {
				this.toster.error(err.error.error_description);

			}
		);
	}

	/**
	 * Get all booking category list from api.
	 */
	getCategoryLookUps() {
		this.bookingService.getDataFromLookups().subscribe((respData) => {
			this.Category = respData.AMPHI_THEATER_CATEGORY;
			this.searchTheaterForm.get('category').get('code').setValue(respData.AMPHI_THEATER_CATEGORY[0].code);
		});
	}

	/**
	 * Method is used to get object on theater change.
	 * @param event - time event.
	 */
	theaterChange(event) {
		this.bookingObject = this.theaters.find(data => data.code === event);
	}

	/**
	 * Method is used to invoke when dsate changes and update datye format.
	 * @param event - date event.
	 */
	dateChange(event){
		this.searchTheaterForm.get('date').setValue(moment(event.value).format("YYYY-MM-DD"));
	}

    /**
	 * Method is used to get object on category change.
	 * @param event - category event.
	 */
	categoryChange(event) {
		this.categoryObject = this.Category.find(data => data.code === event);
	}

	/**
	 * Method is used to craete theater booking form.
	 */
	createTheaterBookingForm() {
		this.theaterBookingForm = this.fb.group({
			id: null,
			uniqueId: null,
			version: null,
			cancelledDate: null,
			status: null,
			refNumber: this.paymentObject.refNumber,
			bookingPurpose: null,
			bookingDate: [this.searchTheaterForm.get('date').value, [Validators.required]],
			shiftTimeFrom: [null],
			shiftTimeTo: [null],
			totalAmount: this.paymentObject.amount,
			remarks: null,
			category: this.searchTheaterForm.get('category').value,
			applicantContactNo: [null, [Validators.required]],
			confirmContactNo: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
			applicantEmail: [null, [Validators.required, Validators.email, ValidationService.emailValidator]],
			confirmEmail: [null, [Validators.required, Validators.email, ValidationService.emailValidator]],
			orgName: [null, [Validators.required]],
			orgAddress: [null, [Validators.required]],
			termsCondition: false,
			agree: false
		})
	}

	/**
	 * Method is used to filter slots on specific date.
	 */
	searchBooking() {

		/**
		 * Get resource name.
		 */
		let resourceName = this.searchTheaterForm.value.code;

		/**
		 * Get booking date in YYYY-MM-DD formet.
		 */
		let date = moment(this.searchTheaterForm.value.date).format("YYYY-MM-DD");

		/**
		 * Get All Slots Available.
		 */
		this.bookingService.getAllSlots(resourceName, date).subscribe(res => {

			/**
			 * Store Slots in Array to display in tabular way.
			 */
			this.availableStots = res.data;
		}, err => {

			/**
			 * Toaster alert if error occured.
			 */
			this.toster.error(err.error.message);
		});
	}

	/**
	 * Method is used to shortlist theater.
	 * @param element - short list theater element.
	 */
	shortListTheater(element: any) {

		/**
		 * create custom object for shortlist.
		 */
		let theaterObject = {
			category: {
				code: this.searchTheaterForm.get('category').get('code').value
			},
			uniqueId: element.uniqueId
		}

		/**
		 * Call Api for ShortList.
		 */
		this.bookingService.shortListTheater(theaterObject).subscribe(res => {
			if (res.success) {
				this.commonService.successAlert("Success", "Theater Already Booked", "success");
			}
		}, err => {
			if (err.status === 402) {

				/**
				 * Store Payment Object in variable.
				 */
				this.paymentObject = err.error.data;

				/**
				 * Show Booking Form.
				 */
				this.showBookingInfo = true;
			}
		})
	}

	/**
	 * Method is used to proceed for application.
	 */
	proceedForApplication() {
		/**
		 * Hide short list data.
		 */
		this.showShortListData = false;

		/**
		 * Hide booking information data.
		 */
		this.showBookingInfo = false;

		/**
		 * Show Theater booking form.
		 */
		this.showTheaterBookingForm = true;

		/**
		 * Create Theater Booking Form.
		 */
		this.createTheaterBookingForm();
	}

	/**
	 * Method is used to confirm theater booking.
	 */
	confirmBooking() {

		/**
		 * Call API for slot booking (Amphi Theater).
		 */
		this.bookingService.bookSlotAmphiTheater(this.theaterBookingForm.getRawValue()).subscribe(respData => {
			if (respData.success) {

				/**
				 * Run Search booking method again to update search view.
				 */
				this.searchBooking();

				/**
				 * show shortlisted data.
				 */
				this.showShortListData = true;

				/**
				 * hide booking info.
				 */
				this.showBookingInfo = false;

				/**
				 * Show Theater Booking Form.
				 */
				this.showTheaterBookingForm = false;

				/**
				 * Open Booking Success Alert.
				 */
				this.commonService.successAlert("Success", "Theater SucessFully Booked", "success");
			}
		}, err => {

			/**
			 * Error Code 602 if time expires while booking
			 */
			if (err.status === 602) {

				/**
				 * Open Toaster for warning.
				 */
				this.toster.error("Theater Booking Expired");

				/**
				 * Update Search View.
				 */
				this.searchBooking();
			}
		})
	}

	/**
	 * Method is used to match email & confirm email.
	 */
	emailMatcher(): boolean {
		if (this.theaterBookingForm.get('applicantEmail').value !== this.theaterBookingForm.get('confirmEmail').value) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Method is used to mobile number and confirm mobile number.
	 */
	mobileNoMatcher(): boolean {
		if (this.theaterBookingForm.get('applicantContactNo').value !== this.theaterBookingForm.get('confirmContactNo').value) {
			return true;
		} else {
			return false;
		}

	}

	/**
	 * Method is used to check agree and terms & condition verification.
	 */
	agreeAndTermsVerification(): boolean {
		if (this.theaterBookingForm.get('termsCondition').value && this.theaterBookingForm.get('agree').value) {
			return false;
		} else {
			return true;
		}
	}
}
