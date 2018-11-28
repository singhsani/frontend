import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { PaginationService } from '../../../core/services/citizen/data-services/pagination.service';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../shared/services/common.service';
import { ManageRoutes } from '../../../config/routes-conf';
import * as moment from 'moment'

@Component({
	selector: 'app-my-applications',
	templateUrl: './my-applications.component.html',
	styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {

	/**
	 * displayColumns are used for display the columns in material table.
	 */
	displayedColumns: any = [
		'id',
		'applicantName',
		'fileNumber',
		'dateOfApplication',
		'departmentName',
		'serviceType',
		'fileStatus',
		'action'
	];

	/**
	 * Used for material table data population and pagination.
	 */
	dataSource = new MatTableDataSource();
	resultsLength: number = 0;
	pageSize: number = 5;
	isLoadingResults: boolean = true;
	translateKey: string="myApplicationScreen";

	appType: string = 'myApps';

	modalRef: BsModalRef;
	JSONdata: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private formService: FormsActionsService,
		private paginationService: PaginationService,
		private router: Router,
		private commonService: CommonService,
		private modalService: BsModalService
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
		this.paginator.pageSize = 5;
		this.paginator.pageIndex = 0;
		
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					this.paginationService.apiType = this.appType;
					this.paginationService.pageIndex = (this.paginator.pageIndex + 1);
					this.paginationService.pageSize = this.paginator.pageSize;
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
				this.isLoadingResults = false;
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
	 * This method use to application print receipt.
	 * @param id citizen api code
	 * @param id citizen api name
	 * @param id citizen id
	 */
	printReceipt(apiCode: string, apiName: string, id: number) {

		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.printReceipt(id).subscribe(
			htmlResponse => {
				let sectionToPrint: any = document.getElementById('sectionToPrint');
				sectionToPrint.innerHTML = htmlResponse;
				setTimeout(() => {
					window.print();
				});
			},
			err => {
				this.commonService.openAlert('Error!', err.error[0].message, 'error');
			}
		);

	}


	/**
     * This method use to application print view.
     * @param id citizen api code
     * @param id citizen api name
     * @param id citizen id
     */
    printView(apiCode: string, apiName: string, id: number) {

        this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
        this.formService.printView(id).subscribe(
            htmlResponse => {
				let sectionToPrint: any = document.getElementById('sectionToPrint');
				sectionToPrint.innerHTML = htmlResponse;
				setTimeout(() => {
					window.print();
				});
			},
            err => {
                //this.commonService.successAlert('Error!', err.error[0].message, 'error');
            }
        );

    }


	/**
	 * This method is use to show JOSN format.
	 */
	jsonDisplay(apiCode: string, apiName: string, id: number) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.viewJson(id).subscribe(
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
	copyText(copytext:any) {
		copytext.select();
		document.execCommand('copy');
	}

	/**
	 * This method is use to get respective class name based on application status.
	 * @param filestatus - Application Status
	 */
	getFileStatusClass(filestatus: string) {
		switch (filestatus) {
			case 'DRAFT':
				return 'badge draft text-label';
			case 'SUBMITTED':
				return 'badge submited text-label';
			case 'PAYMENT':
				return 'badge rejected text-label';
			default:
				return 'badge file text-label'
		}
	}

	/**
	 * This method is use for open modal.
	 */
	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	getProperDate(date: string):string{
		if (date) return moment(date).format("DD/MM/YYYY");
		return null;
	}

}
