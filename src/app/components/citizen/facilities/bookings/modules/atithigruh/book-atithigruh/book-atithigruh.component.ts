import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../../../shared/services/validation.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';

interface LookUPMap {
	name: string;
	code: string;
}
@Component({
	selector: 'app-book-atithigruh',
	templateUrl: './book-atithigruh.component.html',
	styleUrls: ['./book-atithigruh.component.scss']
})
export class BookAtithigruhComponent implements OnInit {
	@ViewChild('address') addressComp: any;

	translateKey: string = "citizenAtithigruhScreen";
	tabIndex: number = 0;
	bookingConstants = BookingConstants;
	bookingUtils: BookingUtils = new BookingUtils();

	ATITHIGRUH: Array<LookUPMap> = [{
		name: "Sayajibaug Atithigruh No.1",
		code: "Sayajibaug1"
	}, {
		name: "Sayajibaug Atithigruh No.2",
		code: "Sayajibaug2"
	}, {
		name: "Sayajibaug Atithigruh No.3",
		code: "Sayajibaug3"
	}, {
		name: "Sayajibaug Lawn",
		code: "Sayajibauglown"
	}, {
		name: "Sharadnagar Atithigruh",
		code: "Sharadnagar"
	}, {
		name: "Lalbaug Atithigruh",
		code: "Lalbaug"
	}, {
		name: "Warshiya Community Hall",
		code: "Warshiya"
	}, {
		name: "Tarsali Community Hall",
		code: "Tarsali"
	}, {
		name: "Chatrapati Shivaji Maharaj Atithigruh",
		code: "Chatrapati"
	}, {
		name: "Akota Atithigruh",
		code: "Akota"
	}, {
		name: "Sardarbaug Atithigruh",
		code: "Sardarbaug"
	}, {
		name: "Sultanpura Atithigruh",
		code: "Sultanpura"
	}, {
		name: "Nizampura Atithigruh",
		code: "Nizampura"
	}, {
		name: "Manjalpur Atithigruh",
		code: "Manjalpur"
	}, {
		name: "Premanand Sanskar Kendra with Lawn / Stage",
		code: "Premanand"
	}, {
		name: "Indrapuri Atithigruh",
		code: "Indrapuri"
	}, {
		name: "Diwalipura Atithigruh",
		code: "Diwalipura"
	}, {
		name: "Harani Vijaynagar Community Hall",
		code: "Harani"
	}];

	 BOOKING_TYPE: Array<LookUPMap> = [
		{ name: "Advance Booking(By Draw)", code: "ADVANCE" },
		{ name: "Regular Booking", code: "REGULAR" },
	]

	 PURPOSE: Array<LookUPMap> = [
		{ name: "Regular Booking", code: "REGULAR" },
		{ name: "Advance Booking(By Draw)", code: "ADVANCE" }
	]

	BankOptions: Array<any> = [];

	atithigruhForm: FormGroup;
	BookingTypeForm: FormGroup;

	constructor(private _fb: FormBuilder) { }
	ngOnInit() {
		this.createBookingSearchForm();
		this.createAtithigruhForm();
	}

	createAtithigruhForm(): void {
		this.atithigruhForm = this._fb.group({
			/**
			 * Organization Details
			 */
			organizationName: [null, [Validators.required]],
			orgTelephoneNo: [null, [Validators.required]],
			organizationPresidentName: [null, [Validators.required]],
			organizationAddress: this._fb.group(this.addressComp.addressControls()),
			/**
			 * Applicant Details
			 */
			applicantName: [null, [Validators.required]],
			applicantMobile: [null, [Validators.required]],
			confirmMobile: [null, [Validators.required]],
			emailID: [null, [Validators.required, Validators.email]],
			confirmEmailID: [null, [Validators.required, Validators.email]],
			relationshipWithOrg: [null, [Validators.required]],
			applicantAddress: this._fb.group(this.addressComp.addressControls()),
			/**
			 * Bank Accoount Details
			 */
			bankName: this._fb.group({
				code: [null, [Validators.required]]
			}),
			accountHolderName: [null, [Validators.required]],
			accountNo: [null, [Validators.required]],
			ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],
			/**
			 * Booking Details
			 */
			programShortDetails: [null, [Validators.required]],
			programPurpose: [null, [Validators.required]],
			termsCondition: null,
			agree: null,
			/**
			 * form details
			 */
			id: null,
			idfcCode: null,
			refNumber: null,
			remarks: null,
			status: null,
			uniqueId: null,
			version: 0,
			bookingDate: [null, [Validators.required]],
			cancelledDate: null,
			expiryTime: null,
			policePerformanceLicense: null,
			bookingPurposeMaster: this._fb.group({
				code: [null, [Validators.required]],
				name: null
			}),
		});
	}

	createBookingSearchForm(): void {
		this.BookingTypeForm = this._fb.group({
			code: [null, Validators.required],
			purpose: this._fb.group({
				code: [null, [Validators.required]],
				name: null
			}),
		})
	}

	submit(): void {

	}

	searchBooking(): void {

	}
}
