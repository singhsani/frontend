import { Component, OnInit, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { BookingConstants, BookingUtils } from '../../../config/booking-config';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { BookingService } from '../../../shared-booking/services/booking-service.service';
import { FormsActionsService } from '../../../../../../../core/services/citizen/data-services/forms-actions.service';
import Swal from 'sweetalert2';

export interface BookingDetails {
	administrationCharges: string
	bookingDate: string
	bookingDateTime: string
	electricCharges: any
	endTime: string
	gstAmount: any
	id: number
	rent: number
	shiftType: string
	showTax: number
	startTime: string
	subTotal: number
	total: string
	uniqueId: number
	version: number
}

@Component({
	selector: 'app-townhall-book',
	templateUrl: './townhall-book.component.html',
	styleUrls: ['./townhall-book.component.scss']
})
export class TownHallBookComponent implements OnInit {

	@ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;
	@ViewChild('address') addressComp: any;
	@ViewChild('appAddress') appAddressComp: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	bookingConstants = BookingConstants;
	bookingUtils: BookingUtils;
	checkForm: boolean = false;
	refNumber : string;


	public formControlNameToTabIndex = new Map();

	/**
	 * language translate key.
	 */
	translateKey: string = 'townHallCitizenScreen';

	/**
	 * form groups.
	 */
	searchTownHallForm: FormGroup;
	townHallApplicationForm: FormGroup;
	bookingDetails : FormGroup;
	organizationDetails : FormGroup;
	applicationDetails : FormGroup
	/**
	 * Town hall form Lookups
	 */
	townHalls: Array<any> = [];
	purposes: Array<any> = [];
	selectedShift: Array<any> = [];
	// BankOptions: Array<any> = [];

	paymentObject: any;

	/**
	 * steps labels
	 */
	stepLabel1: string = 'Organization Details'
	stepLabel2: string = 'Applicant Details'
	stepLabel3: string = 'Bank Account Details'

	tabIndex: number = 0;

	/**
	 * Minimum start date.
	 */
	//startMinDate = moment(new Date()).add(1, 'day').toISOString();
	startMinDate: Date = moment(new Date()).add(7, 'day').toDate();
	/**
	 * Minimum end date.
	 */
	//endMinDate = moment(new Date()).add(1, 'day').toISOString();
	endMaxDate = moment(new Date()).add(179, 'day').toDate();
	toStartDate: Date;



	filteredReponse: any;

	/**
	 * Available Dates for Shortlist.
	 */
	Dates: Array<any> = [];
	//endMaxDate:any = new Date();
	endMinDate: any = new Date;
	maxEndDate: any;

	/**
	 * Bank Lookups
	 */

	availableStots: Array<any> = [];
	displayedColumns: Array<string> = ['id', 'bookingDate', 'shiftType', 'startTime', 'endTime', 'rent', 'electricCharges', 'administrationCharges', 'showTax', 'subTotal', 'gstAmount', 'total'];

	bookingDetailsDataSource = new MatTableDataSource<BookingDetails>([]);

	// disableDateList: Array<any> = ['2018-08-01', '2018-09-02', '2018-08-03', '2018-08-15'];

	/**
	 * Used to show headlines.
	 */
	head_lines: string;

	/**
	 * Flages
	 */
	guideLineFlag: boolean = true;
	showApplicationForm: boolean = false;
	showSearchForm: boolean = false;
	showPaymentReciept: boolean = false;
	isLoadingResults: boolean = false;
	show: boolean = false;
	shortlistData: BookingDetails[];
	btnProceed : boolean = true;
	showSelectLanguage : boolean = true

	constructor(
		private fb: FormBuilder,
		private commonService: CommonService,
		private bookingService: BookingService,
		private toster: ToastrService,
		private router: Router,
		private CD: ChangeDetectorRef,
		protected formService: FormsActionsService,
		protected toaster: ToastrService
	) {
		this.bookingUtils = new BookingUtils(formService, toaster);
		this.bookingService.resourceType = this.bookingConstants.TOWNHALL_RESOURCE_TYPE;
	}

	/**
	 * Method Initializes first after constructor.
	 */
	ngOnInit() {
		/**
		 * Static headlines
		 */
		window.scrollTo(0, 0);
		this.head_lines = `Online Town Hall Booking facility is the convenient and
		easy way to book the town hall of Vadodara Municpal Corporation. You can
		view the availiblity details of the town hall and select select one of multiple shifts for
		booking. The booking is confirmed on the successfull online payment of the rent amount
		for selected shift(s).`;
		this.createTownHallAvailiblityForm();
		this.createTownHallBookingApplicationForm();
		this.getTownHallResourceList();
		this.bookingLookups();
		/**
		 * Subscribe start date changes
		 */
		this.searchTownHallForm.controls.startDate.valueChanges.subscribe(data => {
			this.searchTownHallForm.controls.endDate.reset();
			this.endMinDate = data;
			this.toStartDate = data;
			return;
		});

		this.setFormControlToTabIndexMap();

	}


	loadGuideLine() {
		this.bookingService.loadGuideLine().subscribe(resp => {
			const w = window.open('about:blank');
			w.document.open();
			w.document.title = "Townhall Guide Line"
			w.document.write(resp);
			w.document.close();
		})
	}

	/**
	 * Method is used to create town hall search form.
	 */
	createTownHallAvailiblityForm() {
		this.searchTownHallForm = this.fb.group({
			code: [null, [Validators.required]],
			purpose: this.fb.group({
				code: [null, [Validators.required]],
				name: null
			}),
			startDate: [null, Validators.required],
			endDate: [null, Validators.required]
		});
	}

	/**
	 * Method is used to create townhall booking application form.
	 */
	createTownHallBookingApplicationForm() {
		console.log("hello");
			/*Organization Details*/
			this.organizationDetails = this.fb.group({
				organizationName: [null, [Validators.required]],
				orgTelephoneNo: [null, [Validators.required,ValidationService.telPhoneNumberValidator]],
				organizationPresidentName: [null, [Validators.required]],
				organizationAddress: this.fb.group(this.addressComp.addressControls()),
				gstNo: [null, ValidationService.gstNoValidator],
				programmeName: [null, [Validators.required]],
			}),
			/*Applicant Details */
			this.applicationDetails = this.fb.group({
				applicantName: [null, [Validators.required]],
				applicantMobile: [null, [Validators.required]],
				confirmMobile: [null, [Validators.required]],
				emailID: [null, [Validators.required, ValidationService.emailValidator, Validators.maxLength(50)]],
				confirmEmailID: [null, [Validators.required, ValidationService.emailValidator, Validators.maxLength(50)]],
				relationshipWithOrg: [null, [Validators.required]],
				applicantAddress: this.fb.group(this.appAddressComp.addressControls()),
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
				programShortDetails: [null, [Validators.required]],
				programPurpose: [null, [Validators.required]],
				termsCondition: null,
				agree: null,
			}),

		this.townHallApplicationForm = this.fb.group({
			/** * form details*/
			id: null,
			idfcCode: null,
			refNumber: null,
			remarks: null,
			status: null,
			uniqueId: null,
			version: 0,
			bookingDate: [null, [Validators.required]],
			// bookingFrom: [null, [Validators.required]],
			// bookingTo: [null, [Validators.required]],
			cancelledDate: null,
			expiryTime: null,
			policePerformanceLicense: null,
			bookingPurposeMaster: this.fb.group({
				code: [null, [Validators.required]],
				name: null
			})
		});
		this.commonService.createCloneAbstractControl(this.applicationDetails,this.townHallApplicationForm);
		this.commonService.createCloneAbstractControl(this.organizationDetails,this.townHallApplicationForm);
		this.commonService.createCloneAbstractControl(this.bookingDetails,this.townHallApplicationForm);		
	}

	/**
	 * This method use for set the date in form controls
	 * @param date get the selected date value
	//  */
	onDateChange(date) {
		let futureMonth = moment(date).add(3, 'month');
		//  this.endMaxDate = moment(futureMonth).format("YYYY-MM-DD");
	}

	/**
	 * Method is used to get all townhall resources list.
	 */
	getTownHallResourceList() {
		this.bookingService.getResourceList().subscribe(res => {
			this.townHalls = res.data;
		},
			err => {
				this.toster.error(err.error.error_description);
			}
		);
	}

	/**
	 * Method is used to get all lookups
	 */
	bookingLookups() {
		this.bookingService.getDataFromLookups().subscribe(resp => {
			this.purposes = resp.PURPOSE;
			// this.BankOptions = resp.BANK;
		});
	}

	/**
	 * Method is used to get available slot wise townhalls.
	 */
	searchBooking() {
		this.selectedShift = [];
		if (this.searchTownHallForm.valid) {
			this.isLoadingResults = true;
			/**
			 * Filter Object to get list of available dates.
			 */
			let filterData = {
				resourceName: this.searchTownHallForm.get('code').value,
				startDate: moment(this.searchTownHallForm.get('startDate').value).format("YYYY-MM-DD"),
				endDate: moment(this.searchTownHallForm.get('endDate').value).format("YYYY-MM-DD"),
			}
			/**
			 * calling api to get all available slots.
			 */
			this.bookingService.getAllSlots(filterData).subscribe(resp => {
				this.filteredReponse = resp;
				let temp = resp.data.scheduleList;
				if (temp) {
					this.Dates = temp.sort((a, b) => {
						if ((new Date(a.key).getTime()) >= (new Date(b.key).getTime())) {
							return 1
						} else {
							return -1
						}
					});

				} else {
					this.commonService.openAlertFormSaveValidation('Warning!', "Schedule List Not Found", 'warning');
				}
				this.availableStots = resp.data;
				this.isLoadingResults = false;
			}, err => {
				this.isLoadingResults = false;
				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
			});
		} else {
			this.bookingUtils.getAllErrors(this.searchTownHallForm);
			this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning', '', cb => {
				window.scrollTo(0, 0);
			})
		}
	}

	/**
	 * Method is used to shortlist all selected dates.
	 */
	shortlistShifts() {
		this.selectedShift.sort((a, b) => {
			if ((new Date(a.start).getTime()) >= (new Date(b.start).getTime())) {
				return 1;
			} else {
				return -1;
			}
		});
	}

	/**
	 * Method is used to shortlist selected townhalls.
	 */
	confirmShortlist() {
		if (this.selectedShift.length > 0) {
			this.isLoadingResults = true;
			let shortListData = {
				resourceCode: this.filteredReponse.data.resourceCode,
				purposeOfBooking: this.searchTownHallForm.get('purpose').value,
				startDate: this.filteredReponse.data.startDate,
				endDate: this.filteredReponse.data.endDate,
				appointments: this.selectedShift.map(shifts => shifts.uniqueId)
			}
			this.bookingService.shortListBookings(shortListData).subscribe(resp => {
				this.showSearchForm = false;
				this.townHallApplicationForm.patchValue(resp.data);
				this.bookingDetails.patchValue(resp.data);
				this.organizationDetails.patchValue(resp.data);
				this.applicationDetails.patchValue(resp.data);
				this.addressComp.getCountryLists();
				this.appAddressComp.getCountryLists();
				this.refNumber = resp.data.refNumber;

				if (resp.data.status == this.bookingConstants.DRAFT) {
					this.bookingService.searchPayment(resp.data.refNumber).subscribe(payResp => {
						this.paymentObject = payResp.data;
						// this.bookingDetailsDataSource.data = payResp.data.bookingDetails as BookingDetails[];
						this.shortlistData = payResp.data.bookingDetails as BookingDetails[];
						this.bookingDetailsDataSource.data = this.shortlistData.sort((a, b) => {
							return (<any>new Date(a.bookingDateTime) - (<any>new Date(b.bookingDateTime)))
						});
						this.CD.detectChanges();
						this.showPaymentReciept = true;
						this.CD.detectChanges();
						this.bookingDetailsDataSource.paginator = this.paginator;
						this.paginator.pageSize = 5;
						this.paginator.pageIndex = 0;
						this.isLoadingResults = false;
					});
				}
			}, (err) => {
				this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
				this.isLoadingResults = false;
			});
		} else {
			this.toster.show(this.bookingConstants.SELECT_SHIFT_MESSAGE);
		}
	}

	onChangePurposeOfBooking(event) {

		// if (event == 'NATAK') {
		// 	this.show = true;
		// 	this.townHallApplicationForm.get('programmeName').setValidators([Validators.required]);
		// } else {
		// 	this.show = false;
		// }

	}



	/**
	 * Method is used to submit townhall application form.
	 */
	submitTownhallApplication() {
		if(this.checkForm){
			return;
		  }
        this.townHallApplicationForm.get('termsCondition').setValue(true)
		if (this.townHallApplicationForm.invalid && this.checkForm == false) {
		//	this.handleErrorsOnSubmit();
			this.commonService.openAlert("Field Error", this.bookingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning')
			return;
		}
		else if (this.checkForm == false &&  !this.bookingUtils.matcher(this.townHallApplicationForm, 'emailID', 'confirmEmailID') || !this.bookingUtils.matcher(this.townHallApplicationForm, 'applicantMobile', 'confirmMobile')) {
		//	this.handleErrorsOnSubmit();
			this.commonService.openAlert("Field Error", !this.bookingUtils.matcher(this.townHallApplicationForm, 'emailID', 'confirmEmailID') ? this.bookingConstants.EMAIL_MIS_MATCH_MESSAGE : this.bookingConstants.MOB_NO_MIS_MATCH_MESSAGE, 'warning')
			return;
		} else if (this.checkForm == false &&  !this.townHallApplicationForm.get('agree').value) {
			this.commonService.openAlert("Field Error", this.bookingConstants.AGREE_MESSAGE, 'warning')
			return;
		} else if (this.checkForm == false &&  !this.townHallApplicationForm.get('termsCondition').value) {
			this.commonService.openAlert("Field Error", this.bookingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning')
			return;
		} else {
			this.isLoadingResults = true;
			this.bookingService.commonBookSlot(this.townHallApplicationForm.value).subscribe(resp => {
			}, (err) => {
				this.isLoadingResults = false;
				if (err.status == 402) {
					this.bookingUtils.redirectToCCAvenuePayment(err, this.commonService, this.bookingService, this.paymentGateway, this.townHallApplicationForm, this.router);
					// this.bookingUtils.redirectToPayment(err, this.commonService, this.bookingService, this.townHallApplicationForm, this.router);
					return;
				} else if (err.error[0].code == this.bookingConstants.INVALID_BOOKING_STATUS) {
					this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "", cb => {
						this.router.navigate([this.bookingConstants.MY_BOOKINGS_URL])
					})
				} else {
					this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
				}
			})
			return;
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
	handleErrorsOnSubmit(controlName) {

		const key = this.bookingUtils.getInvalidFormControlKey(controlName);
		const index = this.formControlNameToTabIndex.get(key) ? this.formControlNameToTabIndex.get(key) : 0;

		this.tabIndex = index;
		return false;


	}

	setFormControlToTabIndexMap() {
		// index 2
		this.formControlNameToTabIndex.set("organizationName", 0);
		this.formControlNameToTabIndex.set("orgTelephoneNo", 0);
		this.formControlNameToTabIndex.set("organizationPresidentName", 0);
		this.formControlNameToTabIndex.set("programmeName", 0);
		this.formControlNameToTabIndex.set("organizationAddress", 0);
		// index 1
		this.formControlNameToTabIndex.set("applicantName", 1);
		this.formControlNameToTabIndex.set("applicantMobile", 1);
		this.formControlNameToTabIndex.set("confirmMobile", 1);
		this.formControlNameToTabIndex.set("emailID", 1);
		this.formControlNameToTabIndex.set("confirmEmailID", 1);
		this.formControlNameToTabIndex.set("relationshipWithOrg", 1);
		this.formControlNameToTabIndex.set("applicantAddress", 1);

		// index 2
		this.formControlNameToTabIndex.set('bankName', 2)
		this.formControlNameToTabIndex.set('accountHolderName', 2)
		this.formControlNameToTabIndex.set('accountNo', 2)
		this.formControlNameToTabIndex.set('ifscCode', 2)
		this.formControlNameToTabIndex.set('programShortDetails', 2)
		this.formControlNameToTabIndex.set('programPurpose', 2)

	}
	/**
	 * Get user data
	 */
	getUserProfile() {
		this.bookingService.getUserProfile().subscribe(resp => {
			this.applicationDetails.get('applicantName').setValue(resp.data.firstName + ' ' + resp.data.lastName);
			this.applicationDetails.get('emailID').setValue(resp.data.email);
			this.applicationDetails.get('applicantMobile').setValue(resp.data.cellNo);
			this.applicationDetails.get('confirmMobile').setValue(resp.data.cellNo);
			this.applicationDetails.get('confirmEmailID').setValue(resp.data.email);
		},
			err => {
				this.toster.error("Server Error");
			});
		this.applicationDetails.get('applicantAddress').get('country').setValue('INDIA');
		this.applicationDetails.get('applicantAddress').get('state').setValue('GUJARAT');
		this.applicationDetails.get('applicantAddress').get('city').setValue('Vadodara');
	}

	getClass(shift) {
		let shiftCount = shift.length;
		let availableCount = shift.filter(s => s.slotStatus === "AVAILABLE").length;
		let bookedCount = shift.filter(s => s.slotStatus === "BOOKED").length;
		let reservedCount = shift.filter(s => s.slotStatus === "RESERVED").length;
		let temporaryBlockCount = shift.filter(s => s.slotStatus === "TEMPORARY_BLOCKED").length;

		return shiftCount === reservedCount || shiftCount === temporaryBlockCount || shiftCount === bookedCount ? 'bookDate' : '';
	}

	onChangeTownHalls(data) {
		this.bookingService.getAvailableStots(data).subscribe(respData => {
			this.maxEndDate = moment(respData.data.endDate, "DD-MM-YYYY").toDate();
		})

		if(data == undefined){
			this.Dates=[];
		  }
	}

  canclebtn(){
	this.checkForm = true;
    this.townHallApplicationForm.controls['applicantName'].setErrors(null);
    this.townHallApplicationForm.controls['applicantMobile'].setErrors(null);
    this.townHallApplicationForm.controls['confirmMobile'].setErrors(null);
    this.townHallApplicationForm.controls['emailID'].setErrors(null);
    this.townHallApplicationForm.controls['confirmEmailID'].setErrors(null);
    this.townHallApplicationForm.controls['relationshipWithOrg'].setErrors(null);
    this.townHallApplicationForm.controls['organizationName'].setErrors(null);
    this.townHallApplicationForm.controls['orgTelephoneNo'].setErrors(null);
    this.townHallApplicationForm.controls['organizationPresidentName'].setErrors(null);
    this.townHallApplicationForm.controls['programmeName'].setErrors(null);
    this.townHallApplicationForm.controls['programShortDetails'].setErrors(null);
    this.townHallApplicationForm.controls['programPurpose'].setErrors(null);


    let cancelDirect = {
      title: 'Are you sure Do you wan to cancel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
      imageUrl: this.commonService.imageUrls("warning"),
			imageClass: 'doneIcon',
    }
	Swal(cancelDirect as any).then((result111) => {
		if(result111.value){
		 this.bookingService.getSlotAvillable(this.refNumber).subscribe(res => console.log(res));
		  const currentRoute   =  this.router.url;
				this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
				this.router.navigate([currentRoute]);
			  });
		}else{
			this.checkForm = false
			this.townHallApplicationForm.touched
  
		}
	  })
	}

	downloadGuidLineDocumemnt(fileName: any) {
		this.bookingService.downloadGuidLineDocumemnt(fileName, 'application/pdf').subscribe(resp => {
	
		  var newBlob = new Blob([resp], { type: "application/pdf" });
	
		  // IE doesn't allow using a blob object directly as link href
		  // instead it is necessary to use msSaveOrOpenBlob
		  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(newBlob);
			return;
		  }
		  // For other browsers: 
		  // Create a link pointing to the ObjectURL containing the blob.
		  const data = window.URL.createObjectURL(newBlob);
	
		  var link = document.createElement('a');
		  link.href = data;
		  link.download = fileName;
		  // this is necessary as link.click() does not work on the latest firefox
		  link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
	
		  setTimeout(function () {
			// For Firefox it is necessary to delay revoking the ObjectURL
			window.URL.revokeObjectURL(data);
			link.remove();
		  }, 100);
		},
	
		  err => {
			this.toaster.error("Server Error");
		  })
	
	  }
	  checkValidation(controlName,isSubmitted){
		if(controlName.invalid){
			this.handleErrorsOnSubmit(controlName)
		}else{
			const organizationalAry = Object.keys(controlName.value);
			organizationalAry.forEach(element => {
				this.townHallApplicationForm.get(element).setValue(controlName.get(element).value);
			});
			this.commonService.setValueToFromControl(controlName,this.townHallApplicationForm);
			this.tabIndex= this.tabIndex +1;
			if(isSubmitted){
				this.submitTownhallApplication(); 
			}
		}
}
clickProcess(event) {
	if (event.checked == true) {
		this.btnProceed = false;
		this.townHallApplicationForm.get('termsCondition').setValue(event.checked)	

	} else {
		this.btnProceed = true;
		this.townHallApplicationForm.get('termsCondition').setValue(event.checked)	
		
	}
}
	convertshiftType(shiftType) {
		if (shiftType == "FIRST") {
			return shiftType = 'First'
		}
		else if (shiftType == "SECOND") {
			return shiftType = 'Second'
		}
		else {
			return shiftType = 'Third'
		}

	}
	selectLanguage(event) {
		this.btnProceed = true
		if (event == 'gu') {
			this.showSelectLanguage = true
		}
		else {
			this.showSelectLanguage = false
		}

	}


}
