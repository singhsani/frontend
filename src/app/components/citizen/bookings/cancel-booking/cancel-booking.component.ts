import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { SessionStorageService } from 'angular-web-storage';
import { BookingService } from '../../../../core/services/citizen/data-services/booking.service';
import { CommonService } from '../../../../shared/services/common.service';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { PaginationService } from '../../../../core/services/citizen/data-services/pagination.service';

@Component({
	selector: 'app-cancel-booking',
	templateUrl: './cancel-booking.component.html',
	styleUrls: ['./cancel-booking.component.scss']
})
export class CancelBookingComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	searchBookingsForm: FormGroup;
	resources: Array<any> = [];
	bookingList = new MatTableDataSource();

	displayedColumns: Array<string> = ['id', 'start', 'end', 'status', 'action'];
	translateKey: string = 'cancelBookingScreen';
	modalRef: BsModalRef;
	CancelSlotList: Array<any> = [];


	/**
	 * pagination instance variables.
	 */
	resultsLength: number = 0;
	pageSize: number = 20;
	isLoadingResults: boolean = true;

	constructor(
		private fb: FormBuilder,
		private bookingService: BookingService,
		private toster: ToastrService,
		private paginationService: PaginationService,
		private router: Router,
		private session: SessionStorageService,
		private modalService: BsModalService,
		private commonService: CommonService
	) {
		let resourcesList = [
			{
				type: 'townhall',
				name: 'Townhall'
			},
			{
				type: 'stadium',
				name: 'Stadium'
			},
			{
				type: 'amphiTheater',
				name: 'Amphi Theater'
			},
			{
				type: 'guesthouse',
				name: 'Guest House'
			}
		]
		this.resources = resourcesList;
	}

	/**
	 * Method Initializes first.
	 */
	ngOnInit() {
		this.searchBookingsForm = this.fb.group({
			resourceType: 'townhall',
		});

		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.getAllBooking();
	}

	/**
	 * This method is use for open modal.
	 */
	openModal(template: TemplateRef<any>, detailDTOList) {
		this.CancelSlotList = detailDTOList.sort((a, b) => {
			if ((new Date(a.bookingDate.split(' ')[0]).getTime()) <= (new Date(b.bookingDate.split(' ')[0]).getTime())) {
				return 1;
			} else {
				return -1;
			}
		});

		this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg ' }));
	}

	/**
	 * Get All Bookings Using API.
	 */
	getAllBooking() {
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					this.bookingService.resourceType = this.searchBookingsForm.get('resourceType').value;
					this.bookingService.pageIndex = (this.paginator.pageIndex + 1);
					this.bookingService.pageSize = this.pageSize;
					return this.bookingService!.getAllBookings();
				}),
				map(data => {
					this.isLoadingResults = false;
					this.resultsLength = data.totalRecords;
					return data.data;
				}),
				catchError(() => {
					this.isLoadingResults = false;
					return observableOf([]);
				})
			).subscribe(data => {
				this.isLoadingResults = false;
				this.bookingList.data = data;
			});
	}

	
	/**
	 * Method is used to cancel perticular booking using reference number.
	 * @param refNumber - reference number.
	 */
	cancelBooking(refNumber: string) {
		this.commonService.confirmAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			this.bookingService.cancelBookedSlot(refNumber, '').subscribe(res => {
				this.toster.success('Booking has been Cancelled');
				this.getAllBooking();
			}, err => {
				this.toster.error(err.error.message);
			});
		});
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
     * Method is used to return Date in format (DD-MM-YYYY)
     * @param date 
     */
	returnProperDate(date: string) {
		let newDate = date.split("-");
		return newDate[2] + "-" + newDate[1] + "-" + newDate[0]
	}

	/**
	 * Method is used to print police performance license
	 * @param element - json object
	 */
	printPolicePerformanceLicense(element) {
		if (element.refNumber) {
			this.bookingService.printPolicePerformanceLicense(element.refNumber).subscribe(response => {
				let data = response;
				let Pagelink = "about:blank";
				let pwa = window.open(Pagelink, "_new");

				if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
					this.commonService.openAlert('Pop-up!', 'Please disable your Pop-up blocker and try again.', 'warning');
				}

				pwa.document.open();
				pwa.document.write(data);
				pwa.print();

			}, err => {
				this.commonService.openAlert('Error', err.message, 'warning');
			})
		}
	}

	/**
	 * Method is used to print Receipt.
	 * @param element - json object for receipt.
	 */
	printReceipt(element) {
		this.bookingService.printReceipt(element.refNumber).subscribe(response => {
			let data = response;
			let Pagelink = "about:blank";
			let pwa = window.open(Pagelink, "_new");

			if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
				this.commonService.openAlert('Pop-up!', 'Please disable your Pop-up blocker and try again.', 'warning');
			}

			pwa.document.open();
			pwa.document.write(data);
			pwa.print();

		}, err => {
			this.commonService.openAlert('Error', err.message, 'warning');
		});
	}
}
