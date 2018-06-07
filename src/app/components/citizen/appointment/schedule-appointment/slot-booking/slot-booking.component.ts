import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material';

// import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../../shared/services/common.service';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { element } from 'protractor';
import * as _ from 'lodash';

const now = moment();

@Component({
	selector: 'app-slot-booking',
	templateUrl: './slot-booking.component.html',
	styleUrls: ['./slot-booking.component.scss']
})
export class SlotBookingComponent implements OnInit {

	translateKey: '';
	formId: any;
	apiCode: any;
	apiType: string;
	resources: any = [];
	slots: any = [];
	calcelslots: any = [];
	appointmentForm: FormGroup;
	resultsLength: number = 0;
	appointmentLength: number = 0;
	/**
	* @param formService - Declare form service property .
	* @param commonService - Declare sweet alert.
	*/
	constructor(
		// private formService: FormsActionsService,
		private http: HttpService,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private commonService: CommonService,
		// private formService: FormsActionsService
	) {
		this.controlName();
	}

	//for mat table
	displayedColumns = ['start date', 'end date', 'slot Status', 'action'];
	bookedColumns = ['start date', 'end date', 'resource name', 'slot Status', 'action'];
	dataSource = new MatTableDataSource();

	//past date disable
	minDate = now.toDate();

	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.formId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);

		});

		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getResources();
			this.appointmentList();
		}
	}

	/**
	* This method is declared form controls
	*/
	controlName() {
		this.appointmentForm = this.fb.group({
			resources: this.fb.group({
				code: ['', Validators.required],
				id: [''],
				name: ['']
			}),
			appointmentdate: [moment().add(1, 'day').format("YYYY-MM-DD"), Validators.required]
		})
	}

	/**
	* This method is get available resource list 
	*/
	getResources() {
		let requestURL = `api/form/${this.apiType}/resources`;
		this.http.get(requestURL).subscribe(
			list => {
				this.resources = list.data;
			},
			err => {
				console.log("error" + err);
			});
	}

	/**
	* This method use for get available slot 
	*/
	onSubmit() {
		let resource = this.appointmentForm.controls.resources.get('code').value;
		let appointmentdate = this.appointmentForm.get('appointmentdate').value;
		if (!_.isEmpty(resource)) {
			this.getSlot();
		}
	}

	/**
	* This method is change date format 
	*/
	dateFormate(date, controlType) {
		this.appointmentForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	* This method is get available slots 
	*/
	getSlot() {
		let resourcecode = this.appointmentForm.controls.resources.get('code').value;
		let startdate = this.appointmentForm.get('appointmentdate').value;

		let requestURL = `api/form/${this.apiType}/slots?resourceCode=${resourcecode}&startDate=${startdate}&serviceId=${this.formId}`;

		this.http.get(requestURL).subscribe(
			slot => {
				this.slots = slot.data;
				this.resultsLength = this.slots.length;
			},
			err => {
				this.commonService.openAlert("error", err.error[0].code, "error");
			});
	}

	/**
	* This method use for slot booking 
	*/
	redirectToBook(uniqueId) {

		this.commonService.confirmAlert('Are you sure?', "", 'info', '', performDelete => {
			let requestURL = `api/form/${this.apiType}/slot/book?serviceId=${this.formId}&slotId=${uniqueId}`;
			this.http.get(requestURL).subscribe(
				res => {
					if (res.data.bookingStatus === 'BOOKED') {
						this.commonService.successAlert("Success", "", "success");
					}
					this.getSlot();
					this.appointmentList();
				},
				err => {
					this.commonService.openAlert("error", err.error[0].code, "error");
				}
			);
		});
	}

	/**
	* This method use for cancel booked slot 
	*/
	redirectToCancel(uniqueId) {

		this.commonService.deleteAlert('Are you sure?', "", 'warning', '', performDelete => {
			let requestURL = `api/form/${this.apiType}/slot/cancel?serviceId=${this.formId}&slotId=${uniqueId}`;
			this.http.get(requestURL).subscribe(
				res => {
					this.commonService.successAlert('Canceled!', '', 'success');
					this.getSlot();
					this.appointmentList();
				},
				err => {
					this.commonService.openAlert("error", err.error[0].code, "error");
				}
			);
		});
	}

	/**
	* This method use for get appointment list 
	*/
	appointmentList() {
		let requestURL = `api/form/${this.apiType}/appointments/${this.formId}`;
		this.http.get(requestURL).subscribe(
			res => {
				this.calcelslots = res.data;
				this.appointmentLength = this.calcelslots.length;
			},
			err => {
				this.commonService.openAlert("error", err.error[0].code, "error");
			}
		);
	}
}
