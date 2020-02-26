import { FireFacilityConfig } from './../config/FireFacilityConfig';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as moment from 'moment';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
	selector: 'app-dead-body-wan',
	templateUrl: './dead-body-wan.component.html',
	styleUrls: ['./dead-body-wan.component.scss']
})
export class DeadBodyWanComponent implements OnInit {

	deadBodyWanForm: FormGroup;
	translateKey: string = 'deadBodyWanScreen';

	appId: number;
	apiCode: string;

	disablePastDate = new Date(moment().format('YYYY-MM-DD'));
	fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private formService: FormsActionsService,
		private atp: AmazingTimePickerService
	) { }

	ngOnInit() {

		this.route.paramMap.subscribe(param => {
			this.appId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		});

		this.getGasConnectionData();
		this.gasConnectionFormControls();
	}

	/**
	 * this method is use for get api data and patch in form
	 */
	getGasConnectionData() {
		this.formService.getFormData(this.appId).subscribe(res => {
			this.deadBodyWanForm.patchValue(res);
		});
	}

	/**
	 * define all gas connection form controls
	 */
	gasConnectionFormControls() {
		this.deadBodyWanForm = this.fb.group({
			apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
			serviceCode: 'FS-BODY',
			oldReferenceNumber: [null],
			applicantName: [null, [Validators.required, Validators.maxLength(100)]],
			applicantAddress: [null, [Validators.required, Validators.maxLength(300)]],
			applicationDate: [null, Validators.required],
			vehicleRequirementTime: [null, [Validators.required, Validators.maxLength(10)]],
			mobileNo: [null, [Validators.required, Validators.maxLength(this.fireFacilityConfig.mobileNumber_maxLength), Validators.minLength(this.fireFacilityConfig.mobileNumber_minLength)]],
			deadPersonName: [null, [Validators.required, Validators.maxLength(150)]],
			fromPlace: [null, [Validators.required, Validators.maxLength(300)]],
			toPlace: [null, [Validators.required, Validators.maxLength(150)]],
			withinVMCBoundary: [null],
			nameOfDriver: [null, [Validators.required, Validators.maxLength(150)]],
			nameOfAttender: [null, [Validators.required, Validators.maxLength(150)]],
			departureTime: [null, [Validators.required, Validators.maxLength(10)]],
			arrivalTime: [null, [Validators.required, Validators.maxLength(10)]],
			concessionDetail: [null, [Validators.minLength(3)]],
			nameOfOperator: [null, [Validators.required, Validators.maxLength(150)]]
		});
	}

	/**
	 * This method is change date format.
	 * @param date : selected date
	 * @param controlType : form control name
	 */
	dateFormat(date: any, controlType: string) {
		this.deadBodyWanForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
	}

	/**
	 * Method is used to open time picker.
	 * @param controlName - control name.
	 */
	openTimePicker(controlName: string) {
		const amazingTimePicker = this.atp.open({
			changeToMinutes: true,
			theme: 'material-purple',
		});
		amazingTimePicker.afterClose().subscribe(time => {
			if (time.length == 5) {
				this.deadBodyWanForm.get(controlName).setValue(time + ":00");
			}
		});
	}

	/**
	 * Used to capture change in birth time for perticular child.
	 * @param ev - event
	 * @param index - index of child
	 */
	changeTimeFormat(ev: string, controlName: string) {
		if (ev && ev.length < 8) {
			ev = ev.concat(":00");
		}
		this.deadBodyWanForm.get(controlName).setValue(ev);
	}


	/**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
	handleErrorsOnSubmit(flag) {
		let step0 = 16;
		if (flag != null) {
			//Check validation for step by step
			let count = flag;
			if (count <= step0) {
				this.fireFacilityConfig.currentTabIndex = 0;
				return false;
			} else {
				console.log("else condition");
			}

		}
	}
}
