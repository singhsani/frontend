import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable ,  merge ,  of as observableOf } from 'rxjs';
import { catchError ,  map ,  startWith ,  switchMap } from 'rxjs/operators';
import { ManageRoutes } from '../../../config/routes-conf';
import { CommonService } from '../../../shared/services/common.service';
import { HosPaginationService } from '../../../core/services/hospital/data-services/hos-pagination.service';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { HospitalConfig } from '../hospital-config';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-hos-my-applications',
	templateUrl: './hos-my-applications.component.html',
	styleUrls: ['./hos-my-applications.component.scss']
})
export class HosMyApplicationsComponent implements OnInit {

	@ViewChild("paymentGateway") paymentGateway: any;

	displayedColumns: any = [
		'id',
		'applicantName',
		'fileNumber',
		'dateOfApplication',
		'departmentName',
		'serviceType',
		'fileStatus',
		'action'
	];
	translateKey: string = "hosMyAppsScreen";

	dataSource = new MatTableDataSource();

	resultsLength: number = 0;
	pageSize: number = 5;
	isLoadingResults: boolean = true;

	modalRef: BsModalRef;
	JSONdata: any;

	appType: string = 'myApps';

	config: HospitalConfig = new HospitalConfig();

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private formService: HosFormActionsService,
		private paginationService: HosPaginationService,
		private router: Router,
		private commonService: CommonService,
		private modalService: BsModalService,
		private toastr: ToastrService
	) { }

	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.getAllData();
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
					this.isLoadingResults = true;
					this.paginationService.apiType = this.appType;
					this.paginationService.pageIndex = (this.paginator.pageIndex + 1);
					this.paginationService.pageSize = this.paginator.pageSize;
					return this.paginationService!.getAllData(); //NOSONAR
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
	 * This method is used to redirect on citizen form.
	 * @param id citizen api code
	 * @param id - citizen id 
	 */
	redirectToEdit(apiCode: string, id: number) {
		if (apiCode == 'HEL-BCR') {
			this.router.navigate([ManageRoutes.getFullRoute(apiCode + "-HOSPITAL"), id, apiCode]);
		} else {
			let redirectUrl = ManageRoutes.getFullRoute(apiCode);
			this.router.navigate([redirectUrl, id, apiCode]);
		}
	}

	/**
	 * This method use to delete citizen record.
	 * @param id citizen api code
	 * @param id citizen id
	 */
	deleteRecord(apiCode: string, id: number) {

		this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
			this.formService.deleteFormData(id).subscribe(
				res => {
					this.commonService.successAlert('Deleted!', '', 'success');
					this.getAllData();
				},
				err => {
					this.commonService.successAlert('Error!', err.error[0].message, 'error');
				}
			);
		});

	}

	/**
	* This method is used to redirect on appointment form.
	*/
	redirectAppointment(apiCode: string, id: number) {
		let redirectUrl = ManageRoutes.getFullRoute('SLOTBOOKING');
		this.router.navigate([redirectUrl, id, apiCode]);
	}

	/**
	 * This method use to delete citizen record.
	 * @param id citizen api code
	 * @param id citizen api name
	 * @param id citizen id
	 */
	submitRecord(apiCode: string, apiName: string, id: number) {

		this.commonService.submitAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
			this.formService.submitFormData(id).subscribe(
				res => {
					this.commonService.successAlert('Submited!', '', 'success');
					this.getAllData();
				},
				err => {
					//this.commonService.successAlert('Error!', err.error[0].message, 'error');
				}
			);
		});

	}

	/**
	 * This method use to delete citizen record.
	 * @param apiCode citizen api code
	 * @param apiName citizen api name
	 * @param id citizen id
	 */
	printReceipt(apiCode: string, apiName: string, id: number) {

		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.printReceipt(id).subscribe(
			res => {
				let sectionToPrint: any = document.getElementById('sectionToPrint');
				sectionToPrint.innerHTML = res;
				setTimeout(() => {
					window.print();
				});
			},
			err => {
				//this.commonService.successAlert('Error!', err.error[0].message, 'error');
			}
		);

	}

	/**
	 * This method is use to get respective class name based on application status.
	 * @param filestatus - Application Status
	 */
	getFileStatusClass(filestatus: string) {
		switch (filestatus) {
			case 'DRAFT':
				return 'badge draft text-label';
			case 'SUBMITTED':
				return 'badge submited text-label';
			case 'PAYMENT':
				return 'badge rejected text-label';
			default:
				return 'badge file text-label'
		}
	}

	/**
	 * This method is use for open modal.
	 */
	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	/**
	 * This method is use to show JOSN format.
	 */
	jsonDisplay(apiCode: string, apiName: string, id: number) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.viewJson(id).subscribe(
			res => {
				this.JSONdata = JSON.stringify(res, null, 4);
			},
			err => {
				this.commonService.successAlert('Error!', err.error[0].message, 'error');
			}
		);

	}

	/**
	 * This method is use for copy text.
	 */
	copyText(copytext: any) {
		copytext.select();
		document.execCommand('copy');
	}

	/**
 * This method use to application print view.
 * @param apiCode citizen api code
 * @param apiName citizen api name
 * @param id citizen id
 */
	printView(apiCode: string, apiName: string, id: number) {
	
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.printView(id).subscribe(htmlResponse => {
				let sectionToPrint: any = document.getElementById('sectionToPrint');
				sectionToPrint.innerHTML = htmlResponse;
				setTimeout(() => {
					window.print();
				});
			},
			err => {
				//this.commonService.successAlert('Error!', err.error[0].message, 'error');
			}
		);
	}

		/**
	 * This method is used to redirect on payment.
	 * @param id citizen api code
	 * @param id - citizen id 
	 */
	redirectToPayment(apiCode: string, id: number) {
		// let redirectUrl = ManageRoutes.getFullRoute(apiCode);
		// this.router.navigate([redirectUrl, id, apiCode]);

		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.submitFormData(id).subscribe(
			res => {
				this.toastr.success("No payment option");
				this.router.navigateByUrl(ManageRoutes.getFullRoute("HOSPITALMYAPPS"));
			},
			err => {
				let retUrl: string = '/hospital/my-applications';
				let retAfterPayment :string = environment.returnhosUrl;
				
				if (err.status === 402) {
					let payData = this.commonService.storePaymentInfo(err.error.data, retUrl,retAfterPayment);
					let html =
						`
					<div class="text-center">
						<h2>Total Fee Pay</h2>
						<div class="payAmount">
							<i class="fa fa-inr" aria-hidden="true">` + payData.amount + `</i>
						</div>
						<p>Rupees in words</p>
					</div>
					`

					this.commonService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, html, cb => {
						// this.formService.createTokenforServicePayment(payData).subscribe(resp => {
						// 	window.open(resp.data, "_self");
						// }, err => {
						// 	this.toastr.error(err.error.message);
						// })
						this.paymentGateway.setPaymentDetailsFromActionBar(payData);
						this.paymentGateway.openModel();

					}, rj => {
						// let errHtml = `			
						// 	<div class="alert alert-danger">
						// 		Please Complete Payment, Otherwise the application will be considered as in-complete
						// 	</div>`
						// this.commonService.commonAlert("Application Incomplete", "", 'warning', 'Make Payment!', false, errHtml, ccb => {
						// 	this.formService.createTokenforServicePayment(payData).subscribe(resp => {
						// 		window.open(resp.data, "_self");
						// 	}, err => {
						// 		this.toastr.error(err.error.message);
						// 	})

						// }, arj => {

						// })
						// return;
					});
					return;
				} else {
					this.commonService.openAlert("Error", "Error Occured for final submit : " + err.error[0].message, "warning")
				}
			});
	}


}
