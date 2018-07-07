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

	/**
	 * get api type through input.
	 */
	@Input() apiType: string;

	/**
	 * emit event.
	 */
	@Output() searchResult = new EventEmitter<any>();

	/**
	 * get element having id as MatPaginator from view.
	 */
	@ViewChild(MatPaginator) paginator: MatPaginator;

	/**
	 * get element having id as MatSort from view.
	 */
	@ViewChild(MatSort) sort: MatSort;

	/**
	 * search form.
	 */
	searchForm: FormGroup;

	/**
	 * language translate key.
	 */
	translateKey: string = 'searchScreen';

	/**
	 * maximum date validation.
	 */
	maxDate: Date = new Date();

	/**
	 * row data.
	 */
	rowData: any = {};

	/**
	 * initialize check box value with -1
	 */
	selected = -1;

	/**
	 * display table column.
	 */
	displayedColumns: any = [
		'seq',
		'id',
		'applicantName',
		'fileNumber',
		'serviceType',
		'action'
	];

	/**
	 * Registration year static look up.
	 */
	RegYear: Array<any> = [
		{
			id: "2008",
			code: 2008,
			name: "2008"

		},
		{
			id: "2009",
			code: 2009,
			name: "2009"

		},
		{
			id: "2010",
			code: 2010,
			name: "2010"

		},
		{
			id: "2011",
			code: "2011",
			name: "2011"

		},
		{
			id: "2012",
			code: 2012,
			name: "2012"

		}, {
			id: "2013",
			code: 2013,
			name: "2013"

		},
		{
			id: "2014",
			code: 2014,
			name: "2014"

		},
		{
			id: "2015",
			code: 2015,
			name: "2015"

		},
		{
			id: "2016",
			code: 2016,
			name: "2016"

		},
		{
			id: "2017",
			code: 2017,
			name: "2017"

		},
		{
			id: "2018",
			code: 2018,
			name: "2018"

		}

	];

	/**
	 * data source useful to display data.
	 */
	dataSource = new MatTableDataSource();

	/**
	 * length of result in paginator.
	 */
	resultsLength: number = 0;

	/**
	 * total paze size.
	 */
	pageSize: number = 20;

	/**
	 * flag to load result from api.
	 */
	isLoadingResults: boolean = false;

	/**
	 * emit data false if record not found.
	 */
	emitData: boolean = false;

	/**
	 * constructor.
	 * @param fb - form builder.
	 * @param router - common angular router.
	 * @param formService - common form service.
	 * @param paginationService - common pagination service.
	 */
	constructor(
		private fb: FormBuilder,
		private router: Router,
		private formService: FormsActionsService,
		private paginationService: PaginationService,
	) { }

	/**
	 * Method initializes first.
	 */
	ngOnInit() {

		this.searchFormControls();

		this.getLookUpdata();

		//this.getAllData();
		//this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
	}

	/**
	 * Method is used to get look up data.
	 */
	getLookUpdata(){
		this.formService.getDataFromLookups().subscribe(resp => {
		})
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
			date: moment().format("YYYY-MM-DD"),
			fatherName: null,
			name: null,
			motherName: null,
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
					this.paginationService.apiType = this.apiType;
					this.paginationService.pageIndex = (this.paginator.pageIndex + 1);
					this.paginationService.pageSize = this.pageSize;
					return this.paginationService!.getSearchDataWithPagination(this.searchForm.value);
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
				console.log(data);
				if(!data.length && !this.emitData){
					this.searchResult.emit(false);
				} else {
					this.emitData = true;
					this.dataSource.data = data;
				}
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
