import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../../../../../../shared/services/validation.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';
import { BookingService } from './../../../shared-booking/services/booking-service.service';
import { CommonService } from 'src/app/shared/services/common.service';

import * as moment from 'moment';

@Component({
	selector: 'app-book-atithigruh',
	templateUrl: './book-atithigruh.component.html',
	styleUrls: ['./book-atithigruh.component.scss']
})
export class BookAtithigruhComponent implements OnInit {

	translateKey: string = "atithigruhScreen";
	stadiumTranslateKey: string = "citizenStadiumScreen";


	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;
	@ViewChild("confirmationModel") confirmationModel: TemplateRef<any>;
	@ViewChild('address') addressComp: any;

	tabIndex: number = 0;
	bookingConstants = BookingConstants;
	bookingUtils: BookingUtils;

	guideLineFlag: boolean = true;
	showSearchForm: boolean = false;
	isBookingFormHidden: boolean = true;
	showPaymentReciept: boolean = false;
	isLoadingResults: boolean = false;
	head_lines: string;
	guj_line : string;

	startMinDate: Date = moment(new Date()).add(3, 'day').toDate();
	endMinDate = moment(new Date()).add(119, 'day').toDate();
	toStartDate: Date;

	toStartBookDate;
	toEndBookDate ;

	inputReadonly = true;

	ATITHIGRUH: Array<any> = [];
	BOOKING_TYPE: Array<any> = []
	PURPOSE: Array<any> = []
	// BankOptions: Array<any> = [];
	selectedShift: Array<any> = [];
	filteredReponse: any;
	Dates: Array<any> = [];
	availableStots: Array<any> = [];
	paymentObject: any;
	bookingForRegular: boolean = true;

	atithigruhForm: FormGroup;
	BookingTypeForm: FormGroup;
	bookingDetails : FormGroup;
	bankDetails : FormGroup;
	applicationDetails : FormGroup

	dataSource = new MatTableDataSource();

	pageSize: number = 5;
	bookedPageSize: number = 5;
	confirmRef: BsModalRef;
	displayedColumns: Array<string> = ['id', 'shiftType', 'bookingDate', 'startTime', 'endTime', 'rent', 'electricCharges', 'administrationCharges', 'showTax', 'subTotal', 'gstAmount', 'total'];
	displayedColumnsFeeDetails: string[] = ['sno', 'atithigruh', 'rent', 'administrative_charge', 'gst','total_rent', 'deposit','total'];
	profileObj : any;
	public formControlNameToTabIndex = new Map();
	checkProceed : boolean = false;
	btnProceed: boolean = true; 
	atithigruhName :string;
	purpose :string;
	startDate : string;
	endDate : string;
	totalAmount : number =0;
	totalPayble : number =0;
	showSelectLanguage : boolean = true;

	feeDetails: any [] = [
		{sno: 1, atithigruh: 'Sayajibaug 1', rent: '5000', administrative_charge: '1000', gst:'1080' ,total_rent: '7080', deposit: '7500',total: '14580'},
		{sno: 2, atithigruh: 'Sayajibaug 2', rent: '5000', administrative_charge: '1000', gst:'1080' ,total_rent: '7080', deposit: '7500',total: '14580'},
		{sno: 3, atithigruh: 'Sayajibaug 3', rent: '5000', administrative_charge: '1000', gst:'1080' ,total_rent: '7080', deposit: '7500',total: '14580'},
		{sno: 4, atithigruh: 'Sayaji Lawn', rent: '7500', administrative_charge: '1000', gst:'1530' ,total_rent: '10030', deposit: '10000',total: '20030'},
		{sno: 5, atithigruh: 'Akota', rent: '12000', administrative_charge: '1000', gst:'2340' ,total_rent: '15340', deposit: '20000',total: '35340'},
		{sno: 6, atithigruh: 'Sardarbaug', rent: '12000', administrative_charge: '1000', gst:'2340' ,total_rent: '15340', deposit: '20000',total: '35340'},
		{sno: 7, atithigruh: 'Nijampura', rent: '12000', administrative_charge: '1000', gst:'2340' ,total_rent: '15340', deposit: '20000',total: '35340'},
		{sno: 8, atithigruh: 'Subhanpura', rent: '12000', administrative_charge: '1000', gst:'2340' ,total_rent: '15340', deposit: '20000',total: '35340'},
		{sno: 9, atithigruh: 'Dr.Babasaheb Ambedkar', rent: '12000', administrative_charge: '1000', gst:'2340' ,total_rent: '15340', deposit: '20000',total: '35340'},
		{sno: 10, atithigruh: 'Lalbaug', rent: '12000', administrative_charge: '1000', gst:'2340' ,total_rent: '15340', deposit: '20000',total: '35340'},
		{sno: 11, atithigruh: 'Premanand', rent: '8000', administrative_charge: '1000', gst:'1620' ,total_rent: '10620', deposit: '10000',total: '20620'},
		{sno: 12, atithigruh: 'Indrapuri', rent: '10000', administrative_charge: '1000', gst:'1980' ,total_rent: '12980', deposit: '20000',total: '32980'},
		{sno: 13, atithigruh: 'Sharad Nagar', rent: '8000', administrative_charge: '1000', gst:'1620' ,total_rent: '10620', deposit: '7500',total: '18120'},
		{sno: 14, atithigruh: 'Vijaynagarko Hall', rent: '3500', administrative_charge: '1000', gst:'810 ' ,total_rent: '5310', deposit: '5000',total: '10310'},
		{sno: 15, atithigruh: 'Tarasali Hall', rent: '3000', administrative_charge: '1000', gst:'720' ,total_rent: '4720', deposit: '5000',total: '9720'},
		{sno: 16, atithigruh: 'Chatrapati Shivaji', rent: '8000', administrative_charge: '1000', gst:'1620' ,total_rent: '10620', deposit: '7500',total: '18120'},
		{sno: 17, atithigruh: 'Diwali Pura', rent: '17000', administrative_charge: '1000', gst:'3240' ,total_rent: '21240', deposit: '20000',total: '41240'},
		{sno: 18, atithigruh: 'Manjalpur', rent: '20000', administrative_charge: '1000', gst:'3780' ,total_rent: '24780', deposit: '30000',total: '54780'},
	  ];

	  gujratifeeDetails: any [] = [
		{sno: '૧', atithigruh: 'સયાજીબાગ ૧', rent: '૫૦૦૦', administrative_charge: '૧૦૦૦', gst:'૧૦૮૦' ,total_rent: '૭૦૮૦', deposit: '૭૫૦૦',total: '૧૪૫૮૦'},
		{sno: '૨', atithigruh: 'સયાજીબાગ ૨', rent: '૫૦૦૦', administrative_charge: '૧૦૦૦', gst:'૧૦૮૦' ,total_rent: '૭૦૮૦', deposit: '૭૫૦૦',total: '૧૪૫૮૦'},
		{sno: '૩', atithigruh: 'સયાજીબાગ ૩', rent: '૫૦૦૦', administrative_charge: '૧૦૦૦', gst:'૧૦૮૦' ,total_rent: '૭૦૮૦', deposit: '૭૫૦૦',total: '૧૪૫૮૦'},
		{sno: '૪', atithigruh: 'સયાજી લોન', rent: '૭૫૦૦', administrative_charge: '૧૦૦૦', gst:'૧૫૩૦' ,total_rent: '૧૦૦૩૦', deposit: '૧૦૦૦૦',total: '૨૦૦૩૦'},
		{sno: '૫', atithigruh: 'અકોટા', rent: '૧૨૦૦૦', administrative_charge: '૧૦૦૦', gst:'૨૩૪૦' ,total_rent: '૧૫૩૪૦', deposit: '૨૦૦૦૦',total: '૩૫૩૪૦'},
		{sno: '૬', atithigruh: 'સયાજીબાગ', rent: '૧૨૦૦૦', administrative_charge: '૧૦૦૦', gst:'૨૩૪૦' ,total_rent: '૧૫૩૪૦', deposit: '૨૦૦૦૦',total: '૩૫૩૪૦'},
		{sno: '૭', atithigruh: 'નિજમપુરા', rent: '૧૨૦૦૦', administrative_charge: '૧૦૦૦', gst:'૨૩૪૦' ,total_rent: '૧૫૩૪૦', deposit: '૨૦૦૦૦',total: '૩૫૩૪૦'},
		{sno: '૮', atithigruh: 'સુભાનપુરા', rent: '૧૨૦૦૦', administrative_charge: '૧૦૦૦', gst:'૨૩૪૦' ,total_rent: '૧૫૩૪૦', deposit: '૨૦૦૦૦',total: '૩૫૩૪૦'},
		{sno: '૯', atithigruh: 'ડો.બાબાસાહેબ આંબેડકર', rent: '૧૨૦૦૦', administrative_charge: '૧૦૦૦', gst:'૨૩૪૦' ,total_rent: '૧૫૩૪૦', deposit: '૨૦૦૦૦',total: '૩૫૩૪૦'},
		{sno: '૧૦', atithigruh: 'લાલબાગ', rent: '૧૨૦૦૦', administrative_charge: '૧૦૦૦', gst:'૨૩૪૦' ,total_rent: '૧૫૩૪૦', deposit: '૨૦૦૦૦',total: '૩૫૩૪૦'},
		{sno: '૧૧', atithigruh: 'પ્રેમાનંદ', rent: '૮૦૦૦', administrative_charge: '૧૦૦૦', gst:'૧૬૨૦' ,total_rent: '૧૦૬૨૦', deposit: '૧૦૦૦૦',total: '૨૦૬૨૦'},
		{sno: '૧૨', atithigruh: 'ઇન્દ્રપુરી', rent: '૧૦૦૦૦', administrative_charge: '૧૦૦૦', gst:'૧૯૮૦' ,total_rent: '૧૨૯૮૦', deposit: '૨૦૦૦૦',total: '૩૨૯૮૦'},
		{sno: '૧૩', atithigruh: 'શરદ નગર', rent: '૮૦૦૦', administrative_charge: '૧૦૦૦', gst:'૧૬૨૦' ,total_rent: '૧૦૬૨૦', deposit: '૭૫૦૦',total: '૧૮૧૨૦'},
		{sno: '૧૪', atithigruh: 'વિજયનગરકો હોલ', rent: '૩૫૦૦', administrative_charge: '૧૦૦૦', gst:'૮૧૦ ' ,total_rent: '૫૩૧૦', deposit: '૫૦૦૦',total: '૧૦૩૧૦'},
		{sno: '૧૫', atithigruh: 'તરસાલી હોલ', rent: '૩૦૦૦', administrative_charge: '૧૦૦૦', gst:'૭૨૦' ,total_rent: '૪૭૨૦', deposit: '૫૦૦૦',total: '૯૭૨૦'},
		{sno: '૧૬', atithigruh: 'છત્રપતિ શિવાજ', rent: '૮૦૦૦', administrative_charge: '૧૦૦૦', gst:'૧૬૨૦' ,total_rent: '૧૦૬૨૦', deposit: '૭૫૦૦',total: '૧૮૧૨૦'},
		{sno: '૧૭', atithigruh: 'દિવાળી પુરા', rent: '૧૭૦૦૦', administrative_charge: '૧૦૦૦', gst:'૩૨૪૦' ,total_rent: '૨૧૨૪૦', deposit: '૨૦૦૦૦',total: '૪૧૨૪૦'},
		{sno: '૧૮', atithigruh: 'માંજલપુર', rent: '૨૦૦૦૦', administrative_charge: '૧૦૦૦', gst:'૩૭૮૦' ,total_rent: '૨૪૭૮૦', deposit: '30000',total: '૫૪૭૮૦'},
	  ];
	
	constructor(
		private fb: FormBuilder,
		private toaster: ToastrService,
		private bookingService: BookingService,
		private commonService: CommonService,
		private modalService: BsModalService,
		private router: Router,
		protected formService: FormsActionsService,
		private toastr: ToastrService,
	) {
		this.bookingUtils = new BookingUtils(formService, toaster);
		this.bookingService.resourceType = this.bookingConstants.ATITHIGRUH_RESOURCE_TYPE;
	}

	ngOnInit() {
		this.head_lines = `Online AtithiGruh Booking facility is the convenient and
		easy way to book the Atithigruh of Vadodara Municpal Corporation. You can
		view the availiblity details of the Atithigruh and select booking date. 
		The booking is confirmed on the successfull online / offline payment of the rent amount for selected dates.`;
        
		this.guj_line = `ઓનલાઈન અતિથિગૃહ બુકિંગ સુવિધા એ વડોદરા મ્યુનિસિપલ કોર્પોરેશનના અતિથિગૃહને બુક કરવાની અનુકૂળ અને સરળ રીત છે. તમે અતિથિગૃહની ઉપલબ્ધતા વિગતો જોઈ શકો છો અને બુકિંગ તારીખ પસંદ કરી શકો છો. પસંદ કરેલી તારીખો માટે ભાડાની રકમની સફળ ઓનલાઈન/ઓફલાઈન ચુકવણી પર બુકિંગની પુષ્ટિ થાય છે.`
		
		this.createBookingSearchForm();
		this.createAtithigruhForm();
		this.bookingLookups();
		this.getAtithigruhLists();
		this.getUserProfile();
		this.setFormControlToTabIndexMap();

		this.BookingTypeForm.controls.bookingFrom.valueChanges.subscribe(data => {
			this.BookingTypeForm.controls.bookingTo.reset();
			this.toStartDate = data;
			return;
		})
	}

	createAtithigruhForm(): void {
			
			/*Applicant Details */
			this.applicationDetails = this.fb.group({
				applicantName: [null, [Validators.required]],
				applicantMobileNo: [null, [Validators.required]],
				applicantEmailID: [null, [Validators.required, ValidationService.emailValidator, Validators.maxLength(50)]],
				applicantAddress: this.fb.group(this.addressComp.addressControls()),
				gstNo:[null,ValidationService.gstNoValidator],
			}),
			/* Booking Details */
			this.bookingDetails = this.fb.group({
				/*** Bank Accoount Details*/
				bankName: this.fb.group({
				code: [null, [Validators.required]]
				}),
				accountHolderName: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
				accountNo: [null, [Validators.required, Validators.maxLength(18), Validators.minLength(9)]],
				ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],
				/*** Booking Details*/
				//termsCondition: null,
				agree: null
			}),

			/** * form details*/
		this.atithigruhForm = this.fb.group({


			/**
			 * Applicant Details
			 */
			// accountHolderName: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
			// accountNo: [null, [Validators.required, Validators.maxLength(18), Validators.minLength(9)]],
			// applicantAddress: this.fb.group(this.addressComp.addressControls()),
			// applicantMobileNo: [{value: '', disabled: false}, Validators.required],
			// confirmMobile: [null, Validators.required],
			// applicantName: [{value: '', disabled: false}, Validators.required],

			// applicantEmailID:[{value: '', disabled: false}, Validators.required],

			// gstNo:[null,ValidationService.gstNoValidator],
			// confirmEmailID: [null, [Validators.required, ValidationService.emailValidator]],

			/**
			 * Bank Accoount Details
			 */
			// bankName: this.fb.group({
			// 	code: [null, Validators.required]
			// }),
			// ifscCode: [null, [Validators.required, ValidationService.ifscCodeValidator]],

			/**
			 * Booking Details
			*/
			// programPurpose: null,
			// termsCondition: null,
			// agree: null,

			concessionRequired: null,
			rentConcessionPercentage: null,
			depositConcessionPercentage: null,
			concessionRemarks: null,

			atithiGruhName: {
				code: null,
				name: null
			},
			bookingPurposeMaster: {
				code: null,
				name: null,
				gujName: null
			},
			bookingType: null,

			/**
			 * form details
			 */
			status: null,
			bookingDate: null,
			cancelledDate: null,
			expiryTime: null,
			bookingAppliedDate: null,
			remarks: null,
			rentRate: null,
			depositRate: null,
			totalRent: null,
			totalDeposit: null,

			id: null,
			uniqueId: null,
			version: 0,
			refNumber: null,
			resourceType: null,
			payableServiceType: null,
			resourceCode: null,
			scheduleList: []
		});
		this.commonService.createCloneAbstractControl(this.applicationDetails,this.atithigruhForm);
		this.commonService.createCloneAbstractControl(this.bookingDetails,this.atithigruhForm);	
	}

	createBookingSearchForm(): void {
		this.BookingTypeForm = this.fb.group({
			atithiGruhName: this.fb.group({
				code: [null, [Validators.required]],
				name: null
			}),
			bookingPurposeMaster: this.fb.group({
				code: [null, [Validators.required]],
				name: null
			}),
			bookingType: [null, Validators.required],
			bookingFrom: [null, Validators.required],
			bookingTo: [null, Validators.required]
		});
	}

	/**
	 * Method is used to get all lookups
	 */
	bookingLookups() {
		this.bookingService.getDataFromLookups().subscribe(resp => {
			this.BOOKING_TYPE = resp.DRAW_TYPE;
			this.PURPOSE = resp.PURPOSE.filter(_ => _.code !== 'Funeral');
			// this.BankOptions = resp.BANK;
		});
	}

	/**
	 * Method is used to get all atithigruh list
	 */
	getAtithigruhLists() {
		this.bookingService.atithigruhList().subscribe(resp => {
			this.ATITHIGRUH = resp.data;
		});
	}

	/**
	 * Use to open local guide
	 */
	loadGuideLine() {
		this.bookingService.loadGuideLine().subscribe(resp => {
			const w = window.open('about:blank');
			w.document.open();
			w.document.title = "Townhall Guide Line"
			w.document.write(resp);
			w.document.close();
		});
	}

	/**
	 * This method is use for get change value bookingType
	 * @param event - Selected event
	 */
	onBookingTypeChange(event) {
		this.BookingTypeForm.get('atithiGruhName.code').reset();
		this.BookingTypeForm.get('bookingPurposeMaster.code').reset();
		this.BookingTypeForm.get('bookingFrom').reset();
		this.BookingTypeForm.get('bookingTo').reset();

		if (event === "Regular booking") {
			this.BookingTypeForm.get('bookingFrom').enable();
			this.bookingForRegular = true;
			this.BookingTypeForm.get('bookingFrom').setValidators(Validators.required);
			this.BookingTypeForm.get('bookingTo').setValidators(Validators.required);
		} else if (event === 'Advance booking') {

			 if (this.formatAMPM()) {
				//dable
				this.toaster.warning('Booking Not available after 2 PM ');
				this.BookingTypeForm.get('bookingFrom').disable();
			 } else {
				this.BookingTypeForm.get('bookingFrom').enable();
				this.toStartBookDate = moment(new Date()).add(120, 'days').endOf('day').format('YYYY-MM-DD');
				this.toEndBookDate = moment(new Date()).add(120, 'days').endOf('day').format('YYYY-MM-DD');
			 }
			//this.toStartBookDate = moment(new Date()).add(120, 'days').endOf('day').format('YYYY-MM-DD');
			//this.toEndBookDate = "";
			this.bookingForRegular = false;
			this.BookingTypeForm.get('bookingFrom').setValidators(Validators.required);
			//this.BookingTypeForm.get('bookingFrom').clearValidators();
			this.BookingTypeForm.get('bookingTo').clearValidators();
		}

		// this.BookingTypeForm.get('bookingFrom').updateValueAndValidity();
		this.BookingTypeForm.get('bookingTo').updateValueAndValidity();
		this.BookingTypeForm.get('bookingFrom').updateValueAndValidity();
	}

	formatAMPM() {
		var now = moment();
		var hourToCheck = (now.day() !== 0)?14:0;
		var dateToCheck = now.hour(hourToCheck).minute(0);
		console.log("now:"+now+",hourToCheck:"+hourToCheck+",dateToCheck:"+dateToCheck);
		console.log("moment().isAfter(dateToCheck):"+moment().isAfter(dateToCheck));
		return moment().isAfter(dateToCheck);


	}


	onDateChange(fieldName, date) {
		this.BookingTypeForm.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
		this.Dates = [];
	}

	/**
	 * This method is use for search atithigruh availability
	 */
	searchBooking() {
		this.selectedShift = []
		if(this.BookingTypeForm.get('bookingFrom').value == null){
			this.toaster.warning(this.bookingUtils.ALL_FEILD_REQUIRED_MESSAGE);
			return;
		}

		if (this.BookingTypeForm.valid) {
			/**
			 * Filter Object to get list of available dates.
			 */
			let filterData = {
				resourceName: this.BookingTypeForm.get('atithiGruhName.code').value,
				startDate: this.BookingTypeForm.get('bookingFrom').value,
				endDate: this.bookingForRegular ? this.BookingTypeForm.get('bookingTo').value : this.BookingTypeForm.get('bookingFrom').value,
			}
			/**
			 * calling api to get all available slots.
			 */
			if (this.bookingForRegular) {
				this.bookingService.getAllSlots(filterData).subscribe(resp => {

					this.filteredReponse = resp;
					let temp = resp.data.scheduleList;
					this.Dates = temp.sort((a, b) => {
						if ((new Date(a.key).getTime()) >= (new Date(b.key).getTime())) {
							return 1
						} else {
							return -1
						}
					});
					this.availableStots = resp.data;
				}, err => {
					if (err && err.error)
						this.toaster.error(err.error[0].message);
				});
			} else {
				this.getReferenceForAdvanceBooking();
			}
			  // display Search Details on Atithigruh Booking Details Tab
               this.atithigruhName = this.atithigruhName,
			   this.purpose = this.purpose,
			   this.startDate = this.BookingTypeForm.get('bookingFrom').value,
			   this.endDate = this.bookingForRegular ? this.BookingTypeForm.get('bookingTo').value : this.BookingTypeForm.get('bookingFrom').value
		} else {
			this.toaster.warning(this.bookingUtils.ALL_FEILD_REQUIRED_MESSAGE);
			this.bookingUtils.getAllErrors(this.BookingTypeForm);
		}

	}

	getReferenceForAdvanceBooking() {

		let shortListData = {
			atithiGruhName: this.BookingTypeForm.get('atithiGruhName').value,
			bookingPurposeMaster: this.BookingTypeForm.get('bookingPurposeMaster').value,
			bookingFrom: this.BookingTypeForm.get('bookingFrom').value,
			bookingTo: this.BookingTypeForm.get('bookingFrom').value,
			bookingType: this.BookingTypeForm.get('bookingType').value
		}

		this.bookingService.generateReference(shortListData).subscribe(resp => {
			if (resp) {
				this.atithigruhForm.patchValue(resp.data);
				this.applicationDetails.patchValue(resp.data);
				this.bookingDetails.patchValue(resp.data);
        //this.atithigruhForm.get('bookingDate').setValue(moment(resp.data.bookingDate).format("DD-MM-YYYY"));
				if(resp.data.bookingPurposeMaster.code == 'SAMUH_LAGAN'){
					this.applicationDetails.addControl('samuhLaganCoupleCount',new FormControl(5, [Validators.required, Validators.max(25),Validators.min(5)]));
					this.atithigruhForm.addControl('samuhLaganCoupleCount',new FormControl(5, [Validators.required, Validators.max(25),Validators.min(5)]));
				  }
				if (resp.data.status == this.bookingConstants.DRAFT) {
					this.bookingService.calculateFees(resp.data.refNumber).subscribe(payResp => {
						this.paymentObject = payResp.data;
						this.showSearchForm = false;
						this.showPaymentReciept = true;
						this.totalAmount = (parseInt(this.paymentObject.RENT)-parseInt(this.paymentObject.RENT_CONCESSION) + parseInt(this.paymentObject.ADMINISTRATION_CHARGES)) + parseInt(this.paymentObject.GST);
                        this.totalPayble = this.totalAmount + (parseInt(this.paymentObject.DEPOSIT_FEES)-parseInt(this.paymentObject.DEPOSIT_CONCESSION))
					}, (err) => {
						if (err && err.error)
							this.toaster.error(err.error[0].message);
					});
				}
			}

		});

	}

	/**
	* Method is used to shortlist all selected dates.
	*/
	shortlistShifts(confirmationModel: TemplateRef<any>) {
		this.selectedShift.sort((a, b) => {
			if ((new Date(a.start).getTime()) >= (new Date(b.start).getTime())) {
				return 1;
			} else {
				return -1;
			}
		});
		this.confirmRef = this.modalService.show(confirmationModel, Object.assign({ ignoreBackdropClick: true }, { class: 'gray .modal-md' }));
	}


	/**
	 * This method is use for shortlist and get fees on selected booking
	 */
	confirmShortlist() {

		if (this.selectedShift.length > 0) {

			this.isLoadingResults = true;
			let shortListData = {
				resourceCode: this.filteredReponse.data.resourceCode,
				purposeOfBooking: this.BookingTypeForm.get('bookingPurposeMaster').value,
				startDate: this.filteredReponse.data.startDate,
				endDate: this.filteredReponse.data.endDate,
				appointments: this.selectedShift.map(shifts => shifts.uniqueId)
			}

			this.bookingService.shortListBookings(shortListData).subscribe(resp => {

				this.showSearchForm = false;
				this.atithigruhForm.patchValue(resp.data);
				this.applicationDetails.patchValue(resp.data);
				this.bookingDetails.patchValue(resp.data);
				//this.atithigruhForm.get('bookingDate').setValue(moment(resp.data.bookingDate).format("DD-MM-YYYY"));
				if(resp.data.bookingPurposeMaster.code == 'SAMUH_LAGAN'){
					this.applicationDetails.addControl('samuhLaganCoupleCount',new FormControl(5, [Validators.required, Validators.max(25),Validators.min(5)]));
					this.atithigruhForm.addControl('samuhLaganCoupleCount',new FormControl(5, [Validators.required, Validators.max(25),Validators.min(5)]));
				  }
				this.addressComp.getCountryLists();
				if (resp.data.status == this.bookingConstants.DRAFT) {
					this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
						this.paymentObject = payResp.data;
						this.showPaymentReciept = true;
						this.confirmRef.hide();
						this.totalAmount = (parseInt(this.paymentObject.RENT)-parseInt(this.paymentObject.RENT_CONCESSION) + parseInt(this.paymentObject.ADMINISTRATION_CHARGES)) + parseInt(this.paymentObject.GST);
                        this.totalPayble = this.totalAmount + (parseInt(this.paymentObject.DEPOSIT_FEES)-parseInt(this.paymentObject.DEPOSIT_CONCESSION))

					}, (err) => {
						if (err && err.error)
							this.toaster.error(err.error[0].message);
					});
				}
			}, (err) => {
				if (err && err.error)
					this.toaster.error(err.error[0].message);
			});
		} else {
			this.toaster.warning(this.bookingConstants.SELECT_SLOT_MESSAGE);
		}
		// display Search Details on Atithigruh Booking Details Tab
			this.atithigruhName = this.atithigruhName,
			this.purpose = this.purpose
			this.startDate = this.selectedShift[0].start
			this.endDate = this.selectedShift[1].end
	}

	/**
	 * This method is use to search submit booking details
	 */
	submit(): void {

		let errCount = this.bookingUtils.getAllErrors(this.atithigruhForm);
		if (this.atithigruhForm.invalid) {
			//this.handleErrorsOnSubmit();
			this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
			return;
		}
		else if (!this.atithigruhForm.get('agree').value) {
			this.commonService.openAlert("Field Error", this.bookingConstants.AGREE_MESSAGE, 'warning')
			return;
		}  else {
			if (this.bookingForRegular) {
				this.bookingService.commonBookSlot(this.atithigruhForm.getRawValue()).subscribe(resp => {
				}, (err) => {
					if (err.status == 402) {
						let refNumber = this.atithigruhForm.get("refNumber").value;
						this.sendMail(refNumber, "SUBMIT");
						// this.bookingUtils.redirectToPayment(err, this.commonService, this.bookingService,this.atithigruhForm, this.router);
						this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway ,this.atithigruhForm, this.router);
						return;
					} else if (err.error[0].code == this.bookingConstants.INVALID_BOOKING_STATUS) {
						this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "", cb => {
							this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL])
						})
					} else {
						this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
					}
				});
				return;
			} else {

				let ifscCode = this.atithigruhForm.get('ifscCode').value;
				this.atithigruhForm.get('ifscCode').setValue(ifscCode.toUpperCase());

				this.bookingService.submitAdvanceBooking(this.atithigruhForm.getRawValue()).subscribe(resp => {
					this.commonService.commonAlert("Atithigruh Booking", "Your application has been submitted.", "success", "Print Acknowledgement Receipt", false, '', pA => {
						let sectionToPrint: any = document.getElementById('sectionToPrint');
						sectionToPrint.innerHTML = resp;
						setTimeout(() => {
							window.print();
							this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
						}, 1000);

					}, rA => {
						this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
					  });
				}, (err) => {
					console.log("fsdfsf");
					this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
				});
			}

		}
	}

	/**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
	onTabChange(evt) {
		this.tabIndex = evt;
	}

	handleErrorsOnSubmit(controlName) {
		const key = this.bookingUtils.getInvalidFormControlKey(controlName);
		const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 1;
		if (index) {
			this.tabIndex = index - 1;
			return false;
		}
	}

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	// handleErrorsOnSubmit(count) {
	// 	let step1 = 4;
	// 	let step2 = 11;
	// 	let step3 = 17;
	// 	if (count < step1) {
	// 		this.tabIndex = 0;
	// 		return false;
	// 	} else if (count < step2) {
	// 		this.tabIndex = 1;
	// 		return false;
	// 	} else if (count < step3) {
	// 		this.tabIndex = 2;
	// 		return false;
	// 	}
	// }

	/**
	 * This method use to get the profile data using api
	 */
	getUserProfile() {
		this.formService.getUserProfile().subscribe(res => {
			this.profileObj = res.data;
		});
	}

	setDefaultValue(){
		this.applicationDetails.get('applicantName').setValue(this.profileObj.firstName + ' ' + this.profileObj.lastName);
		this.applicationDetails.get('applicantEmailID').setValue(this.profileObj.email);
		this.applicationDetails.get('applicantMobileNo').setValue(this.profileObj.cellNo);
	}

	patchValue2(){
		const data = {
		  "applicantName": "jkljkl",
		  "applicantMobileNo": "4151512121",
		  "confirmMobile": "4151512121",
		  "applicantEmailID": "fdgdfh@gmail.com",
		  "confirmEmailID": "fdgdfh@gmail.com",
		  "applicantAddress": {
			"buildingName": "1",
			"streetName": "ddfsdf",
			"landmark": "dfsdfsdf",
			"area": "dfsdf",
			"state": "GUJARAT",
			"city": "Vadodara",
			"country": "INDIA",
			"pincode": "151212"
		  },
		  "termsCondition": true,
		  "agree": true,
		  "remarks": null,
		  "bankName": {
			"code": "ALLAHABAD_BANK"
		  },
		  "accountHolderName": "dfsd",
		  "accountNo": "23423423423",
		  "ifscCode": "SBIN0000000"
		};
		this.atithigruhForm.patchValue(data);
	}

	setFormControlToTabIndexMap() {
		// First tab
		this.formControlNameToTabIndex.set('applicantName', 1)
		this.formControlNameToTabIndex.set('applicantMobileNo', 1)
		this.formControlNameToTabIndex.set('applicantEmailID', 1)
		this.formControlNameToTabIndex.set('applicantAddress', 1)
		// second tab

		this.formControlNameToTabIndex.set('bankName', 2)
		this.formControlNameToTabIndex.set('accountHolderName', 2)
		this.formControlNameToTabIndex.set('accountNo', 2)
		this.formControlNameToTabIndex.set('ifscCode', 2)
	  }

	sendMail(refNumber: any, eventType: any) {
		if (refNumber) {
		  this.bookingService.sendMail(refNumber, eventType).subscribe(resp => {
		  }, err => {
			this.toastr.error("Something went wrong");
		  })
		} else {
		  this.toastr.error("Invalid request");
		}
	  }

	clickProcess(event){
		if(event.checked == true){
            this.btnProceed = false;
	    }else{
	        this.btnProceed = true;
	    }
	  }
	
	onAtithiGruhNameChange(event) {
		this.ATITHIGRUH.forEach(element => {
			if (element.code == event) {
				this.atithigruhName = element.name
			}
		});
	}

	onPurposeChange(event) {
		this.PURPOSE.forEach(ele => {
			if (ele.code == event) {
				this.purpose = ele.name
			}
		})
	}

	checkValidation(controlName,isSubmitted){
		if(controlName.invalid){
			this.handleErrorsOnSubmit(controlName)
		}else{
			const organizationalAry = Object.keys(controlName.value);
			organizationalAry.forEach(element => {
				this.atithigruhForm.get(element).setValue(controlName.get(element).value);
			});
			this.commonService.setValueToFromControl(controlName,this.atithigruhForm);
			this.tabIndex= this.tabIndex +1;
			if(isSubmitted){
				this.submit(); 
			}
		}
	}

	selectLanguage(event) {
		this.btnProceed = true;
		if (event == 'gu') {
			this.showSelectLanguage = true
		}
		else {
			this.showSelectLanguage = false
		}

	}
}
