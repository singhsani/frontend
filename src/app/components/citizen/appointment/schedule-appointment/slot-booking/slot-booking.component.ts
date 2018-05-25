import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material';

// import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../../shared/services/common.service';
import { ManageRoutes } from '../../../../../config/routes-conf';

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
	bookedSlot: any = [];
	appointmentForm: FormGroup;

	//for mat table
	displayedColumns = ['start date', 'end date', 'slot Status', 'action'];
	dataSource = new MatTableDataSource();

	//past date disable
	minDate = now.toDate();

	/**
	* @param formService - Declare form service property .
	* @param commonService - Declare sweet alert.
	*/
	constructor(
		private http: HttpService,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private commonService: CommonService,
		// private formService: FormsActionsService
	) {
		this.appointmentForm = fb.group({
			resources: [''],
			appointmentdate: moment().add(1, 'day').format("YYYY-MM-DD")
		})
	}

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

			if (this.appointmentForm.get('appointmentdate').value != null) {
				this.getSlot();
			}
		}

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
	* This method is change date format 
	*/
	dateFormate(date, controlType) {
		this.appointmentForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
		this.getSlot();
	}

	/**
	* This method is get available slots 
	*/
	getSlot() {
		let date = this.appointmentForm.get('appointmentdate').value;
		let requestURL = `api/form/${this.apiType}/slots?resourceCode=RESOURCES&startDate=${date}&serviceId=${this.formId}`;

		this.http.get(requestURL).subscribe(
			slot => {
				this.slots = slot.data;
			},
			err => {
				this.commonService.openAlert("info", err, "info");
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
					this.getSlot();
				}
			},
			err => {
				this.commonService.openAlert("info", err, "info");
			}
		);
	}
}
