import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

	dataSource = new MatTableDataSource();

	pageSize: number = 5;
	bookedPageSize: number = 5;
	confirmRef: BsModalRef;
	displayedColumns: Array<string> = ['id', 'shiftType', 'bookingDate', 'startTime', 'endTime', 'rent', 'electricCharges', 'administrationCharges', 'showTax', 'subTotal', 'gstAmount', 'total'];
	profileObj : any;

	constructor(
		private fb: FormBuilder,
		private toaster: ToastrService,
		private bookingService: BookingService,
		private commonService: CommonService,
		private modalService: BsModalService,
		private router: Router,
		protected formService: FormsActionsService,
	) {
		this.bookingUtils = new BookingUtils(formService, toaster);
		this.bookingService.resourceType = this.bookingConstants.ATITHIGRUH_RESOURCE_TYPE;
	}

	ngOnInit() {
		this.head_lines = `Online AtithiGruh Booking facility is the convenient and
		easy way to book the town hall of Vadodara Municpal Corporation. You can
		view the availiblity details of the town hall and select select one of multiple shifts for
		booking. The booking is confirmed on the successfull online payment of the rent amount
		for selected shift(s).`;

		this.createBookingSearchForm();
		this.createAtithigruhForm();
		this.bookingLookups();
		this.getAtithigruhLists();
		this.getUserProfile();

		this.BookingTypeForm.controls.bookingFrom.valueChanges.subscribe(data => {
			this.BookingTypeForm.controls.bookingTo.reset();
			this.toStartDate = data;
			return;
		})
	}

	createAtithigruhForm(): void {
		this.atithigruhForm = this.fb.group({
			

			/**
			 * Applicant Details
			 */
			// accountHolderName: [null, [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
			// accountNo: [null, [Validators.required, Validators.maxLength(18), Validators.minLength(9)]],
			applicantAddress: this.fb.group(this.addressComp.addressControls()),
			applicantMobileNo: [{value: '', disabled: true}, Validators.required],
			// confirmMobile: [null, Validators.required],
			applicantName: [{value: '', disabled: true}, Validators.required],
			
			applicantEmailID:[{value: '', disabled: true}, Validators.required],

			gstNo:[null,ValidationService.gstNoValidator],
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
			programPurpose: null,
			termsCondition: null,
			agree: null,

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
			this.PURPOSE = resp.PURPOSE;
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
		
		return moment().isAfter(dateToCheck);
		
		
	}


	onDateChange(fieldName, date) {
		this.BookingTypeForm.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method is use for search atithigruh availability
	 */
	searchBooking() {
		
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
				if (resp.data.status == this.bookingConstants.DRAFT) {
					this.bookingService.calculateFees(resp.data.refNumber).subscribe(payResp => {
						this.paymentObject = payResp.data;
						this.showSearchForm = false;
						this.showPaymentReciept = true;
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
				this.addressComp.getCountryLists();
				if (resp.data.status == this.bookingConstants.DRAFT) {
					this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
						this.paymentObject = payResp.data;
						this.showPaymentReciept = true;
						this.confirmRef.hide();

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
	}

	/**
	 * This method is use to search submit booking details
	 */
	submit(): void {
		
		let errCount = this.bookingUtils.getAllErrors(this.atithigruhForm);
		if (this.atithigruhForm.invalid) {
			this.handleErrorsOnSubmit(errCount);
			this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
			return;
		}
		else if (!this.atithigruhForm.get('agree').value) {
			this.commonService.openAlert("Field Error", this.bookingConstants.AGREE_MESSAGE, 'warning')
			return;
		} else if (!this.atithigruhForm.get('termsCondition').value) {
			this.commonService.openAlert("Field Error", this.bookingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning')
			return;
		} else {
			if (this.bookingForRegular) {
				
				this.bookingService.commonBookSlot(this.atithigruhForm.getRawValue()).subscribe(resp => {
				}, (err) => {
					if (err.status == 402) {
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
					this.commonService.commonAlert("Atithigruh Booking", "Atithigruh Booked Successfully", "success", "Print Acknowledgement Receipt", false, '', pA => {
						let sectionToPrint: any = document.getElementById('sectionToPrint');
						sectionToPrint.innerHTML = resp;
						setTimeout(() => {
							window.print();
							this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL]);
						});

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

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
	handleErrorsOnSubmit(count) {
		let step1 = 4;
		let step2 = 11;
		let step3 = 17;
		if (count < step1) {
			this.tabIndex = 0;
			return false;
		} else if (count < step2) {
			this.tabIndex = 1;
			return false;
		} else if (count < step3) {
			this.tabIndex = 2;
			return false;
		}
	}

	/**
	 * This method use to get the profile data using api
	 */
	getUserProfile() {
		this.formService.getUserProfile().subscribe(res => {
			this.profileObj = res.data;
		});
	}

	setDefaultValue(){  
		this.atithigruhForm.get('applicantName').setValue(this.profileObj.firstName);
		this.atithigruhForm.get('applicantEmailID').setValue(this.profileObj.email);
		this.atithigruhForm.get('applicantMobileNo').setValue(this.profileObj.cellNo);
	}

	// patchValue2(){
	// 	const data = {
	// 	  "applicantName": "jkljkl",
	// 	  "applicantMobileNo": "4151512121",
	// 	  "confirmMobile": "4151512121",
	// 	  "applicantEmailID": "fdgdfh@gmail.com",
	// 	  "confirmEmailID": "fdgdfh@gmail.com",
	// 	  "applicantAddress": {
	// 		"buildingName": "1",
	// 		"streetName": "ddfsdf",
	// 		"landmark": "dfsdfsdf",
	// 		"area": "dfsdf",
	// 		"state": "GUJARAT",
	// 		"city": "Vadodara",
	// 		"country": "INDIA",
	// 		"pincode": "151212"
	// 	  },
	// 	  "termsCondition": true,
	// 	  "agree": true,
	// 	  "remarks": null,
	// 	  "bankName": {
	// 		"code": "ALLAHABAD_BANK"
	// 	  },
	// 	  "accountHolderName": "dfsd",
	// 	  "accountNo": "23423423423",
	// 	  "ifscCode": "SBIN0000000"
	// 	};
	// 	this.atithigruhForm.patchValue(data);
	//   }

}
