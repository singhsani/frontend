/**
  * For the time being the code has been copied
  * from "My Bookings" module based on requirements this
  *  will be changed over time
**/
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BookingConstants, BookingUtils } from '../../../bookings/config/booking-config';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BookingService } from '../../../bookings/shared-booking/services/booking-service.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TicketingsService } from '../../shared-ticketing/services/ticketings.service';
import { TicketingConstants, TicketingUtils } from '../../config/ticketing-config';


@Component({
  selector: 'app-my-ticketings',
  templateUrl: './my-ticketings.component.html',
  styleUrls: ['./my-ticketings.component.scss']
})

export class MyTicketingsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("templateResponseModel") templateResponseModel: TemplateRef<any>;

	/**
	 * Cancel Booking Language Translation key.
	 */
  translateKey: string = 'cancelBookingCitizenScreen';

  searchTicketingsForm: FormGroup;
  ticketingList = new MatTableDataSource();

	/**
	 * Common for all bookings
	 */
  bookingConstant = BookingConstants;
  bookingUtils: BookingUtils = new BookingUtils();

	/**
	 * Display Column
	 * 'start', 'end',
	 */
  displayedColumns: Array<string> = ['id', 'refNumber', 'bookingDate', 'status', 'action'];

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

	/**
	 * pagination instance variables.
	 */
  resultsLength: number = 0;
  isLoadingResults: boolean = true;

  bookingList = new MatTableDataSource();

  ticketingConstants = TicketingConstants;
  ticketingUtils: TicketingUtils = new TicketingUtils();




	/**
	 * Method Initializes first.
	 */

  constructor(
    private fb: FormBuilder,
    public bookingService: BookingService,
    public ticketingService: TicketingsService,
    private toster: ToastrService,
    private modalService: BsModalService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location

  ) {
    let resourcesList = [
      { type: 'zoo', name: 'Zoo Ticketing' },
      { type: 'zooanimaladoption', name: 'Animal Adoption' },
    ]
    this.resources = resourcesList;
  }

  ngOnInit() {
    this.searchTicketingsForm = this.fb.group({
      resourceType: [null, Validators.required],
      refNumber: null
    });
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

		/**
	 * Used to initiate print hook after successfull payment
	 */
    this.route.queryParams.subscribe(d => {
      if (d.refNumber && d.resourceType && d.serviceType) {
        this.ticketingService.resourceType = d.resourceType;
        this.printReceipt({ refNumber: d.refNumber }, d.serviceType);
        setTimeout(() => {
          this.location.go(this.router.url.split('?')[0]);
        }, 3000);
      }
    })
  }

	/**
	 * This method is use for open modal.
	 */
  openModal(template: TemplateRef<any>, scheduleList, refNumber) {
    this.CancelRequestList = [];
    this.refNumber = refNumber;
    this.cancellationType = null;
    this.CancelSlotList = scheduleList.sort((a, b) => {
      if ((new Date(a.bookingDate).getTime()) <= (new Date(b.bookingDate).getTime())) {
        return 1;
      } else {
        return -1;
      }
    });
    this.modalReqRef = this.modalService.show(template, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-lg customWidth' }));
  }

	/**
	 * Method is used to select perticular shift for cancel.
	 * @param shift - shift
	 * @param checked - checked event
	 */
  chooseForCancel(shift: any, checked) {
    if (checked) {
      let data = this.CancelRequestList.find(b => b == shift.bookingNo)
      if (!data && (shift.status == this.bookingConstant.DEPOSIT_REQUIRED || shift.status == this.bookingConstant.BOOKED)) {
        this.CancelRequestList.push(shift.bookingNo);
      }
    } else {
      let data = this.CancelRequestList.findIndex(b => b == shift.bookingNo);
      if (data > -1) {
        this.CancelRequestList.splice(data, 1);
      }
    }
  }

	/**
	 * Method is used to get all selected list and mark it as checked
	 */
  getAllSelected(): boolean {
    return (this.CancelRequestList.length ==
      this.CancelSlotList.filter(shift => shift.status == this.bookingConstant.DEPOSIT_REQUIRED ||
        shift.status == this.bookingConstant.SUBMITTED ||
        shift.status == this.bookingConstant.PAYMENT_REQUIRED ||
        shift.status == this.bookingConstant.BOOKED).length) ||
      (this.CancelSlotList.filter(shift => shift.status == this.bookingConstant.CANCELLATION_REQUEST ||
        shift.status == this.bookingConstant.CANCELLATION_APPROVED).length == this.CancelSlotList.length);
  }

	/**
	 * Method is used to get all disabled shifts.
	 */
  getAllDisabled(): boolean {
    return this.CancelSlotList.filter(shift => shift.status == this.bookingConstant.CANCELLATION_REQUEST || shift.status == this.bookingConstant.CANCELLATION_APPROVED).length == this.CancelSlotList.length;
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
        console.log(res);
        this.JSONdata = JSON.stringify(res, null, 4);
      },
      err => {
        this.commonService.successAlert('Error!', err.error[0].message, 'error');
      }
    );
  }

  getAllLookUP() {
    this.ticketingService.getDataFromLookups().subscribe(lookUpResp => {
      this.CANCELLATION_TYPE_LOOKUP = lookUpResp.CANCELLATION_TYPE
    })
  }


	/**
	 * Method is used to check perticular list is selected or not.
	 * @param bookingNo - booking number
	 */
  getSelected(bookingNo): boolean {
    if (this.CancelRequestList.find(b => b === bookingNo)) {
      return true;
    }
    return false;
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

      let object = {
        refNumber: this.refNumber,
        appointments: this.CancelRequestList,
        cancellationType: this.ticketingConstants.BY_CITIZEN
      }

      this.commonService.confirmAlert('Are you sure to cancel?', "You won't be able to revert this!", 'warning', '', performDelete => {
        this.modalReqRef.hide();
        this.bookingService.cancelTownHall(object).subscribe(res => {
          this.CancelResponseList = res.data.detail;
          this.getAllBooking();
          this.modalResRef = this.modalService.show(this.templateResponseModel, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-lg customWidth' }))
        }, err => {
          this.toster.error(err.error.message);
        });
      });

    } else {
      this.toster.error("Please Select Slots");
    }
  }

	/**
	 * Get All Bookings Using API.
	 */
  getAllBooking() {

    this.paginator.pageSize = 5;
    this.paginator.pageIndex = 0

    if (this.searchTicketingsForm.valid) {
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          startWith({}),
          switchMap(() => {
            this.isLoadingResults = true;
            this.ticketingService.resourceType = this.searchTicketingsForm.get('resourceType').value;
            this.ticketingService.pageIndex = (this.paginator.pageIndex + 1);
            this.ticketingService.pageSize = this.paginator.pageSize;
            this.getAllLookUP();
            return this.ticketingService.getAllTicketing(this.searchTicketingsForm.get('refNumber').value);//NOSONAR
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
          this.isLoadingResults = false;
          this.ticketingList.data = data;
        });
    } else {
      this.bookingUtils.getAllErrors(this.searchTicketingsForm);
      this.commonService.openAlert('Feild Error', this.ticketingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
    }
  }

	/**
	 * Method is used to print Receipt.
	 * @param element - json object for receipt.
	 */
  printReceipt(element, serviceType: string) {
    this.ticketingService.printTicketingReceipt(element.refNumber, serviceType).subscribe(response => {
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
    this.ticketingService.getTransactionDetails(element.refNumber).subscribe(transactionData => {
    }, err => {
      if (err.status = 402) {
        this.isLoadingResults = false;
        if (err.status == 402) {
          this.ticketingUtils.redirectToPayment(err, this.commonService, this.bookingService);
        }
      } else if (err.error[0].code === this.ticketingConstants.INVALID_BOOKING_STATUS) {
        this.commonService.openAlert("Invalid Booking Status", err.error[0].message, "warning", "")
      } else {
        this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
      }
    })
  }


	/**
	 * This method is use for copy text.
	 */
  copyText(copytext: any) {
    copytext.select();
    document.execCommand('copy');
  }
}
