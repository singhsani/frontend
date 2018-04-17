import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';

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

@Component({
	selector: 'app-my-resource',
	templateUrl: './my-resource.component.html',
	styleUrls: ['./my-resource.component.scss']
})
export class MyResourceComponent implements OnInit {

	displayedColumns: any = [
		'id',
		'resourceName',
		'resourceId',
		'resourceType'
	];

	dataSource = new MatTableDataSource();
	resourceForm: FormGroup;

	resultsLength: number = 0;
	pageSize: number = 20;
	isLoadingResults: boolean = true;
	isRateLimitReached: boolean = false;

	appType: string = 'citizenResources';

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	/**
	 * Constructor to declare defualt propeties of class
	 * @param formService - Declare form service property
	 * @param paginationService - Declare pagination service property
	 * @param _router - Declare router property
   * @param fb - Declare formBuilder property
	 */
	constructor(
		private formService: FormsActionsService,
		private paginationService: PaginationService,
		private _router: Router, private fb: FormBuilder
	) { }

	ngOnInit() {

		this.resourceForm = this.fb.group({
			resourceName: '',
			resourceId: '',
			resourceType: '',
		});

		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

		this.getAllResourceData();

	}

	/**
	 * This method use to get all the citizen resource data with pagination
	 */
	getAllResourceData() {
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					this.paginationService.apiType = this.appType;
					this.paginationService.pageIndex = (this.paginator.pageIndex + 1);
					this.paginationService.pageSize = this.pageSize;
					return this.paginationService!.getAllResourceData();
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
	 * This method is use to create new record for citizen resource
	 */
	onResourceSubmit(formVals: FormGroup) {
		this.formService.apiType = this.appType;
		this.formService.createResourceData(formVals).subscribe(res => {
			this.getAllResourceData();
			this.resourceForm.reset();
		});
	}

}
