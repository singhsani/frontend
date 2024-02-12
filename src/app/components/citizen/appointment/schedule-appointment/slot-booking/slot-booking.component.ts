import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../../shared/services/common.service';
import { ManageRoutes } from '../../../../../config/routes-conf';
import * as _ from 'lodash';
import { AppointmentServices } from '../../appointment.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { AppointmentConfig } from '../../appointment-config';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';




export interface SlotDetails {
	end: string
	id: number
	occupancy: number
	occupiedCount: number
	shiftType: string
	slotStatus: string
	start: string
	uniqueId: string
	version: number
}

@Component({
	selector: 'app-slot-booking',
	templateUrl: './slot-booking.component.html',
	styleUrls: ['./slot-booking.component.scss']
})
export class SlotBookingComponent implements OnInit {
	@ViewChild('templateMyAppointmentModel') templateMyAppointmentModel: TemplateRef<any>;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	slotDataSource = new MatTableDataSource<SlotDetails>([]);

	translateKey = 'appointmentBookingScreen';
	formId: any;
	apiCode: any;
	apiType: string;
	resources: any = [];
	slots: any = [];
	calcelslots: any = [];
	appointmentForm: FormGroup;
	modalRef: BsModalRef;

	/**
	 * common configuration file
	 */
	config: AppointmentConfig = new AppointmentConfig();

	/**
	 * Setting Date Validation
	 */

	/**
	* Minimum start date.
	*/
	minDate = moment(new Date()).add(1, 'day').toISOString();

	/**
	 * pagination instance variables.
	 */
	resultsLength: number = 0;
	isLoadingResults: boolean = false;
	appointmentLength: number = 0;
	/**
	* @param formService - Declare form service property .
	* @param commonService - Declare sweet alert.
	*/
	constructor(
		// private formService: FormsActionsService,
		private toster: ToastrService,
		private appointmentService: AppointmentServices,
		private formService: FormsActionsService,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private modalService: BsModalService,
		private commonService: CommonService,
		private location: Location
		// private formService: FormsActionsService
	) {
		this.controlName();
	}

	//for mat table
	displayedColumns = ['sno', 'date', 'start_time', 'end_time', 'status', 'action'];
	bookedColumns = ['start date', 'end date', 'resource name', 'slot Status', 'action'];
	dataSource = new MatTableDataSource();

	ngOnInit() {
		this.route.paramMap.subscribe(param => {
			this.formId = Number(param.get('id'));
			this.apiCode = param.get('apiCode');
			this.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
			this.appointmentService.apiType = this.apiType;
			this.formService.apiType = this.apiType;
		});

		if (!this.formId) {
			this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
		}
		else {
			this.getResources();
			this.appointmentList();
		}

		/**
        * Used to initiate print hook after successfull payment
        */
	   this.route.queryParams.subscribe(d => {
		if (d.apiCode && d.id) {
			this.printReceipt(d.apiCode, '', d.id);
			setTimeout(() => {
				this.location.go(this.router.url.split('?')[0]);
			}, 3000);
		}
	})
	}

	/**
	 * This method is use for open modal.
	 */
	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-lg customWidth' }));
	}

	/**
	* This method is declared form controls
	*/
	controlName() {
		this.appointmentForm = this.fb.group({
			resources: this.fb.group({
				code: [null, Validators.required],
				id: null,
				name: null
			}),
			appointmentdate: [null, Validators.required]
		})
	}

	/**
	* This method is get available resource list 
	*/
	getResources() {
		this.appointmentService.getResources().subscribe((resp) => {
			this.resources = resp.data;
		}, (err) => {
			if (err.error[0])
				this.commonService.openAlert("Error", err.error[0].message, "warning");
		})
	}

	disableSunday(d: Date) {
		const day = d.getDay(); 
		const month = Math.floor((d.getDate() -1) / 7) + 1;
		// disable  2 and 4 Saturday and sunday 
		return !((day === 6 && (month === 2 || month === 4 )) || day === 0);                   
	  }

	/**
	* This method use for get available slot 
	*/
	onSubmit() {
		if (this.appointmentForm.invalid) {
			this.config.getAllErrors(this.appointmentForm);
			this.commonService.openAlert("Error", this.config.ALL_FEILD_REQUIRED_MESSAGE, "warning");
		} else {
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
		this.appointmentService.getSlots(resourcecode, startdate, this.formId).subscribe(slot => {
			this.slotDataSource.data = slot.data.filter(s => s.slotStatus == 'AVAILABLE') as SlotDetails[];
			this.slotDataSource.paginator = this.paginator;
			this.paginator.pageSize = 5;
			this.paginator.pageIndex = 0;
			this.isLoadingResults = false;
		},
			err => {
				if (err.error[0])
					this.commonService.openAlert("error", err.error[0].message, "error");
			});
	}

	/**
	* This method use for slot booking 
	*/
	redirectToBook(slotData) {
		let html = `
		<table class="table table-bordered">
			<tbody>
				<tr>
					<th scope="row">Appointment Date</th>
					<td>`+ this.properDate(slotData.start) + `</td>
				</tr>

				<tr>
					<th scope="row">Start Time</th>
					<td>`+ moment(slotData.start).format("hh:mm A") + `</td>
				</tr>
				<tr>
				    <th scope="row">End Time</th>
				    <td>`+ moment(slotData.end).format("hh:mm A") + `</td>
				</tr>
				<tr>
				    <th scope="row">Slot Status</th>
					<td>`+ slotData.slotStatus + `</td>
			    </tr>
				<tr>
				    <th scope="row">Occupancy</th>
					<td>`+ slotData.occupancy + `</td></tr>
				<tr>
			</tbody>
		</table>
		`
		this.commonService.commonAlert('Are you sure?', "", 'info', 'Schedule Appointment', false, html, cb => {
			this.appointmentService.bookSlot(this.formId, slotData.uniqueId).subscribe(resp => {
				let res = resp.data;
				if (res.bookingStatus == 'BOOKED') {
					this.formService.getFormData(this.formId).subscribe(formData => {
						if (formData.fileStatus == "SUBMITTED") {
							this.successResponse(res);
						} else {
							this.formService.submitFormData(this.formId).subscribe(submitResp => {
								if (submitResp.success) {
									this.successResponse(res);
								}
							}, submitErr => {
								this.commonService.openAlert("Error", "Error Occured for final submit : " + submitErr.error[0].message, "warning")
							});
						}
					}, getError => {
						this.commonService.openAlert("Error", "Error Occured for final submit : " + getError.error[0].message, "warning")
					})
				} else {
					this.commonService.openAlert("Error", "Appointment Pending", "warning")
				}
				this.getSlot();
				this.appointmentList();

			}, err => {
				if (err.error[0]) {
					console.log(err.error[0].code);
					console.log(this.config.BOOKING_NOT_ALLOWED);
					if(err.error[0].code == this.config.BOOKING_NOT_ALLOWED){
						this.commonService.openAlert(this.config.BOOKING_NOT_ALLOWED, this.config.YOU_HAVE_RACHED_THE_MAXIMUM_RESCHEDULE_ATTEMPTS, "error");
					}
					if (err.error[0].code == this.config.ONLY_ONE_APPOINTMENT_ALLOWED_CODE) {
						this.commonService.openAlert(this.config.APPOINTMENT_SCHEDULE_ERROR, this.config.ONLY_ONE_APPOINTMENT_ALLOWED_ERROR_MESSAGE, "error");
					}
				}
			})
		}, reject => {
			//console.log("Rejected");
		});
	}

	/**
	 * Method is used to perform cancel slot event.
	 * @param uniqueId - appication unique id.
	 */
	redirectToCancel(uniqueId) {
		this.commonService.deleteAlert('Are you sure?', "", 'warning', '', performDelete => {
			this.appointmentService.cancelSlot(this.formId, uniqueId).subscribe(res => {
				this.commonService.successAlert('Cancelled!', '', 'success');
				this.modalRef.hide();
				//this.getSlot();
				this.appointmentList();
			}, err => {
				if (err.error[0] && err.error[0].code == this.config.NOT_ALLOWED_TO_CANCEL_CODE) {
					this.commonService.openAlert(this.config.APPOINTMENT_CANCELLAION_ERROR, this.config.NOT_ALLOWED_TO_CANCEL, "error");
				}
			});
		});
	}

	/**
	 * Method is used to success response with details.
	 * @param res - success response data
	 */
	successResponse(res) {
		let appdetailhtml = `			
		<div>
		<h1>Appointment Details</h1>
		<div class="alert alert-danger">
			Please Carry Orignal hard copy of all checklist document at marriage Registrar Office
		</div>
		<table class="table table-sm table-bordered">
			<tr>
			<th>Date Of Appointment</th>
			<td>` + this.properDate(res.start) + `</td>
			</tr>
			<tr>
			<th>Time Of Appointment</th>
			<td>` + this.properTime(res.start) + ` to ` + this.properTime(res.end) + `</td>
			</tr>
			<tr>
			<th>Visit Registrar Office Address</th>
			<td>` + res.resourceName + `</td>
			</tr>
		</table>
		<div class="alert alert-primary">
		 Note :-Please Re-Print your receipt with update Schedule date and time.
		</div>
		</div>`;

		this.commonService.openAlert("Schedule Appointment", "Appointment Scheduled Successfully", "info", appdetailhtml);
		let redirectUrl = ManageRoutes.getFullRoute('CITIZENMYAPPS');
		this.router.navigate([redirectUrl]);
	}

	/**
	* This method use for get appointment list 
	*/
	appointmentList() {
		this.appointmentService.appointmentList(this.formId).subscribe(res => {
			this.calcelslots = res.data;
			this.appointmentLength = this.calcelslots.length;
		}, err => {
			if (err.error[0])
				this.commonService.openAlert("error", err.error[0].code, "error");
		})
	}

	/**
	 * Used to return formatted date.
	 * @param date - string date.
	 */
	properDate(date: string) {
		return moment(date).format("DD/MM/YYYY");
	}

	/**
	 * Used to return formatted time.
	 * @param time - string time.
	 */
	properTime(time: string) {
		return moment(time).format("hh:mm A");
	}

	/**
	 * This method use to application print receipt.
	 * @param id citizen api code
	 * @param id citizen api name
	 * @param id citizen id
	 */
	printReceipt(apiCode: string, apiName: string, id: number) {

		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.printReceipt(id).subscribe(
			receiptResponse => {
				let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
				sectionToPrintReceipt.innerHTML = receiptResponse;
				setTimeout(() => {
					window.print();
				});
			},
			err => {
				this.commonService.openAlert('Error!', err.error[0].message, 'error');
			}
		);
	}

}
