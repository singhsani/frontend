import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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


	translateKey: string = "citizenAtithigruhScreen";

	protected ATITHIGRUH: Array<LookUPMap> = [{
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

	protected BOOKING_TYPE: Array<LookUPMap> = [
		{ name: "Advance Booking(By Draw)", code: "ADVANCE" },
		{ name: "Regular Booking", code: "REGULAR" },
	]

	protected PURPOSE: Array<LookUPMap> = [
		{ name: "Regular Booking", code: "REGULAR" },
		{ name: "Advance Booking(By Draw)", code: "ADVANCE" }
	]

	protected atithigruhForm: FormGroup;
	protected BookingTypeForm: FormGroup;

	constructor(private _fb: FormBuilder) { }
	ngOnInit() {
		this.createBookingTypeForm();
	}

	createAtithigruhForm() {
		this.atithigruhForm = this._fb.group({
		});
	}

	createBookingTypeForm() {
		this.BookingTypeForm = this._fb.group({
			code: [null, Validators.required],
			purpose: this._fb.group({
				code: [null, [Validators.required]],
				name: null
			}),
		})
	}

	searchBooking(){

	}
}
