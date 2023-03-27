import { BehaviorSubject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../environments/environment';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ApplicantDetailsComponent } from 'src/app/shared/components/applicant-details/applicant-details.component';
import { FormsActionsService} from 'src/app/core/services/citizen/data-services/forms-actions.service';

import { SessionStorageService } from 'angular-web-storage';

import swal from 'sweetalert2';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatDialog,MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	/**
	 * This property use for toggle the loading on routing
	 */
	public loading = new Subject<{ loading: boolean }>();
	/**
	 * This property use for share the profile data
	 */
	profileSubject = new Subject<any>();
	public isLoading = new BehaviorSubject(false);


	constructor(private session: SessionStorageService,
		private dialog: MatDialog,
		private alertService: AlertService,
		) { }

	/**
	 * This method is use for return image URL
	 * @param type - Alert type
	 */
	imageUrls(type: string) {
		if (type === 'warning') {
			return "assets/icons/warning.svg";
		} else if (type === 'success') {
			return "assets/icons/done.svg";
		} else if (type === 'info') {
			return "assets/icons/info.svg";
		} else if (type === 'error') {
			return "assets/icons/error.svg";
		} else if (type === 'question') {
			return "assets/icons/question.svg";
		}
	}

	openAlert(title: string, message: string, type: string, html?: any, cb?: any) {
		let options = {
			title: (title === 'Warning' || title === 'Error') ? '' : title,
			text: message,
			type: type,
			html: html,
			confirmButtonText: 'Ok',
			imageUrl: this.imageUrls(type),
			imageClass: 'doneIcon'
		}

		this.isCallback(options, cb);
	}

	openAlertFormSaveValidation(title: string, message: any, type: string, html?: any, cb?: any) {

		var html1 = '<div class="row small setHeight">';

		if( typeof message === 'string' ) {
			message = JSON.parse(message);
		}

		_.forEach(message, (value, key) => {
			html1 += '<div class="col-md-12 alert alert-danger" role="alert" *ngFor="let errorType of message">';
			html1 += value.property + " - " + value.message + " / " + value.gujMessage;
			html1 += '</div>';
		});

		html1 += '</div>';

		let options = {
			title: title,
			text: message,
			//type: type,
			html: html1,
			confirmButtonText: 'Ok',
			imageUrl: this.imageUrls(type),
			imageClass: 'doneIcon',
		}

		this.isCallback(options, cb);
	}

	deleteAlert(title: string, message: string, type: string, html?: any, performDelete?: any) {

		let options = {
			title: title,
			text: message,
			type: type,
			html: html,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!',
			imageUrl: 'assets/icons/delete.svg',
			imageClass: 'deleteIcon',
		}

		this.isCallback(options, performDelete);

	}

	submitAlert(title: string, message: string, type: string, html?: any, performSubmit?: any) {

		let options = {
			title: title,
			text: message,
			type: type,
			html: html,
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Submit',
			imageUrl: this.imageUrls(type),
			imageClass: 'doneIcon',
		}

		this.isCallback(options, performSubmit);

	}

	successAlert(title: string, message: string, type: string) {

		let options = {
			title: title,
			text: message,
			type: type,
			imageUrl: this.imageUrls(type),
			imageClass: 'doneIcon',
		}

		swal(options as any);
	}

	paymentAlert(title: string, message: string, type: string, pay?: any) {

		let options = {
			title: title,
			text: message,
			type: type,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Make a Payment',
			imageUrl: this.imageUrls(type),
			imageClass: 'doneIcon',
		}

		this.isCallback(options, pay);

	}

	getUserType(): string {

		if (this.session.get('access_token')) {
			return this.session.get('access_token').userType;
		} else if (this.session.get('hos_access_token')) {
			return this.session.get('hos_access_token').userType;
		}

	}

	fromAdmin(): boolean {
		if (this.session.get('fromAdmin')) {
			if (this.session.get('fromAdmin') === 'fromAdmin')
				return true;
			else
				return false;
		}
	}

	getDateFormat(date: string, withTime: boolean) {

		if (withTime) {
			return moment(date).format('DD-MM-YYYY HH:MM:SS');
		} else {
			return moment(date).format('DD-MM-YYYY');
		}
	}

	/**
	* This method is use for confirmation.
	*/
	confirmAlert(title: string, message: string, type: string, html?: any, performEvent?: any) {

		let options = {
			title: title,
			text: message,
			type: type,
			html: html,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes!',
			imageUrl: this.imageUrls(type),
			imageClass: 'doneIcon',
		}

		this.isCallback(options, performEvent);
	}

	commonAlert(title: string, message: string, type: string, confirmButtonText: string, allowOutsideClick?: boolean, html?: any, performAction?: any, rejectAction?: any) {

		let options = {
			title: title,
			text: message,
			type: type,
			html: html,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: confirmButtonText,
			allowOutsideClick: allowOutsideClick,
			imageUrl: this.imageUrls(type),
			imageClass: 'doneIcon',
		}

		swal(options as any).then((result) => {
			if (result.value && performAction) {
				performAction();
			} else if (result.dismiss) {
				rejectAction();
			}
		})
	}

	storePaymentInfo(paymentData: any, myApplicationUrl: any, retAfterPayment: any): any {
	
		let payData = {
			id: null,
			uniqueId: null,
			version: null,
			loiNumber: null,
			response: JSON.stringify({
				data: "paid",
				status: true
			}),
			paymentStatus: null,
			transactionId: paymentData.transactionId,
			payableServiceType: paymentData.serviceCode,
			refNumber: paymentData.refNumber,
			amount: paymentData.amount,
			paymentMode: "NETBANKING",
			returnUrl: retAfterPayment,
			myApplicationUrl: myApplicationUrl,
			gatewayAccountKey : paymentData.gatewayAccountKey,
			txtadditionalInfo1 : paymentData.serviceCode,

		}
		this.session.set('paymentData', JSON.stringify(payData));

		return payData;
	}

	redirectToPaymentGateway(payData) {
		window.location.href = environment.adminUrl + `payment-gateway?retUrl=${payData.retUrl}&retPath=${payData.retPath}`;
	}


	/**
	 * This mthod is use for return the callback if exist
	 * @param options - Swal options
	 * @param cb - Callback
	 */
	isCallback(options: any, cb) {
		swal(options).then((result) => {
			if (result.value && cb) {
				cb();
			}
		});
	}

	isGuestUser(){
		return this.session.get("isGuestLogin");
	}

	getApplicantDialogConfig():MatDialogConfig{
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = {};
		return dialogConfig;
	}

	public findInvalidControls(form) {
		const invalid = [];
		const controls = form.controls;
		for (const name in controls) {
			if (controls[name].invalid) {
				invalid.push(name);
			}
		}
		return invalid;
	}

	clone(obj) {
		var copy;
	
		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;
	
		// Handle Date
		if (obj instanceof Date) {
			copy = new Date();
			copy.setTime(obj.getTime());
			return copy;
		}
	
		// Handle Array
		if (obj instanceof Array) {
			copy = [];
			for (var i = 0, len = obj.length; i < len; i++) {
				copy[i] = this.clone(obj[i]);
			}
			return copy;
		}
	
		// Handle Object
		if (obj instanceof Object) {
			copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
			}
			return copy;
		}
	
		throw new Error("Unable to copy obj! Its type isn't supported.");
	}


	getToWords(amount){
		let toWords = require('to-words');
					let words = '';
						//toWords.convert(payData.amount);
						if(amount>0){
							words = toWords(amount);
						}else{
							words =  " "
						}
					return words;
	}

	openDetailDialogBox(){
		return this.openDialogBox()
	}

	openDialogBox() {
		const dialogConfig = new MatDialogConfig();
	
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = {};
	
		const dialogRef = this.dialog.open(ApplicantDetailsComponent, dialogConfig);
	    return dialogRef.afterClosed()
	
	  }

	  createCloneAbstractControl(copyFrom: FormGroup, copyTo : FormGroup){
		Object.keys(copyFrom.controls).forEach(key => {
			const control = copyFrom.get(key);
			if(control instanceof FormControl){
				copyTo.addControl(key,new FormControl(control.value, control.validator, control.asyncValidator) as any)
			}else if(control instanceof FormGroup){
				const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
				this.createCloneAbstractControl(control,formGroup);
				copyTo.addControl(key,formGroup);
		  }
		});
	}

	setValueToFromControl(fromControl : FormGroup,toControl : FormGroup){
		const ary = Object.keys(fromControl.value);
			ary.forEach(element => {
				toControl.get(element).setValue(fromControl.get(element).value);
			});
	}

}
