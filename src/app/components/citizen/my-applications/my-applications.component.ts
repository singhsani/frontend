import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';

import { PaginationService } from '../../../core/services/citizen/data-services/pagination.service';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
	selector: 'app-my-applications',
	templateUrl: './my-applications.component.html',
	styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {

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
	isRateLimitReached: boolean = false;

	appType: string = 'myApps';

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private formService: FormsActionsService,
		private paginationService: PaginationService,
		private router: Router,
		private commonService: CommonService,
	) { }

	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

		this.getAllData();
	}

	/**
	 * This method use to get all the citizen data with pagination
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
					this.isRateLimitReached = false;
					this.resultsLength = data.totalRecords;
					return data.data;
				}),
				catchError(() => {
					this.isLoadingResults = false;
					this.isRateLimitReached = true;
					return observableOf([]);
				})
			).subscribe(data => {
				this.dataSource.data = data;
			}
			);
	}

	/**
	 * This method is used to redirect on citizen form
	 * @param id - citizen id 
	 */
	redirectToEdit(apiType:string, id:number) {

		let redirectUrl = '/citizen/'+apiType;

		this.router.navigate([redirectUrl, id]);
	}

	/**
	 * This method use to delete citizen record
	 * @param id citizen id
	 */
	deleteRecord(apiType:string,id:number) {

		this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			this.formService.apiType = apiType;
			this.formService.deleteFormData(id).subscribe(res => {
				this.commonService.successAlert('Deleted!', '', 'success');
				this.getAllData();
			});
		});

	}

}
