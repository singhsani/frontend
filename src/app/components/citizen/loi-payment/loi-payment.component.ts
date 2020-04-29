import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../shared/services/common.service';
import { ManageRoutes } from '../../../config/routes-conf';
import * as moment from 'moment'
import { CitizenConfig } from '../citizen-config';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { SelectionModel } from '@angular/cdk/collections';
import { SessionStorageService } from 'angular-web-storage';

export interface PeriodicElement {
	loiNumber: string;
	amount: number;
	action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [

	// { amount: 100, loiNumber: 'MKT-LOI-000000007', action: 'tryrtytr' },
	// { amount: 7, loiNumber: 'Nitrogen', action: '' },
	// { amount: 8, loiNumber: 'Oxygen', action: 15.9994 },
	// { amount: 9, loiNumber: 'Fluorine', action: 18.9984 },
	// { amount: 10, loiNumber: 'Neon', action: 20.1797 },
];




@Component({
	selector: 'loi-payment',
	templateUrl: './loi-payment.component.html',
	styleUrls: ['./loi-payment.component.scss']
})
export class LoiPaymentComponent implements OnInit {

	@ViewChild("paymentGateway") paymentGateway: any;


	loiPaymentForm: FormGroup;
	applicationNumber;
	uniqueId: string;
	id: number;
	code: string;

	translateKey: string = 'LOI Payments';
	config: CitizenConfig = new CitizenConfig();
	loiDetails: any = [];

	// displayedColumns: string[] = ['select', 'loiNumber', 'amount', 'action'];
	// dataSource = new MatTableDataSource();
	// selection = new SelectionModel<any>(true, []);
	selectedArray = [];

	displayedColumns: string[] = ['select', 'loiNumber', 'amount', 'action'];
	dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	selection = new SelectionModel<PeriodicElement>(true, []);
	ShowTable = false;
	filterData: any;
	sum: any;


	constructor(
		private formService: FormsActionsService,
		private fb: FormBuilder, private session: SessionStorageService,
		// private paginationService: PaginationService,
		private router: Router,
		private commonService: CommonService,
		// private modalService: BsModalService,
		private toastr: ToastrService,
		private route: ActivatedRoute,
	) {

		this.route.paramMap.subscribe(param => {
			console.log('param', param);
			this.uniqueId = param.get('uniqueId');
			this.id = Number(param.get('id'));
			this.code = param.get('code');
		});
	}

	ngOnInit() {
		this.getLoiDetaiol();
	}

	getLoiDetaiol() {
		this.formService.getLoiPaymentDetails(this.uniqueId).subscribe(res => {
			if (res.data.length > 0) {
				this.applicationNumber = res.data[0].applicationId;
				this.loiDetails = res.data;

				console.log('**********', this.loiDetails.filter((obj, pos, arr) => {
					return arr.map(mapObj => mapObj["value"]).indexOf(obj["value"]) === pos;
				}));
			}
		}
			, err => {
				this.commonService.openAlert("Warning", "Something Went Wrong", "warning");
			}
		);
	}

	// isAllSelected() {
	// 	const numSelected = this.selection.selected.length;
	// 	const numRows = this.dataSource.data.length;
	// 	return numSelected === numRows;
	// }

	/**
	 * For Checkbox in Mat-Table
	 */
	// checkboxLabel(row?: any): string {
	// 	if (!row) {
	// 		return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
	// 	}
	// 	return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
	// }
	// masterToggle() {
	// 	this.isAllSelected() ?
	// 		this.selection.clear() :
	// 		this.dataSource.data.forEach(row => this.selection.select(row));
	// }
	onItemChange(event) {
		this.filterData = [];
		this.ShowTable = true;
		this.filterData = this.loiDetails.filter(element => element.loiNumber === event.target.defaultValue);
		this.sum = this.filterData[0].amount;
		console.log('sum', this.sum);

	}
	makePayment(loiNumber: any) {
		console.log('make Payment', loiNumber);
		this.redirectToPayment(this.code, this.id, loiNumber);
	}

	redirectToPayment(apiCode: string, id: number, loiNumber) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.submitFormDataForLOI(id, loiNumber).subscribe(
			res => {
				this.toastr.success("No payment option");
				this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
			},
			err => {
				let retUrl: string = '/citizen/my-applications';
				let retAfterPayment: string = environment.returnUrl;

				if (err.status === 402) {
					let payData = this.commonService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);
					payData.loiNumber = loiNumber;
					this.session.set('lioNumber', loiNumber);
					let html =
						`
					<div class="text-center">
						<h2>Total LOI Payment</h2>
						<div class="payAmount">
							<i class="fa fa-inr" aria-hidden="true">` + payData.amount + `</i>
						</div>
						<p>Rupees in words</p>
					</div>
					`

					this.commonService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, html, cb => {
						this.paymentGateway.setPaymentDetailsFromActionBar(payData);
						this.paymentGateway.openModel();

					}, rj => {
					});
					return;
				} else {
					this.commonService.openAlert("Error", "Error Occured for final submit : " + err.error[0].message, "warning")
				}
			});

	}



}