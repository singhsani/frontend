import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { PaginationService } from '../../../../../core/services/citizen/data-services/pagination.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'record-search',
	templateUrl: './record-search.component.html',
	styleUrls: ['./record-search.component.scss']
})
export class RecordSearchComponent implements OnInit {

	@Input() apiType: string;
	@Output() searchResult = new EventEmitter<any>();

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	searchForm: FormGroup;
	translateKey: string = 'searchScreen';
	maxDate: Date = new Date();
	rowData: any = {};
	selected = -1;

	displayedColumns: any = [
		'seq',
		'id',
		'applicantName',
		'fileNumber',
		'serviceType',
		'action'
	];

	dataSource = new MatTableDataSource();

	resultsLength: number = 0;
	pageSize: number = 20;
	isLoadingResults: boolean = false;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private formService: FormsActionsService,
		private paginationService: PaginationService,
	) { }

	ngOnInit() {

		this.searchFormControls();
		this.getAllData();

		//this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
	}

	/**
	 * Method use for create form controls
	 */
	searchFormControls() {
		this.searchForm = this.fb.group({
			regNumber: null,
			regYear: this.fb.group({
				code: null
			}),
			date: null,
			fatherName: null,
			childName: null,
			motherName: null
		})
	}

	/**
	 * This method use for covert date format
	 * @param date - Selected date
	 */
	onDateChange(date) {
		this.searchForm.get('date').setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * This method use for get form values
	 * @param formsVal - Search form value
	 */
	getDetails(formsVal) {
		// console.log(formsVal);

		this.searchResult.emit(false);
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
					this.paginationService.apiType = "myApps";
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
	 * This method use for checkbox change event
	 * @param event - Checkbox event
	 * @param data - Row Data
	 */
	onChkBoxClick(event, data){
		if(event.checked)
			this.rowData = data;
		else
			this.rowData = {};
		
	}

	/**
	 * This method use for redirect to duplicate form
	 * @param data - Row data
	 */
	redirectToDuplicate(data){
		this.searchResult.emit(data);
	}

}
