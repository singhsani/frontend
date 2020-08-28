import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { MatPaginator, MatSort, MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { Observable, merge, of as observableOf, from } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { PaginationService } from '../../../core/services/citizen/data-services/pagination.service';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../shared/services/common.service';
import { ManageRoutes } from '../../../config/routes-conf';
import * as moment from 'moment'
import { CitizenConfig } from '../citizen-config';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { OfflinePaymentComponent } from 'src/app/shared/components/offline-payment/offline-payment.component';
import { Location } from '@angular/common';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { PaymentService} from 'src/app/vmcshared/component/payment/payment.service'
import { PaymentNewService } from 'src/app/shared/services/paymentNew.service';
@Component({
	selector: 'app-my-applications',
	templateUrl: './my-applications.component.html',
	styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit,OnChanges {

	@ViewChild("paymentGateway") paymentGateway: any;

	@Input() inputData : any;
	@Input() fromOtherModule = false;

	/**
	 * displayColumns are used for display the columns in material table.
	 */
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

	/**
	 * Used for material table data population and pagination.
	 */
	dataSource = new MatTableDataSource();
	resultsLength: number = 0;
	pageSize: number = 5;
	isLoadingResults: boolean = true;
	translateKey: string = "myApplicationScreen";

	appType: string = 'myApps';

	modalRef: BsModalRef;
	JSONdata: any;
	rejectRemarks: string = '';
	reason: string = '';

	queryrraiseRemarks: string = '';
	queryrraisereason: string = '';


	config: CitizenConfig = new CitizenConfig();

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(
		private formService: FormsActionsService,
		private paginationService: PaginationService,
		private router: Router,
		public commonService: CommonService,
		private modalService: BsModalService,
		private toastr: ToastrService,
		private dialog: MatDialog,
		private route: ActivatedRoute,
		private location: Location,
		private paymentService : PaymentService
	) { 



	}

	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

		this.getAllData();

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

	ngOnChanges(){
		this.getAllData();
	}

	/**
	 * This method use to get all the citizen data with pagination.
	 */
	getAllData() {
		if (this.fromOtherModule) {
			this.dataSource.data = [];
			if(this.inputData){
				this.paginator.pageSize = 1;
				this.paginator.pageIndex = 0;
				this.dataSource.data = this.inputData;
				this.resultsLength = this.inputData.length ;
				this.isLoadingResults = false;
			}
			
		} else {
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
						return this.paginationService!.getAllData();// NOSONAR
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
					this.isLoadingResults = false;
					this.dataSource.data = data;
				}
				);
		}
		
	}

	/**
	 * This method is used to redirect on citizen form.
	 * @param id citizen api code
	 * @param id - citizen id
	 */
	redirectToEdit(apiCode: string, id: number) {
		
		if (apiCode == 'HEL-DR') {
			this.router.navigate(['citizen/certificates/birth-death/deathReg', id, apiCode]);

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
				},300);
			},
			err => {
				this.commonService.openAlert('Error!', err.error[0].message, 'error');
			}
		);
	}

	printCertificate(applicationNum) {
		const url = "/property/noduecertificate/printNodueCertificate?applicationNo=" + applicationNum;

		this.paymentService.downloadFile(url).subscribe(
			(data) => {
				downloadFile(data, "certificate" + "-" + Date.now() + ".pdf", 'application/pdf');
			},
			(error) => {
				console.error(error.error.message);
			})

	}


	/**
     * This method use to application print view.
     * @param id citizen api code
     * @param id citizen api name
     * @param id citizen id
     */
	printView(apiCode: string, apiName: string, id: number) {

		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.printView(id).subscribe(
			htmlResponse => {
				// let sectionToPrint: any = document.getElementById('sectionToPrint');
				// sectionToPrint.innerHTML = htmlResponse;
				// setTimeout(() => {
				// 	window.print();
				// });
				let printWindow: any = window.open();
				setTimeout(() => {
					printWindow.document.body.innerHTML = htmlResponse;
					printWindow.print();
					printWindow.close();
				}, 100);
			},
			err => {
				//this.commonService.successAlert('Error!', err.error[0].message, 'error');
			}
		);
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
	 * This method is use to show reject remarks.
	 */
	// remarksDisplay(data) {
	// 	this.rejectRemarks = data.remarks;
	// 	this.reason = data.reason;
	// }

	/**
	 * This method is use for copy text.
	 */
	copyText(copytext: any) {
		copytext.select();
		document.execCommand('copy');
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
			case 'REJECTED':
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

	getProperDate(date: string): string {
		if (date) return moment(date).format("DD/MM/YYYY");
		return null;
	}

	/**
	 * This method is use for display more button
	 * @param row - Table row oject
	 */
	isMoreBtnVisible(row) {
		if (!row.remarks && (row.serviceType === 'PEC_REG' || row.serviceType === 'PRC_REG'))
			return false;
		else
			return true;
	}

	/**
	 * This method is use for edit option
	 * @param row - Table row oject
	 */
	isEditOptDisplay(row) {
		if (row.serviceType === 'PEC_REG' && row.serviceType === 'PRC_REG')
			return false;
		else if (row.canEdit || row.fileStatus === 'QUERIED' || row.fileStatus === 'QUERY_RAISED')
			return true;
	}

	/**
	 * This method is use for delete option
	 * @param row - Table row oject
	 */
	isDeleteOptDisplay(row) {
		if (row.canDelete)
			return true;
	}

	/**
	 * This method is use for preview option
	 * @param row - Table row oject
	 */
	isPreviewOptDisplay(row) {
		if (row.serviceType === 'PEC_REG' || row.serviceType === 'PRC_REG')
			return false;
		else if (!row.canEdit)
			return true;
	}

	/**
	 * This method is use for print view option
	 * @param row - Table row oject
	 */
	isPrintViewDisplay(row) {
		if (row.serviceType === 'PEC_REG' || row.serviceType === 'PRC_REG')
			return false;
		else if (row.fileStatus != 'DRAFT')
			return true;
	}

	isDownloadDisplay(row){
		if(row.fileStatus =='SCRUTINY')
		return true;
	}
	/**
	 * This method is use for application json option
	 * @param row - Table row oject
	 */
	isAppJsonOptDisplay(row) {
		if (row.serviceType === 'PEC_REG' || row.serviceType === 'PRC_REG')
			return false;
		else
			return true;
	}

	/**
	 * This method is use for application json option
	 * @param row - Table row oject
	 */
	isRejectNoteOptDisplay(row) {
		if (row.remarks)
			return true;
		else
			return false;
	}

	getInnerHTML() {
		return `<b>Remarks :</b> ${this.rejectRemarks} <br> <b>Reason :</b> ${this.reason}`;
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
				this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
			},
			err => {
				let retUrl: string = '/citizen/my-applications?apiCode='+ apiCode + '&id=' + id  ;
				let retAfterPayment: string = environment.returnUrl;
			    if(this.fromOtherModule){
					retUrl = '/citizen/payable-services?apiCode='+ apiCode + '&id=' + id;
				}

				if (err.status === 402) {
					let payData = this.commonService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);
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
					if (this.commonService.fromAdmin()) {
						this.openOfflinePaymentComponent(payData,retUrl,apiCode,id);
					} else {
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
					}

					
				} else {
					this.commonService.openAlert("Error", "Error Occured for final submit : " + err.error[0].message, "warning")
				}
			});

	}



	/**
	 * This method is use to show For Query Raise remarks.
	 */
	remarksDisplayForQueryRaise(data) {
		this.queryrraiseRemarks = data.remarks;
		//this.queryrraiseRemarks = 'Remark here';
		// this.queryrraisereason = data.reason;
		//this.queryrraisereason = 'Remark reason here';
	}



	getInnerHTMLForRemark() {
		return `<b>Remarks :</b> ${this.queryrraiseRemarks}`;
	}

	isQueryRaiseDisplay(row) {
		if(row.fileStatus === 'QUERY_RAISED'){
			return true;
		}else{
			return false;
		}
		
	}

	isDownloadLOI(row) {
		// if (row.fileStatus != 'DRAFT') {
		// 	return true;
		// }
		return true;
	}

	getLoi(row) {
		console.log("Download LOI", row);
	}
	loiPayments(row){
		this.router.navigate(['/citizen/loi-payments', row.uniqueId, row.id, row.serviceDetail.code]);
	}

	openOfflinePaymentComponent(payData,retUrl,apiCode,id) {
		const dialogConfig = new MatDialogConfig();
		const data = { payData: payData }
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.data = data;
		dialogConfig.width = "60%"
		const dialogRef = this.dialog.open(OfflinePaymentComponent, dialogConfig);


		dialogRef.afterClosed().subscribe(offlinePayData => {
			if (offlinePayData) {
				offlinePayData.refNumber = payData.refNumber;
				offlinePayData.response = payData.response;
				offlinePayData.paymentStatus = "SUCCESS",
				offlinePayData.transactionId =  payData.transactionId,
				offlinePayData.payableServiceType = payData.serviceCode,
				offlinePayData.amount = payData.amount;
				offlinePayData.payGateway = "OFFLINE"


				this.formService.createPayment(offlinePayData).subscribe(resData => {
					const payRespData = resData.data.responseData;
					if(resData.paymentStatus = "Paid"){
						this.formService.submitFormData(payRespData.serviceFormId).subscribe(res => {
							if (res) {
								this.router.navigate([ retUrl.split('?')[0] ], { queryParams: { apiCode: apiCode, id: id } });
							}
						});
						
					}
					this.getAllData()
				}, error => {
					this.openErrorAlert(error);
				})
			}
		}, error => {
			this.openErrorAlert(error);
		})



	}

	openErrorAlert(error){
		if(error & error.error[0]){
			this.commonService.openAlert("Error", "Error Occured for final submit : "
					 + error.error[0].message, "warning");
		}else{
			this.commonService.openAlert("Error", "Something went wrong","warning");
		}
	}

}