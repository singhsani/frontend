import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable ,  merge ,  of as observableOf } from 'rxjs';
import { catchError ,  map ,  startWith ,  switchMap } from 'rxjs/operators';
import { ManageRoutes } from '../../../config/routes-conf';
import { CommonService } from '../../../shared/services/common.service';
import { HosPaginationService } from '../../../core/services/hospital/data-services/hos-pagination.service';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';

@Component({
	selector: 'app-hos-my-applications',
	templateUrl: './hos-my-applications.component.html',
	styleUrls: ['./hos-my-applications.component.scss']
})
export class HosMyApplicationsComponent implements OnInit {

	displayedColumns: any = [
		'id',
		'applicantName',
		'fileNumber',
		'fileStatus',
		'serviceType',
		'action'
	];

	dataSource = new MatTableDataSource();

	resultsLength: number = 0;
	pageSize: number = 20;
	isLoadingResults: boolean = true;

	appType: string = 'myApps';

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private formService: HosFormActionsService,
		private paginationService: HosPaginationService,
		private router: Router,
		private commonService: CommonService,
	) { }

	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

		this.getAllData();
	}

	/**
	 * This method use to get all the citizen data with pagination.
	 */
	getAllData() {
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					this.paginationService.apiType = this.appType;
					this.paginationService.pageIndex = (this.paginator.pageIndex + 1);
					this.paginationService.pageSize = this.pageSize;
					return this.paginationService!.getAllData();
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
				this.dataSource.data = data;
			}
		);
	}

	/**
	 * This method is used to redirect on citizen form.
	 * @param id citizen api code
	 * @param id - citizen id 
	 */
	redirectToEdit(apiCode: string, id: number) {
		let redirectUrl = ManageRoutes.getFullRoute(apiCode);
		this.router.navigate([redirectUrl, id, apiCode]);
	}

	/**
	 * This method use to delete citizen record.
	 * @param id citizen api code
	 * @param id citizen id
	 */
	deleteRecord(apiCode: string, id: number) {

		this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
			this.formService.deleteFormData(id).subscribe(
				res => {
					this.commonService.successAlert('Deleted!', '', 'success');
					this.getAllData();
				},
				err => {
					this.commonService.successAlert('Error!', err.error[0].message, 'error');
				}
			);
		});

	}

	/**
	* This method is used to redirect on appointment form.
	*/
	redirectAppointment(apiCode: string, id: number) {
		let redirectUrl = ManageRoutes.getFullRoute('SLOTBOOKING');
		this.router.navigate([redirectUrl, id, apiCode]);
	}

	/**
	 * This method use to delete citizen record.
	 * @param id citizen api code
	 * @param id citizen api name
	 * @param id citizen id
	 */
	submitRecord(apiCode: string, apiName: string, id: number) {

		this.commonService.submitAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
			this.formService.submitFormData(id).subscribe(
				res => {
					this.commonService.successAlert('Submited!', '', 'success');
					this.getAllData();
				},
				err => {
					//this.commonService.successAlert('Error!', err.error[0].message, 'error');
				}
			);
		});

	}

	/**
	 * This method use to delete citizen record.
	 * @param id citizen api code
	 * @param id citizen api name
	 * @param id citizen id
	 */
	printReceipt(apiCode: string, apiName: string, id: number) {

		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.printReceipt(id).subscribe(
			res => {
				let data = res;
				let Pagelink = "about:blank";
				let pwa = window.open(Pagelink, "_new");
				if(!pwa || pwa.closed || typeof pwa.closed=='undefined') {
					this.commonService.openAlert('Pop-up!', 'Please disable your Pop-up blocker and try again.','warning');
				}
				pwa.document.open();
				pwa.document.write(data);
				pwa.print();
			},
			err => {
				//this.commonService.successAlert('Error!', err.error[0].message, 'error');
			}
		);

	}

	/**
	 * This method is use to get respective class name based on application status.
	 * @param filestatus - Application Status
	 */
	getFileStatusClass(filestatus: string) {
		switch (filestatus) {
			case 'DRAFT':
				return 'badge badge-primary text-label ml-2 small';
			case 'SUBMITTED':
				return 'badge badge-success text-label ml-2';
			default:
				return 'primary'
		}
	}

}
