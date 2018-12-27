import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Observable ,  merge ,  of as observableOf } from 'rxjs';
import { catchError ,  map ,  startWith ,  switchMap } from 'rxjs/operators';

import { PaginationService } from '../../../core/services/citizen/data-services/pagination.service';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-my-resource',
	templateUrl: './my-resource.component.html',
	styleUrls: ['./my-resource.component.scss', '../dashboard/dashboard.component.scss']
})
export class MyResourceComponent implements OnInit {

	translateKey: string = "addResourceScreen";
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

	countDownDate = new Date();

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	/**
	 * Constructor to declare defualt propeties of class
	 * @param formService - Declare form service property
	 * @param paginationService - Declare pagination service property
	 * @param router - Declare router property
     * @param fb - Declare formBuilder property
	 */
	constructor(private formService: FormsActionsService,
		private paginationService: PaginationService, private fb: FormBuilder,
		private toastr: ToastrService) {

	}

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
					return this.paginationService!.getAllResourceData();// NOSONAR
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
	onResourceSubmit(formVals) {

		this.formService.apiType = this.appType;
		this.formService.createResourceData(formVals).subscribe(res => {
			this.toastr.success(`Resource ${formVals.resourceName} successfully added`);
			this.getAllResourceData();
			this.resourceForm.reset();
		});

	}


}
