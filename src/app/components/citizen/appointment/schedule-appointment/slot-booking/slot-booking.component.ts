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
	bookedSlot: any = [];
	appointmentForm: FormGroup;

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
	) { }

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
			this.controlName();
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
			appointmentdate: moment().add(1, 'day').format("YYYY-MM-DD")
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
		this.getSlot(resource, appointmentdate);
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
	getSlot(resourcecode, startdate) {
		let date = this.appointmentForm.get('appointmentdate').value;
		let requestURL = `api/form/${this.apiType}/slots?resourceCode=${resourcecode}&startDate=${startdate}&serviceId=${this.formId}`;

		this.http.get(requestURL).subscribe(
			slot => {
				this.slots = slot.data;
			},
			err => {
				this.commonService.openAlert("error", err, "error");
			});
	}

	/**
	* This method use for slot booking 
	*/
	redirectToBook(uniqueId) {
		let requestURL = `api/form/${this.apiType}/slot/book?serviceId=${this.formId}&slotId=${uniqueId}`;
		this.http.get(requestURL).subscribe(
			res => {
				this.bookedSlot = res.data;

				if (this.bookedSlot.bookingStatus === 'BOOKED') {
					this.commonService.openAlert("info", "slot booked", "info");
				}
				let resource = this.appointmentForm.controls.resources.get('code').value;
				let appointmentdate = this.appointmentForm.get('appointmentdate').value;
				this.getSlot(resource, appointmentdate);
				this.appointmentList();
			},
			err => {
				this.commonService.openAlert("error", "ONLY_ONE_APPOINTMENT_ALLOWED", "error");
			}
		);
	}

	/**
	* This method use for cancel booked slot 
	*/
	redirectToCancel(uniqueId) {
		// GET /api/form/MFRenewal/slot/cancel?serviceId=3&amp;slotId=c1a0d51aa9444defbd86b0b4e82f4a63 HTTP/1.1
		let requestURL = `api/form/${this.apiType}/slot/cancel?serviceId=${this.formId}&slotId=${uniqueId}`;
		this.http.get(requestURL).subscribe(
			res => {
				this.commonService.openAlert("error", "canceled", "error");
				let resource = this.appointmentForm.controls.resources.get('code').value;
				let appointmentdate = this.appointmentForm.get('appointmentdate').value;
				this.getSlot(resource, appointmentdate);
				this.appointmentList();
			},
			err => {
				this.commonService.openAlert("error", "SLOT_DETAILS_NOT_AVAILABLE", "error");
			}
		);

	}

	/**
	* This method use for get appointment list 
	*/
	appointmentList() {
		// {{HOST}}/api/form/pondLicense/appointments/11
		let requestURL = `api/form/${this.apiType}/appointments/${this.formId}`;
		this.http.get(requestURL).subscribe(
			res => {
				this.calcelslots = res.data;
			},
			err => {
				this.commonService.openAlert("error", err, "error");
			}
		);
	}
}
