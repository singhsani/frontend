import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { PaginationService } from '../../../../../core/services/citizen/data-services/pagination.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from './../../../../../shared/services/common.service';

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
	 * display table column.
	 */
	displayedColumns: any = [
		'id',
		'certificateno',
		'name',
		'date',
		'fathersName',
		'mothersName',
		'action'
	];

	displayedColumnsDeath: any = [
		'id',
		'certificateno',
		'name',
		'date',
		'action'
	];
	/**
	 * data source useful to display data.
	 */
	dataSource = new MatTableDataSource();
	pageEvent: PageEvent;
	pageIndex: number;
	pageSize: number;
	length: number;
	/**
	 * search form.
	 */
	searchForm: FormGroup;
	deathFromName: boolean = false;
	/**
	 * language translate key.
	 */
	translateKey: string = 'BDRecordsearchScreen';

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
	 * Registration year static look up.
	 */
	RegYear: Array<any> = [
		{ id: "2008", code: 2008, name: "2008" },
		{ id: "2009", code: 2009, name: "2009" },
		{ id: "2010", code: 2010, name: "2010" },
		{ id: "2011", code: 2011, name: "2011" },
		{ id: "2012", code: 2012, name: "2012" },
		{ id: "2013", code: 2013, name: "2013" },
		{ id: "2014", code: 2014, name: "2014" },
		{ id: "2015", code: 2015, name: "2015" },
		{ id: "2016", code: 2016, name: "2016" },
		{ id: "2017", code: 2017, name: "2017" },
		{ id: "2018", code: 2018, name: "2018" },
		{ id: "2019", code: 2019, name: "2019" },
		{ id: "2020", code: 2020, name: "2020" },
		{ id: "2021", code: 2021, name: "2021" }
	];

	/**
	 * length of result in paginator.
	 */
	resultsLength: number = 0;

	/**
	 * flag to load result from api.
	 */
	isLoadingResults: boolean = false;

	/**
	 * constructor.
	 * @param fb - form builder.
	 * @param router - common angular router.
	 * @param formService - common form service.
	 * @param paginationService - common pagination service.
	 */
	constructor(
		private fb: FormBuilder,
		private formService: FormsActionsService,
		private paginationService: PaginationService,
		private commonService: CommonService,
	) {
	}

	/**
	 * Method initializes first.
	 */
	ngOnInit() {
		if (this.apiType == 'duplicateDeathReg' || this.apiType == 'NRCDeath') {
			this.deathFromName = true;
			this.searchFormDeathControls();
		} else {
			this.deathFromName = false;
			this.searchFormBirthControls();
		}
		//this.getLookUpdata();
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;


	}

	/**
	 * Method is used to get look up data.
	 */
	getLookUpdata() {
		this.formService.getDataFromLookups().subscribe(resp => {
		})
	}

	/**
	 * Method use for create form controls
	 */
	searchFormBirthControls() {
		this.searchForm = this.fb.group({
			birthRegNumber: null,
			birthRegYear: null,
			birthDate: [null, Validators.required],
			childName: null,
			fatherFirstName: null,
			motherName: null
			// regNumber: null,
			// regYear: this.fb.group({
			// 	code: null
			// }),
			// date: moment().format('YYYY-MM-DD'),
			// name: null,
			// fatherName: null,
			// motherName: null
		})
	}


	/**
 * Method use for create form controls
 */
	searchFormDeathControls() {
		this.searchForm = this.fb.group({
			deathRegNumber: null,
			deathRegYear: null,
			deathDate: [null, Validators.required],
			deceasedName: null,
			fatherName: null,
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
		if(this.searchForm.valid){
			this.getAllData();
		}
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
					// this.isLoadingResults = true;
					this.paginationService.apiType = this.apiType;
					return this.paginationService!.getSearchDataWithPagination(this.searchForm.value);//NOSONAR
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
				if (!data.length) {
					this.showAlert();
				} else {
					this.dataSource.data = this.listOfData(data);
				}
			});
	}

	/**
	 * This method use for displaying string data in json 
	 */
	listOfData(prods) {
		let newgnData = JSON.parse(prods);
		let prod_array = [];
		for (let i = 0; i < newgnData.length; i += 1) {
			prod_array.push(newgnData[i]);
		}
		return prod_array;
	}

	/**
	 * This method use for displaying confirmation alert
	 */
	showAlert() {

		let type: string = '';

		if (this.apiType == 'duplicateBirthReg') {
			type = 'NRCBirth';
		} else if (this.apiType == 'duplicateDeathReg') {
			type = 'NRCDeath';
		} else {
			type = this.apiType;
		}

		// this.commonService.confirmAlert('No record found!', `Do you want to create ${type} certificate`, 'warning', '', confirm => {
		// 	// this.searchResult.emit(false);
		// 	//redirect to new resigstration form
		// 	this.redirectToNRCForm(false);
		// });
	}

	/**
	 * This method use for checkbox change event
	 * @param event - Checkbox event
	 * @param data - Row Data
	 */
	onChkBoxClick(event, data) {
		if (event.checked)
			this.rowData = data;
		else
			this.rowData = {};

	}

	/**
	 * This method use for redirect to duplicate form
	 * @param data - Row data
	 */
	redirectToDuplicate(data:any) {
		this.searchResult.emit(data);
	}

	/**
	 * This method for popup button event
	 */
	redirectToNRCForm(data:any){
		this.searchResult.emit(data);
	}

}
