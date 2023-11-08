import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as moment from 'moment';
import { CommonService } from 'src/app/shared/services/common.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { BookingConstants, BookingUtils } from '../../config/booking-config';
import { BookingService } from '../../shared-booking/services/booking-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ValidationService } from 'src/app/shared/services/validation.service';

@Component({
	selector: 'app-my-booking',
	templateUrl: './my-booking.component.html',
	styleUrls: ['./my-booking.component.scss']
})
export class MyBookingComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild("templateResponseModel") templateResponseModel: TemplateRef<any>;
	@ViewChild("templateResponseModelRefundDetails") templateResponseModelRefundDetails: TemplateRef<any>;
	@ViewChild("paymentGateway") paymentGateway: any;
	@ViewChild('closebutton') closebutton;
	/**
	 * Cancel Booking Language Translation key.
	 */
	translateKey: string = 'cancelBookingCitizenScreen';

	searchBookingsForm: FormGroup;
	bookingList = new MatTableDataSource();
	refundBankDetailsForm: FormGroup;
	isAmphiCancellation: boolean = false;
	element: any;
	isBookingNoSlotNo = false;
	rejectedMessage: any;
	showReport:boolean=false;

	/**
	 * Common for all bookings
	 */
	bookingConstant = BookingConstants;
	bookingUtils: BookingUtils = new BookingUtils();

	/**
	 * Display Column
	 * 'start', 'end',
	 */
	displayedColumns: Array<string> = [];
	other_displayedColumns: Array<string> = ['id', 'applicantName', 'refNumber', 'bookingDate', 'status', 'action'];
	atithigruh_displayedColumns: Array<string> = ['id', 'applicantName', 'bookingType', 'refNumber', 'bookingDate', 'status', 'action'];


	/**
	 * ngx-bootstrap models.
	 */
	modalReqRef: BsModalRef;
	modalResRef: BsModalRef;
	modalJsonRef: BsModalRef;
	JSONdata: any;

	/**
	 * Lookups & arrays.
	 */
	resources: Array<any> = [];
	CancelSlotList: Array<any> = [];
	CancelRequestList: Array<any> = [];
	CancelResponseList: Array<any> = [];
	CANCELLATION_TYPE_LOOKUP: Array<any> = [];

	refNumber: string = null;
	cancellationType: string = null;
	ifscCode: string = null;
	bankLists: Array<any> = [];
	accountNo: string = null;
	accountHolderName: string = null;
	bankName: string = null;
	slotBookingList = [];

	/**
	 * pagination instance variables.
	 */
	resultsLength: number = 0;
	isLoadingResults: boolean = true;
	isAmphi: boolean = false;
	selectedResourceType: string = null;
	modalRef: BsModalRef;
	rejectRemarks: string = '';


	constructor(
		private fb: FormBuilder,
		public bookingService: BookingService,
		private toster: ToastrService,
		private modalService: BsModalService,
		private commonService: CommonService,
		private route: ActivatedRoute,
		private router: Router,
		private location: Location,

	) {
		let resourcesList = [
			{ type: 'townhall', name: 'Townhall' },
			{ type: 'stadium', name: 'Stadium' },
			{ type: 'amphiTheater', name: 'Amphi Theatre' },
			{ type: 'childrenTheater', name: 'Children Theatre' },
			{ type: 'shootingPermission', name: 'Shooting Permission' },
			{ type: 'swimming', name: 'Swimming Pool' },
			{ type: 'atithigruh', name: 'Atithigruh' },
		]
		this.resources = resourcesList;
	}

	/**
	 * Method Initializes first.
	 */
	ngOnInit() {
		this.searchBookingsForm = this.fb.group({
			resourceType: [null, Validators.required],
			refNumber: null
		});
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

		this.refundBankDetailsFormController();

		/**
	 * Used to initiate print hook after successfull payment
	 */
		this.route.queryParams.subscribe(d => {
			if (d.refNumber && d.resourceType && d.serviceType) {
				this.bookingService.resourceType = d.resourceType;
				this.printReceipt({ refNumber: d.refNumber }, d.serviceType);
				setTimeout(() => {
					this.location.go(this.router.url.split('?')[0]);
				}, 3000);
			}
		})
	}

	loiPayments(row) {
		this.router.navigate(['/citizen/loi-payments-booking', row.refNumber, row.resourceType, row.resourceCode]);
	}

	getAllLookUP() {
		this.bookingService.getDataFromLookups().subscribe(lookUpResp => {
			this.CANCELLATION_TYPE_LOOKUP = lookUpResp.CANCELLATION_TYPE
		})
	}

	checkedBookingCancelorNot(scheduleList, element) {
		if (element.resourceType === "CHILDREN_THEATER") {
			if (element.scheduleList.length > 0) {
				var eventDate = element.scheduleList[0].bookingDate
				var minDate = moment(eventDate).subtract(10, 'days').format('YYYY-MM-DD');
				var currentDate = moment(new Date()).format('YYYY-MM-DD');
				if (currentDate >= minDate) {
					return true;
				}
			}
		}
	}

	/**
	 * This method is use for open modal.
	 */
	openModal(template: TemplateRef<any>, scheduleList, refNumber, element) {
		if (this.checkedBookingCancelorNot(scheduleList, element)) {
			this.toster.error("Applicant can cancel booking before 10 days of event");
			return;
		}
		if (element.status === this.bookingConstant.SCRUTINY) {
			this.commonService.confirmAlert('Are you sure to cancel?', "You won't be able to revert this!", 'warning', '', performDelete => {
				let object = {
					refNumber: element.refNumber,
					cancellationType: "BY_FORCE"
				}
				this.bookingService.cancelTownHall(object).subscribe(res => {
					if (res.success) {
						this.toster.success('Successfully Cancelled');
					}
					this.getAllBooking();
				});
			});
		} else {
			// We have changed AS PER REQUIREMENT ONLY FOR AMPHITHEATER FROM BA TEAM(Prashant).
			if (this.bookingService.resourceType == 'amphiTheater') {
				this.isBookingNoSlotNo = true;
			} else {
				this.isBookingNoSlotNo = false;
			}
			this.CancelRequestList = [];
			this.refNumber = refNumber;
			this.cancellationType = null;
			this.element = element;
			this.CancelSlotList = scheduleList.sort((a, b) => {
				return (<any>new Date(a.bookingDateTime) - (<any>new Date(b.bookingDateTime)));
				// if ((new Date(a.bookingDate).getTime()) <= (new Date(b.bookingDate).getTime())) {
				// 	return 1;
				// } else {
				// 	return -1;
				// }
			});
			this.modalReqRef = this.modalService.show(template, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-lg customWidth' }));
			if (element.resourceType == "AMPHI_THEATER" || element.resourceType == "TOWNHALL" || element.resourceType == "STADIUM" || element.resourceType == "CHILDREN_THEATER" || element.resourceType == "ATITHIGRUH") {
				this.allSlotDefualtSelected();
				this.isAmphiCancellation = true;
			}
		}
	}

	/**
	 * Method is used to select perticular shift for cancel.
	 * @param shift - shift
	 * @param checked - checked event
	 */
	chooseForCancel(shift: any, checked) {
		if (checked) {
			let data = this.CancelRequestList.find(b => b == shift.bookingNo)
			if (!data && (shift.status == this.bookingConstant.DEPOSIT_REQUIRED || shift.status == this.bookingConstant.BOOKED || shift.status == this.bookingConstant.PPL_REQUIRED)) {
				this.CancelRequestList.push(shift.bookingNo);
			}
		} else {
			let data = this.CancelRequestList.findIndex(b => b == shift.bookingNo);
			if (data > -1) {
				this.CancelRequestList.splice(data, 1);
			}
		}

		this.getAllSelected();
	}

	/**
	 * Method is used to check perticular list is selected or not.
	 * @param bookingNo - booking number
	 */
	getSelected(bookingNo): boolean {
		if (this.CancelRequestList.find(b => b == bookingNo)) {
			return true;
		}
		return false;
	}

	/**
	 * Method is used to get all selected list and mark it as checked
	 */
	getAllSelected(): boolean {

		if (this.CancelRequestList.length == 0) {
			return false;
		} else {

			// If all shift are in Cancellation process. (So the shift status is either
			// CANCELLATION_APPROVED or CANCELLATION_REQUEST)

			if (this.isAllSlotInCancellation(this.CancelSlotList)) {
				return true;
			} else if (this.isAllSlotsAreSlectedByUser(this.CancelRequestList)) {
				return true;
			} else {
				return false;
			}



		}

		// return (this.CancelRequestList.length ==
		// 	this.CancelSlotList.filter(shift => shift.status == this.bookingConstant.DEPOSIT_REQUIRED ||
		// 		shift.status == this.bookingConstant.SUBMITTED ||
		// 		shift.status == this.bookingConstant.PAYMENT_REQUIRED ||
		// 		shift.status == this.bookingConstant.BOOKED).length) ||
		// 	(this.CancelSlotList.filter(shift => shift.status == this.bookingConstant.CANCELLATION_REQUEST ||
		// 		shift.status == this.bookingConstant.CANCELLATION_APPROVED).length == this.CancelSlotList.length);
	}



	isAllSlotsAreSlectedByUser(cancelRequestList): boolean {
		return cancelRequestList.length ==
			this.CancelSlotList.filter(shift => shift.status == this.bookingConstant.DEPOSIT_REQUIRED ||
				shift.status == this.bookingConstant.BOOKED ||
				shift.status == this.bookingConstant.PPL_REQUIRED).length;
	}


	isAllSlotInCancellation(cancellationList): boolean {
		return (cancellationList.filter(shift => shift.status == this.bookingConstant.CANCELLATION_REQUEST ||
			shift.status == this.bookingConstant.CANCELLATION_APPROVED).length == this.CancelSlotList.length)

	}

	/**
	 * Method is used to get all disabled shifts.
	 */
	getAllDisabled(): boolean {
		return this.CancelSlotList.filter(shift => shift.status == this.bookingConstant.CANCELLATION_REQUEST || shift.status == this.bookingConstant.CANCELLATION_APPROVED).length == this.CancelSlotList.length;
	}


	/**
	 * Method is used to choose all shifts for cancel.
	 * @param checked - checked event
	 */
	chooseAllForCancel(checked) {
		if (checked) {
			this.CancelSlotList.forEach(b => {
				this.chooseForCancel(b, true)
			})
		} else {
			this.CancelSlotList.forEach(b => {
				this.chooseForCancel(b, false)
			})
		}
	}

	/**
	 * Method is used to cancel selected bookings
	 */
	RequestCancel() {
		if (this.CancelRequestList.length && this.refNumber) {
			this.commonService.confirmAlert('Are you sure to cancel?', "You won't be able to revert this!", 'warning', '', performDelete => {
				this.modalReqRef.hide();
				// show model of refund bank details
				this.refundBankDetails(this.templateResponseModelRefundDetails, this.refNumber);
			});
		} else {
			this.toster.error("Please Select Slots");
		}
	}

	/**
	 * Get All Bookings Using API.
	 */
	getAllBooking() {
		if (this.selectedResourceType == this.bookingConstant.ATITHIGRUH_RESOURCE_TYPE) {
			this.displayedColumns = this.atithigruh_displayedColumns;
		} else {
			this.displayedColumns = this.other_displayedColumns;
		}
		this.paginator.pageSize = 5;
		this.paginator.pageIndex = 0
		this.isAmphiCancellation = false;

		if (this.searchBookingsForm.valid) {
			merge(this.sort.sortChange, this.paginator.page)
				.pipe(
					startWith({}),
					switchMap(() => {
						this.isLoadingResults = true;
						this.bookingService.resourceType = this.searchBookingsForm.get('resourceType').value;
						this.bookingService.pageIndex = (this.paginator.pageIndex + 1);
						this.bookingService.pageSize = this.paginator.pageSize;
						this.getAllLookUP();
						return this.bookingService!.getAllBookings(this.searchBookingsForm.get('refNumber').value);//NOSONAR
					}),
					map(data => {
						this.isLoadingResults = false;
						this.resultsLength = data.totalRecords;
						return data.data;
					}),
					catchError((err) => {
						//this.commonService.openAlertFormSaveValidation(err.error[0].code, err.error, "warning" )
						this.isLoadingResults = false;
						this.resultsLength = 0;
						return observableOf([]);
					})
				).subscribe(data => {
					if(data.length == 0){

						this.showReport=true;
					  }else{

						this.showReport=false;
					  }
					this.isLoadingResults = false;
					this.bookingList.data = data;
				});
		} else {
			this.bookingUtils.getAllErrors(this.searchBookingsForm);
			this.commonService.openAlert('Field Error', this.bookingConstant.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
		}
	}

	/**
	 * Used to get difference
	 * @param date- date
	 */
	diffr(date) {
		var now = moment(new Date());
		var end = moment(date);
		return end.diff(now, 'minutes');
	}

	/**
	 * This method is use to get respective class name based on application status.
	 * @param filestatus - Application Status
	 */
	getRowClass(data: any) {
		let className = '';
		if (this.diffr(data.slot.end) <= 0)
			className = 'bg-info';
		if (data.status == 'Booked' && (this.diffr(data.slot.end) > 0))
			className = 'bg-warning';
		if (data.status == 'Cancelled')
			className = 'bg-danger';
		return className;
	}

	/**
	 * Method is used to print police performance license
	 * @param element - json object
	 */
	printPolicePerformanceLicense(element) {
		if (element.refNumber) {
			this.bookingService.printPolicePerformanceLicense(element.refNumber).subscribe(respPPL => {
				let sectionToPrintPPL: any = document.getElementById('sectionToPrint');
				sectionToPrintPPL.innerHTML = respPPL;
				setTimeout(() => {
					window.print();
				});
			}, err => {
				this.commonService.openAlert('Error', err.message, 'warning');
			})
		}
	}

	/**
	 * Method is used to print Receipt.
	 * @param element - json object for receipt.
	 */
	printReceipt(element, serviceType: string) {
		this.bookingService.printReceipt(element.refNumber, serviceType).subscribe(response => {
			let sectionToPrint: any = document.getElementById('sectionToPrint');
			sectionToPrint.innerHTML = response;
			setTimeout(() => {
				window.print();
			});

		}, err => {
			if(err.status == 400){
                this.commonService.openAlert('Warning', "Your payment status is Invalid.So Not elligible for Receipt Reprint.", 'warning');
            } else {
			this.commonService.openAlert('Error', err.message, 'warning');
			}
		});
	}

	printReceiptSwimmingFees(element, serviceType: string) {
		this.bookingService.printReceipt(element.refNumber, serviceType).subscribe(response => {
			let sectionToPrint: any = document.getElementById('sectionToPrint');
			sectionToPrint.innerHTML = response;
			setTimeout(() => {
				window.print();
			});

		}, err => {
			this.commonService.openAlert('Error', err.message, 'warning');
		});
	}

	paymentRequest(element) {
		this.bookingService.getTransactionDetails(element.refNumber).subscribe(transactionData => {
		}, err => {
			if (err.status == 402) {
				this.isLoadingResults = false;
				// if (err.status == 402) {
				// this.bookingUtils.redirectToPayment(err, this.commonService, this.bookingService);
				if (element.resourceType == 'SWIMMING_POOL' || element.resourceType == 'ATITHIGRUH') {
					this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway, null, null, null, { gatewayCustomerId: err.error.data.id, txtadditionalInfo1: element.resourceType, payableServiceType: element.payableServiceType });
				} else {
					this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway);
				}
				// }
			} else if (err.error[0].code == this.bookingConstant.INVALID_BOOKING_STATUS) {
				this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "")
			} else {
				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
			}
		})
	}

	/**
	 * This method is use for open modal.
	 */
	openJSONModal(template: TemplateRef<any>) {
		this.modalJsonRef = this.modalService.show(template);
	}

	/**
	 * This method is use to show JOSN format.
	 */
	jsonDisplay(element: any) {
		// this.bookingService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.bookingService.displayJson(element.refNumber).subscribe(
			res => {
				this.JSONdata = JSON.stringify(res, null, 4);
			},
			err => {
				this.commonService.successAlert('Error!', err.error[0].message, 'error');
			}
		);
	}

	/**
	 * This method is use for copy text.
	 */
	copyText(copytext: any) {
		copytext.select();
		document.execCommand('copy');
	}
	/*
	 * This method is used for SHOW Refund Bank Details.
	 */
	refundBankDetails(template: TemplateRef<any>, refNumber: string) {
		this.refNumber = refNumber;
		this.setPropertyValues();
		this.bookingLookups();
		this.modalResRef = this.modalService.show(template);
	}
	/*
	 * For update Townhall Refund with cancel status
	 */
	submitRefundBankDetails() {
		if (this.refundBankDetailsForm.valid) {
			let object = {
				refNumber: this.refNumber,
				appointments: this.CancelRequestList,
				cancellationType: this.bookingConstant.BY_CITIZEN,
				ifscCode: this.refundBankDetailsForm.value.ifscCode,
				accountNo: this.refundBankDetailsForm.value.accountNumber,
				accountHolderName: this.refundBankDetailsForm.value.accountHolderName,
				bankCode: this.refundBankDetailsForm.value.bank.code,
				reasonForCancellation: this.refundBankDetailsForm.value.reasonForCancellation
			}
			console.log(object);
			this.bookingService.cancelTownHall(object).subscribe(res => {
				if (res.success == false && res.statusCode == "401") {
					this.toster.error(res.message);
					return;
				}
				this.CancelResponseList = res.data.detail;
				this.getAllBooking();
				//this.modalResRef = this.modalService.show(this.templateResponseModel, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-lg customWidth' }))
				this.modalResRef.hide();
				this.commonService.successAlert("Success", "Applied For Cancellation", "success");
			}, err => {
				this.toster.error(err.error.message);
			});
		} else {
			this.commonService.openAlert('Field Error', this.bookingConstant.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
		}
	}

	/*
	 * form controller for refund detail bank.
	 */
	refundBankDetailsFormController() {
		this.refundBankDetailsForm = this.fb.group({
			refNumber: [{ value: '', disabled: true }, Validators.required],
			ifscCode: ['', [Validators.required, ValidationService.ifscCodeValidator]],
			accountNumber: ['', Validators.required],
			accountHolderName: ['', Validators.required],
			bank: this.fb.group({
				code: [null],
				name: [null]
			}),
			slotBookingNo: [''],
			reasonForCancellation: ['']
		});
	}
	/*
	 * set value in form for Townhall Refund
	 */
	setPropertyValues() {
		this.refundBankDetailsForm.get('refNumber').setValue(this.refNumber);
		this.bookingService.searchByRefNumber(this.refNumber).subscribe(resp => {
			this.refundBankDetailsForm.get('ifscCode').setValue(resp['data']['ifscCode']);
			this.refundBankDetailsForm.get('accountNumber').setValue(resp['data']['accountNo']);
			this.refundBankDetailsForm.get('accountHolderName').setValue(resp['data']['accountHolderName']);
			this.refundBankDetailsForm.get('bank').get('code').setValue(resp['data']['bankName']['code']);
			var arrData = resp['data']['scheduleList'];
			arrData.forEach(arrData => {
				this.slotBookingList.push(arrData.bookingNo);
			});
			this.refundBankDetailsForm.get('slotBookingNo').setValue(this.slotBookingList.toString());
		})
	}

	/* This Method for Bank List. */
	bookingLookups() {
		this.bookingService.getBankNames().subscribe(resp => {
			this.bankLists = resp.data;
		});
	}

	showRecieptReprint(element) {
		if (element.status === this.bookingConstant.PAYMENT_REQUIRED
			|| element.status === this.bookingConstant.CANCELLED
			|| element.status === this.bookingConstant.WAITINGLIST
			|| element.status === this.bookingConstant.SCRUTINY
			|| element.status === this.bookingConstant.REJECTED
			|| (element.resourceType == 'SWIMMING_POOL' && element.status === this.bookingConstant.BOOKED)
		) {
			return false;
		}

		return true;

	}

	showCancelBtn(element) {
		// 	  if(element.resourceType === "CHILDREN_THEATER"){
		//       if(element.scheduleList.length > 0){
		//         var eventDate = element.scheduleList[0].bookingDate
		//         var minDate= moment(eventDate).subtract(10, 'days').format('YYYY-MM-DD');
		//         var currentDate = moment(new Date()).format('YYYY-MM-DD');
		//       }
		// 	  }
		this.slotBookingList.pop();
		if (element.status === this.bookingConstant.PAYMENT_REQUIRED
			|| element.status === this.bookingConstant.CANCELLED
			|| element.status === this.bookingConstant.WAITINGLIST
			|| element.status === this.bookingConstant.CANCELLATION_REQUEST
			|| element.status === this.bookingConstant.CANCELLATION_APPROVED
			|| element.resourceType === this.bookingConstant.SHOOTING_PERMISSION
			|| element.status === this.bookingConstant.REJECTED
			|| (element.resourceType === 'SWIMMING_POOL' && element.status === this.bookingConstant.APPROVED)
			|| element.status === this.bookingConstant.REFUND_REQUEST
			|| element.status === this.bookingConstant.REFUND_APPROVED
			|| element.status === this.bookingConstant.COMPLETED
			|| (element.resourceType === 'ATITHIGRUH' && element.status === this.bookingConstant.CANCELLATION_APPROVED)
			|| element.status === this.bookingConstant.PPL_REQUIRED
			|| element.status === this.bookingConstant.DEPOSIT_REQUIRED
			|| element.status === this.bookingConstant.PARTIALLY_BOOKED
			//|| (element.resourceType === "CHILDREN_THEATER" && currentDate >= minDate)
		) {
			return false;
		} else if (element.status === this.bookingConstant.SCRUTINY) {
			if ((element.resourceType === "STADIUM" && element.payableServiceType !== 'STADIUM_DEPOSIT')) {
				return true;
			} else if (element.resourceType === "CHILDREN_THEATER") {
				return true;
			} else {
				return false;
			}
		}
		// -------------hide cancel button for swimming pool----------
		if (element.resourceType === "SWIMMING_POOL") {
			return false;
		}
		else if( element.resourceType == 'SWIMMING_POOL_RENEWAL') 
        {
            return false;
        }
		// ----------------------------------------------------------
		return true;
	}
	showCancelBtnTownhall(element){
		if ((element.status === this.bookingConstant.PAYMENT_REQUIRED ||
			element.status === this.bookingConstant.EXPIRED ||
			element.status === this.bookingConstant.PARTIALLY_BOOKED ||
			element.status === this.bookingConstant.CANCELLATION_APPROVED ||
			element.status === this.bookingConstant.CANCELLATION_REQUEST ||
			element.status === this.bookingConstant.REFUND_APPROVED ||
			element.status === this.bookingConstant.REFUND_REQUEST) || !element.isCancelRequired){
			return false;
		}
		return true;
	}

	showCancelAdvanceBooking(element) {
		if (element.resourceType === 'ATITHIGRUH'
			&& element.bookingType === 'Advance booking'
			&& element.status === this.bookingConstant.PAYMENT_REQUIRED) {
			return true;

		}

		return false;

	}

	cancelAdvanceBooking(element) {

		this.commonService.submitAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			this.bookingService.cancelAdvanceBookingIfPymentNotDone(element.refNumber).subscribe(
				res => {
					this.toster.success('Booking has been Cancelled');
					this.getAllBooking();
				},
				err => {
					this.commonService.successAlert('Error!', err.error[0].message, 'error');
				}
			);
		});
	}

	showAtithiDepositReceiptBtn(element) {
		if (element.resourceType == 'ATITHIGRUH'
			&& element.status == this.bookingConstant.BOOKED) {
			return true;
		} else {
			return false;
		}
	}

	// This method  select all for cancle from AmphiTheater
	allSlotDefualtSelected() {
		this.chooseAllForCancel(true);
	}

	/**
		* Method is used to send sms on submit
		* @param refNumber
		* @param eventType
		*/
	sendSms(refNumber: any, eventType: any) {
		if (refNumber) {
			this.bookingService.sendSms(refNumber, eventType).subscribe(resp => {
			}, err => {
				this.toster.error("Something went wrong");
			})
		} else {
			this.toster.error("Invalid request");
		}
	}

	/**
	   * Method is used to send mail on submit
	   * @param refNumber
	   * @param eventType
	   */
	sendMail(refNumber: any, eventType: any) {
		if (refNumber) {
			this.bookingService.sendMail(refNumber, eventType).subscribe(resp => {
			}, err => {
				this.toster.error("Something went wrong");
			})
		} else {
			this.toster.error("Invalid request");
		}
	}

	printReceiptSwimming(element) {
		this.bookingService.printReceiptSwimming(element.refNumber).subscribe(response => {
			let sectionToPrint: any = document.getElementById('sectionToPrint');
			sectionToPrint.innerHTML = response;
			setTimeout(() => {
				window.print();
			});
		}, err => {
			if(err.status == 400){
                this.commonService.openAlert('Warning', "Your payment status is Invalid.So Not elligible for Receipt Reprint.", 'warning');
            } else {
				this.commonService.openAlert('Error', err.message, 'warning');
			}
		});
	}

	checkingBookingDateWithCurrentDate(element) {
		if (element.status === 'COMPLETED' && element.resourceType == "STADIUM") {
			return true;
		}
		return false;
	}

	depositRefundRequest(element) {
		this.bookingService.depositRefundRequest(element.refNumber).subscribe(response => {
			if (response.success) {
				this.toster.success("Refund Request Generated");
			}
			this.getAllBooking();
		}, err => {
			this.commonService.openAlert('Error', err.message, 'warning');
		});
	}

	/*use cancellation Approve Report in VM file amphitheater*/
	cancellationApproveReport(refNumber: any) {
		this.bookingService.cancellationApproveReport(refNumber).subscribe(resp => {
			this.print(resp);
		});
	}

	print(response) {
		let sectionToPrint: any = document.getElementById('sectionToPrint');
		sectionToPrint.innerHTML = response;
		setTimeout(() => {
			window.print();
		});
	}


	enableMoreAction(element) {
		if (element.status == this.bookingConstant.DRAFT || element.status == this.bookingConstant.TRANSACTION_PENDING || (element.status == this.bookingConstant.EXPIRED && element.resourceType != 'SWIMMING_POOL') || (element.resourceType == 'SWIMMING_POOL' && element.status == this.bookingConstant.APPROVED) || (element.status == this.bookingConstant.APPROVED && element.resourceType == 'STADIUM')) {
			return false;
		}
		return true;
	}

	printAcknowledge(refNumber: string) {
		this.bookingService.printAcknowledgementReceipt(refNumber).subscribe(response => {
			let sectionToPrint: any = document.getElementById('sectionToPrint');
			sectionToPrint.innerHTML = response;
			setTimeout(() => {
				window.print();
			});

		}, err => {
			this.commonService.openAlert('Error', err.message, 'warning');
		});
	}

	openRejectedModel(template: TemplateRef<any>, responseData, refNumber) {
		if (responseData.resourceType == "SWIMMING_POOL") {
			this.rejectedMessage = responseData.remarks;
		} else {
			this.rejectedMessage = responseData.newgenRemarks;
		}
		this.modalReqRef = this.modalService.show(template, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-mg' }));
	}

	acknowledgmentReceipt(element) {
		if ((element.status == this.bookingConstant.SUBMITTED || element.status == this.bookingConstant.CANCELLED && (element.resourceType == 'STADIUM' || element.resourceType == 'CHILDREN_THEATER'))) {
			return true;
		}
		else if ((element.status == this.bookingConstant.SUBMITTED || element.status == this.bookingConstant.CANCELLED || element.status == this.bookingConstant.WAITINGLIST) && element.resourceType == 'ATITHIGRUH') {
			return true;
		}
		// 		  else if(element.status == this.bookingConstant.CANCELLED && element.resourceType == 'STADIUM'){
		// 			  return true;
		// 		  }
	}
	printLOIReceipt(refNumber: string) {
		this.bookingService.getBase64StringURL(refNumber).subscribe(res => {
			if (res.success && res.displayForm) {
				this.viewBase64File(res.data);
			} else {
				this.toster.error("You will get LOI after department process will be complete");
			}
		});
	}

	viewBase64File(url) {
		var iframe = "<iframe allowfullscreen border='0' style='margin:-8px' width='100%' height='100%' src='" + url + "'></iframe>"
		var x = window.open();
		if (!x || x.closed || typeof x.closed == 'undefined') {
			this.commonService.openAlert('Pop-up!', 'Please disable your Pop-up blocker and try again.', 'warning');
			return false;
		}
		x.document.open();
		x.document.write(iframe);
		x.document.close();
	}

	showStadiumDepositReceiptBtn(element) {
		if (element.resourceType == 'STADIUM' && (element.status == this.bookingConstant.BOOKED || element.status == this.bookingConstant.COMPLETED
			|| element.status == this.bookingConstant.REFUND_APPROVED || element.status == this.bookingConstant.CANCELLATION_REQUEST
			|| element.status == this.bookingConstant.REFUND_REQUEST)) {
			return true;
		} else {
			return false;
		}
	}

	refundAcknowledgemnt(refNumber: string, serviceType: string) {
		this.bookingService.cancelAcknowledgement(refNumber, serviceType).subscribe(response => {
			let sectionToPrint: any = document.getElementById('sectionToPrint');
			sectionToPrint.innerHTML = response;
			setTimeout(() => {
				window.print();
			});

		}, err => {
			this.commonService.openAlert('Error', err.message, 'warning');
		});

	}

	selectBookingResource(event) {
		this.isAmphi = false;
		this.resultsLength = 0;
		this.isLoadingResults = false;
		if (!event) {
			this.resultsLength = 0;
			this.isLoadingResults = false;
		} else if (event == this.bookingConstant.AMPHI_RESOURCE_TYPE) {
			this.isAmphi = true;
		}
		this.selectedResourceType = this.searchBookingsForm.get('resourceType').value;
	}
	showTownhallDepositReceiptBtn(element) {
		if ((element.resourceType == 'TOWNHALL' && element.userType != 'Citizen')
			&& (element.status == this.bookingConstant.BOOKED || element.status == this.bookingConstant.COMPLETED || element.status == this.bookingConstant.CANCELLATION_REQUEST || element.status == this.bookingConstant.REFUND_REQUEST || element.status == this.bookingConstant.CANCELLATION_APPROVED) && (element.depositReceiptNo!=null)) {
			return true;
		} else {
			return false;
		}
	}

	showAtithigruhDepositReceiptBtn(element) {
		if ((element.resourceType == 'ATITHIGRUH')
			&& (element.status == this.bookingConstant.BOOKED || element.status == this.bookingConstant.COMPLETED || element.status == this.bookingConstant.CANCELLATION_REQUEST || element.status == this.bookingConstant.REFUND_REQUEST)) {
			return true;
		} else {
			return false;
		}
	}

	remarks(element){
		this.rejectRemarks = element.cancellationBooking.remarks;
	}

	remarksModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	getInnerHTML() {
		return `<b>Cancellation Remarks :</b> ${this.rejectRemarks}`;
	}
}
