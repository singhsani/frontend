import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, RouterLinkWithHref } from '@angular/router';
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
import { downloadFile, downloadFileAndSave } from 'src/app/vmcshared/downloadFile';
import { PaymentService } from 'src/app/vmcshared/component/payment/payment.service'
import { PaymentNewService } from 'src/app/shared/services/paymentNew.service';

@Component({
	selector: 'app-my-applications',
	templateUrl: './my-applications.component.html',
	styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit, OnChanges {
	@ViewChild("paymentGateway") paymentGateway: any;
	@Input() inputData: any;
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
	statusHeader: string = '';
	queryrraisereason: string = '';
	config: CitizenConfig = new CitizenConfig();
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	urlMap = new Map([
		["PRO-TAX-REBATE", "property/taxrebate/application/printReceiptForPayment"],
		["PRO-REFUND", "property/refundagainstvacancy/printReceiptForPayment"]
	]);
	remarkMessage: any =[];
	remarkField: any =[];
	serviceType: string='';

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
		private paymentService: PaymentService
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
			if (d.printPaymentReceipt && d.apiCode && d.id) {
				this.printPaymentReceipt(d.apiCode, d.id);
				setTimeout(() => {
					this.router.navigateByUrl(this.router.url.split('?')[0]);
				}, 3000);
			} else if (d.apiCode == 'CONTRACTOR_REGISTRATION' && d.id && d.fileStatus == 'APPROVED') {
				this.contractorDepositReceived(d.id);
				setTimeout(() => {
					this.location.go(this.router.url.split('?')[0]);
				}, 3000);
			}else if(d.apiCode == 'VENDOR_REG' && d.id && d.fileStatus == 'APPROVED'){
				this.depositReceived(d.id);
				setTimeout(() => {
					this.location.go(this.router.url.split('?')[0]);
				}, 3000);
			}else if(d.apiCode && d.id){
				this.printReceipt(d.apiCode, '', d.id);
				setTimeout(() => {
					this.location.go(this.router.url.split('?')[0]);
				}, 3000);
			}
			else if(d.serviceType == 'VEHICLE'){
				this.printReceipt(d.resourceType, '', d.refNumber);
				setTimeout(() => {
					this.location.go(this.router.url.split('?')[0]);
				}, 3000);
			}

			else if(d.serviceType == 'PFT_REG_CER'){
				this.printReceipt1(d.resourceType, '', d.refNumber);
				setTimeout(() => {
					this.location.go(this.router.url.split('?')[0]);
				}, 3000);
			}
		})
	}
	ngOnChanges() {
		this.getAllData();
	}

	swichCaseCondition(row) {
		if (row.serviceType == 'VEHICLE' || row.serviceType == 'PEC_REG' 
			|| row.serviceType == 'PRC_REG' || row.serviceType == 'PAY_PROF_TAX') {
			return `case1`;
		} else if (row.departmentName == 'Property Tax' || row.departmentName == 'WATER-SUPPLY') {
			return `case2`;
		} else if (row.departmentName == 'Vendor Registration' && row.fileStatusName == 'Deposit Received') {
			return `case4`;
		} else if (row.departmentName == 'Vendor Registration' && row.fileStatusName == 'Scrutiny') {
            return `case4`;	
		} else if(row.departmentName == 'Contractor Registration' && row.fileStatusName == 'Deposit Received'){
			return `case5`
		}else if((row.departmentName == 'Contractor Registration' && row.fileStatusName == 'Approved') || (row.departmentName == "Vendor Registration" && row.fileStatusName == 'Approved')){
			return `case6`
		} else if (row.departmentName == 'Vendor Registration' && row.fileStatusName == 'Payment Received' || row.fileStatusName == 'Payment Pending') {
			return `case7`;	
		}else if((row.serviceType=='PFT_REG_CER' && row.fileStatusName=='Payment Received') ||  (row.serviceType=='PFT_REG_CER' && row.fileStatusName=='Approved') || (row.serviceType=='PFT_REG_CER' && row.fileStatusName=='Submitted')){
		    return `case9`;
		}
		else{
			return `case3`
		}
	}


	printCertificate1(apiCode: string, apiName: string, id: number) {
		this.formService.printProfCertificate(id).subscribe(
			receiptResponse => {
				downloadFileAndSave(receiptResponse, "Certificate" + "-" + Date.now() + ".pdf");
				setTimeout(() => {
				}, 300);
			},
			err => {
				this.commonService.openAlert('Error!', err.error[0].message, 'error');
			}
		);
	}
	/**
	 * This method use to get all the citizen data with pagination.
	 */
	getAllData() {
		if (this.fromOtherModule) {
			this.dataSource.data = [];
			if (this.inputData) {
				this.paginator.pageSize = 1;
				this.paginator.pageIndex = 0;
				this.dataSource.data = this.inputData;
				this.resultsLength = this.inputData.length;
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
		}else if(apiCode == 'VENDOR_REG') {
			this.router.navigate(['citizen/engineering/vendor-registration', id, apiCode, 'DRAFT']);
		}
		else {
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

				if (receiptResponse == null || receiptResponse == "") {
					this.commonService.openAlert('Message!', "Print Receipt Not Available !!!", 'warning');
					return false;
				}

				let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
				sectionToPrintReceipt.innerHTML = receiptResponse;
				setTimeout(() => {
					window.print();
				}, 300);
			},
			err => {
				this.commonService.openAlert('Error!', err.error[0].message, 'error');
			}
		);
	}

	printReceipt1(apiCode: string, apiName: string, id: number) {
		//this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.printProfReceipt1(id).subscribe(
			receiptResponse => {

				if (receiptResponse == null || receiptResponse == "") {
					this.commonService.openAlert('Message!', "Print Receipt Not Available !!!", 'warning');
					return false;
				}

				let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
				sectionToPrintReceipt.innerHTML = receiptResponse;
				setTimeout(() => {
					window.print();
				}, 300);
			},
			err => {
				this.commonService.openAlert('Error!', err.error[0].message, 'error');
			}
		);
	}

	printPecPrcReceipt(apiCode: string, apiName: string, id: number) {
		this.router.navigate(['citizen/pec-prc-receipt', id, apiCode]);
	}

	infoVehiclePending(amount, wardNumber) {
		this.commonService.infoAlert('Payment Remarks', 'Please make the payment of amount Rs. ' + amount +' at Ward office no. ' + wardNumber, "success");
	}
	infoVehiclePaymentRefund(amount, wardNumber) {
		this.commonService.infoAlert('Payment Done', 'Please wait for the refund amount Rs. ' + amount +' at Ward office no. ' + wardNumber, "success");
	}
	infoProfessionalPaymentPending(){
		this.commonService.infoAlert('Payment Remarks','Please Contact to Department & Make Payment',"success");
	}
	cancelReasonReceipt(row) {
		this.formService.cancelReceiptForShop(row.fileNumber).subscribe(
			receiptResponse => {
				let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
				sectionToPrintReceipt.innerHTML = receiptResponse;
				setTimeout(() => {
					window.print();
				}, 300);
			},
			err => {
				this.commonService.openAlert('Error!', err.error[0].message, 'error');
			}
		);
	}

	// printCertificate(applicationNum) {

	// 	const url = "/property/noduecertificate/printNodueCertificate?applicationNo=" + applicationNum;
	// 	this.paymentService.downloadFile(url).subscribe(
	// 		(data) => {
	// 			downloadFile(data, "certificate" + "-" + Date.now() + ".pdf", 'application/pdf');
	// 		},
	// 		(error) => {
	// 			console.error(error.error.message);
	// 		})
	// }

	printCertificate(row) {
		let url = "";
		if (row.serviceType === 'NO_DUE_CERTIFICATE') {
			url = "/property/noduecertificate/printNodueCertificate?applicationNo=" + row.fileNumber;
		} else if (row.serviceType === 'EXTRACT_OF_PROPERTY') {
			let reporttype = 'propertyExtractCertificate';
			url = "/property/extract/print?reporttype=" + reporttype + "&applicationNo=" + row.fileNumber;
		} else if (row.serviceType === 'ASSESSMENT_CERTIFICATE') {
			url = "/property/assessmentcertificate/print?applicationNo=" + row.fileNumber;
		}
		else if (row.serviceType === 'DUPLICATE_BILL') {
			url = "/api/form/duplicateBill/printBill?serviceFormId=" + row.serviceFormId;
		}else if (row.serviceType === 'VACANT_PREMISES_CERTIFICATE' && row.fileStatus === 'APPROVED') {
			url = "/api/form/vacantPremisesCertificate/printApprovedCertificate?applicationNo=" + row.fileNumber;
		}
		else if (row.serviceType === 'VACANT_PREMISES_CERTIFICATE' && row.fileStatus === 'REJECTED') {
			url = "/api/form/vacantPremisesCertificate/printRejectedCertificate?applicationNo=" + row.fileNumber;
		}
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
		if (apiCode == 'SHOP-ESTAB-TRANSFER') {
			this.formService.apiType = 'shop';
		} else {
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		}
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

	remarksDisplay(data) {
		this.rejectRemarks = data.remarks;
	}
	remarksForPec(data){
		    this.queryrraiseRemarks = data.remarks;
			this.statusHeader = data.fileStatusName;
			this.queryrraisereason = data.reason;
	}
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
		if (row.canEdit) {
			return true;
		}
		if (row.serviceType === 'PEC_REG' && row.serviceType === 'PRC_REG' || row.serviceType ===
			'NO_DUE_CERTIFICATE' || row.serviceType === 'ASSESSMENT_CERTIFICATE')
			return false;

		if (row.fileStatus === 'REJECTED' && row.serviceType === 'FS_FIRE_CERTIFICATE' ||
			row.serviceType === 'FS_GAS_CONNECTION_NOC' ||
			row.serviceType === 'FS_ELECTRIC_CONNECTION_NOC' ||
			row.serviceType === 'FS_WATER_TANKER' ||
			row.serviceType === 'MARRIAGE_REGISTRATION') {
			return false;
		}

		else if (row.serviceType == "AFFORD_HOUSE" && row.fileStatus != "PAYMENT_RECEIVED") {
			return true;
		}
		else if (row.canEdit || row.fileStatus === 'QUERIED' || row.fileStatus === 'QUERY_RAISED')
			return true;
		else if (row.fileStatus === 'REJECTED')
			return false;
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

		const preViewDisplayServiceTypeArr = ['FS_REVISED_FIRE_NOC', 'FS_RENEWAL_NOC', 'FS_TEMP_STRUCT_NOC', 'FS_TEMP_FIREWORKSHOP_NOC', 'FS_FINAL_FIRE_NOC', 'FS_PROVISIONAL_HOSPITAL_NOC', 'FS_PROVISIONAL_NOC',
			'FS_FIRE_CERTIFICATE', 'FS_WATER_TANKER', 'FS_FINAL_HOSPITAL_NOC', 'FS_ELECTRIC_CONNECTION_NOC', 'FS_NAVARATRI_NOC', 'FS_GAS_CONNECTION_NOC', 'CREMATION_REGISTRATION']

		if ((row.serviceType === 'SHOP_ESTAB_APPLICATION' && row.fileStatus === 'APPROVED') || (row.serviceType === 'SHOP_ESTAB_APPLICATION' && row.fileStatus === 'REJECTED')
			|| (row.serviceType === 'SHOP_ESTAB_TRANSFER' && row.fileStatus === 'APPROVED') || (row.serviceType === 'SHOP_ESTAB_TRANSFER' && row.fileStatus === 'REJECTED')) {
			return true;
		}
   else  if ((row.fileStatus === 'SUBMITTED' || row.fileStatus == 'APPROVED' || row.fileStatus == 'PAYMENT_RECEIVED') && (row.serviceType === 'FS_FIRE_CERTIFICATE' ||
    row.serviceType === 'FS_GAS_CONNECTION_NOC' ||
    row.serviceType === 'FS_ELECTRIC_CONNECTION_NOC' ||
    row.serviceType === 'FS_WATER_TANKER')){
    return true;
  }


		else if ((row.serviceType === 'DUPLICATE_BIRTH_REGISTRATION' && row.fileStatus === 'APPROVED' || row.fileStatus === 'REJECTED') || (row.serviceType === 'DUPLICATE_DEATH_REGISTRATION' && row.fileStatus === 'APPROVED' || row.fileStatus === 'REJECTED')
			|| (row.serviceType === 'BIRTH_CORRECTION_REGISTRATION' && row.fileStatus === 'APPROVED' || row.fileStatus === 'REJECTED') || (row.serviceType === 'DEATH_CORRECTION_REGISTRATION' && row.fileStatus === 'APPROVED' || row.fileStatus === 'REJECTED')) {
			return true;
		}

		else if (row.serviceType == "AFFORD_HOUSE") {
			return false;
		}
		else if (row.serviceType === 'PEC_REG' || row.serviceType === 'PRC_REG' || row.serviceType ===
			'NO_DUE_CERTIFICATE' || row.serviceType === 'ASSESSMENT_CERTIFICATE' || row.fileStatus == 'APPROVED') {
			return false;
		}
		else if ((row.fileStatus == 'SUBMITTED' || row.fileStatus == 'APPROVED' || row.fileStatus == 'PAYMENT_RECEIVED' || row.fileStatus == 'PAYMENT' || row.fileStatus == 'SCRUTINY')
			&& preViewDisplayServiceTypeArr.indexOf(row.serviceType) > -1) {
			return false;
		}
		else if (row.serviceType == 'APL_LICENCE' || row.serviceType == 'APL_RENEWAL' || row.serviceType == 'POND_TRANSFER'
			|| row.serviceType == 'POND_CANCELLATION' || row.serviceType == 'POND_DUPLICATION' && row.fileStatus == 'PAYMENT_RECEIVED' || row.fileStatus == 'SCRUTINY') {
			return false;
		}

		else if (row.serviceType == 'VENDOR_REG' && row.fileStatus == 'PAYMENT_RECEIVED') {
			return false;

		}else if(row.serviceType == 'CONTRACTOR_REGISTRATION' && row.fileStatus == 'PAYMENT_RECEIVED'){
			return false;
		}
		else if (!row.canEdit) {
			return true;
		}
	}
	/**
	 * This method is use for print view option
	 * @param row - Table row oject
	 */
	isPrintViewDisplay(row) {

		const printViewServiceTypeArr = ['FS_FINAL_FIRE_NOC', 'FS_PROVISIONAL_NOC', 'FS_REVISED_FIRE_NOC', 'FS_RENEWAL_NOC', 'FS_TEMP_STRUCT_NOC', 'FS_TEMP_FIREWORKSHOP_NOC',
			'FS_FIRE_CERTIFICATE', 'FS_WATER_TANKER', 'FS_FINAL_HOSPITAL_NOC', 'FS_ELECTRIC_CONNECTION_NOC', 'FS_NAVARATRI_NOC', 'FS_GAS_CONNECTION_NOC', 'CREMATION_REGISTRATION']

		if (row.serviceType == "AFFORD_HOUSE" && row.fileStatus == "PAYMENT_RECEIVED") {
			return true;
		}

		if(row.serviceType == "VENDOR_REG" && row.fileStatus == "PAYMENT_RECEIVED"){
			return true;
		}

		if (row.fileStatus === 'REJECTED' && row.serviceType === 'FS_FIRE_CERTIFICATE' ||
			row.serviceType === 'FS_GAS_CONNECTION_NOC' ||
			row.serviceType === 'FS_ELECTRIC_CONNECTION_NOC' ||
			row.serviceType === 'FS_WATER_TANKER') {
			return false;
		}

		if ((row.fileStatus == 'SUBMITTED' || row.fileStatus == 'APPROVED' || row.fileStatus == 'PAYMENT_RECEIVED') || row.fileStatus == 'PAYMENT' || row.fileStatus == 'SCRUTINY' && printViewServiceTypeArr.indexOf(row.serviceType) > -1) {
			return false
		}
		else if (row.serviceType === 'PEC_REG' || row.serviceType === 'PRC_REG' || row.serviceType ===
			'NO_DUE_CERTIFICATE' || row.serviceType === 'ASSESSMENT_CERTIFICATE' || row.serviceType == 'VEHICLE') {
			return false;
		}
		else if ((row.serviceType === 'DUPLICATE_BIRTH_REGISTRATION' && row.fileStatus === 'REJECTED') ||
			(row.serviceType === 'DUPLICATE_DEATH_REGISTRATION' && row.fileStatus === 'REJECTED') ||
			(row.serviceType === 'BIRTH_CORRECTION_REGISTRATION' && row.fileStatus === 'REJECTED') ||
			(row.serviceType === 'DEATH_CORRECTION_REGISTRATION' && row.fileStatus === 'REJECTED')) {
			return false;
		}
		else if (row.serviceType === 'SHOP_ESTAB_APPLICATION' && row.fileStatus == 'CANCELLED' &&!(this.commonService.fromAdmin())) {
			return true;
		}

		else if (row.serviceType == 'APL_LICENCE' || row.serviceType == 'APL_RENEWAL' || row.serviceType == 'POND_TRANSFER'
			|| row.serviceType == 'POND_CANCELLATION' || row.serviceType == 'POND_DUPLICATION') {
			return false;
		}

		else if (row.serviceType == 'MEAT_FISH_LICENCE' || row.fileStatus == 'REJECTED' || row.serviceType == "MEAT_FISH_TRANSFER" || row.serviceType == "MEAT_FISH_RENEWAL") {
			return false;
		}

		else if (row.fileStatus != 'DRAFT') {
			return true;
		}



	}

	isPrintReceipt(row) {
		const printReceiptServiceTypeArr = ['FS_FINAL_FIRE_NOC', 'FS_REVISED_FIRE_NOC', 'FS_RENEWAL_NOC', 'FS_TEMP_STRUCT_NOC', 'FS_TEMP_FIREWORKSHOP_NOC',
			'FS_FINAL_HOSPITAL_NOC', 'FS_NAVARATRI_NOC']

		if (row.fileStatus == 'SUBMITTED' && printReceiptServiceTypeArr.indexOf(row.serviceType) > 0) {
			return false
		}
		if (row.fileStatus == 'SUBMITTED' && row.serviceType == 'FS_WATER_TANKER') {
			return true;
		}
		if ((row.fileStatus == 'SUBMITTED' || row.fileStatus == 'APPROVED' || row.fileStatus == 'REJECTED') && row.serviceType == 'FS_PROVISIONAL_HOSPITAL_NOC') {
			return false;
		}
		if ((row.fileStatus == 'SUBMITTED' || row.fileStatus == 'APPROVED' || row.fileStatus == 'REJECTED') && row.serviceType == 'FS_PROVISIONAL_NOC') {
			return false;
		}

		if (row.fileStatus == "PAYMENT_RECEIVED" && row.serviceType == "FS_FIRE_CERTIFICATE") {
			return true;
		}
		if (row.fileStatus == "PAYMENT_RECEIVED" && row.serviceType == "FS_ELECTRIC_CONNECTION_NOC") {
			return true;
		}
		if (row.fileStatus == 'APPROVED' && (!row.fileNumber.indexOf("SHOP-RT")||!row.fileNumber.indexOf("SHOP-RC")) && row.serviceType == 'SHOP_ESTAB_TRANSFER') {
			return true;
		}
		if (row.fileStatus == 'APPROVED' && (!row.fileNumber.indexOf("SHOP-IR")||!row.fileNumber.indexOf("SHOP-IT")) && row.serviceType == 'SHOP_ESTAB_TRANSFER') {
			return false;
		}
		if (row.fileStatus == 'APPROVED' && (!row.fileNumber.indexOf("SHOP-RT")||!row.fileNumber.indexOf("SHOP-RC")) && row.serviceType == 'SHOP_ESTAB_APPLICATION') {
			return true;
		}
		if (row.fileStatus == 'APPROVED' && (!row.fileNumber.indexOf("SHOP-IR")||!row.fileNumber.indexOf("SHOP-IT")) && row.serviceType == 'SHOP_ESTAB_APPLICATION') {
			return false;
		}
		if (row.fileStatus == "PAYMENT_RECEIVED" && row.serviceType == "FS_GAS_CONNECTION_NOC") {
			return true;
		}
		const printReceiptServiceTypeForShopArr = ['SHOP_ESTAB_APPLICATION', 'SHOP_ESTAB_TRANSFER']
		if (( row.fileStatus == 'CANCELLED'  )
		&& printReceiptServiceTypeForShopArr.indexOf(row.serviceType) >= 0) {
			return false;
		}
		if (row.fileStatus == 'REJECTED' && row.serviceType == 'SHOP_ESTAB_TRANSFER') {
			return false;
		}

		if (row.fileStatus == 'SUBMITTED' && row.serviceType == 'FS_TEMP_STRUCT_NOC') {
			return false;
		}

		if (row.fileStatus == 'APPROVED' && row.serviceType == 'POND_CANCELLATION') {
			return false;
		}

		if (row.fileStatus == 'PAYMENT_RECEIVED' || row.fileStatus == 'APPROVED') {
			return true;
		}
		if (row.fileStatus == 'SUBMITTED' && row.serviceType == 'WATER_NEW_DRAINAGE_CONNECTION') {
			return true;
		}

		if (row.fileStatus == 'SUBMITTED' && row.serviceType == 'MARRIAGE_REGISTRATION') {
			return true;
		}
		if (row.fileStatus == 'SUBMITTED' && row.serviceType == 'DUPLICATE_MARRIAGE_REGISTRATION') {
			return true;
		}
		if (row.fileStatus === 'REJECTED') {
			return false;
		}
		else if ((row.serviceType === 'DUPLICATE_BIRTH_REGISTRATION' && (row.fileStatus === 'SUBMITTED' || row.fileStatus === 'REJECTED')) ||
			(row.serviceType === 'DUPLICATE_DEATH_REGISTRATION' && (row.fileStatus === 'SUBMITTED' || row.fileStatus === 'REJECTED')) ||
			(row.serviceType === 'BIRTH_CORRECTION_REGISTRATION' && (row.fileStatus === 'SUBMITTED' || row.fileStatus === 'REJECTED')) ||
			(row.serviceType === 'DEATH_CORRECTION_REGISTRATION' && (row.fileStatus === 'SUBMITTED'))) {
			return true;
		}
		else if (row.serviceType === 'DEATH_CORRECTION_REGISTRATION' && (row.fileStatus === 'REJECTED')) {
			return false;
		}

	}

	isDownloadDisplay(row) {

		const hideDownloadBtnServiceTypeArr = ['FS_FINAL_FIRE_NOC', 'FS_REVISED_FIRE_NOC', 'FS_RENEWAL_NOC', 'FS_TEMP_STRUCT_NOC', 'FS_TEMP_FIREWORKSHOP_NOC',
			'FS_FIRE_CERTIFICATE', 'FS_FINAL_HOSPITAL_NOC', 'FS_ELECTRIC_CONNECTION_NOC', 'FS_NAVARATRI_NOC', 'FS_GAS_CONNECTION_NOC']

		if (row.fileStatus == 'SCRUTINY' && hideDownloadBtnServiceTypeArr.indexOf(row.serviceType) > 0) {
			return true;
		}

		else if (row.fileStatus == 'SCRUTINY') {
			return true;
		}

	}
	/**
	 * This method is use for application json option
	 * @param row - Table row oject
	 */
	isAppJsonOptDisplay(row) {
		if (row.serviceType === 'PEC_REG' || row.serviceType === 'PRC_REG' || row.serviceType === 'SHOP_ESTAB_APPLICATION')
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
	isPrintReceiptPayment(row) {
		if (row.fileStatus == 'PAYMENT' && row.serviceType == 'MARRIAGE_REGISTRATION') {
			return true;
		}
		else if (row.fileStatus === 'PAYMENT' && row.serviceType === 'FS_FIRE_CERTIFICATE' ||
			row.serviceType === 'FS_GAS_CONNECTION_NOC' ||
			row.serviceType === 'FS_ELECTRIC_CONNECTION_NOC' ||
			row.serviceType === 'FS_WATER_TANKER') {
			return false;
		}
		else if (row.serviceType == "AFFORD_HOUSE") {
			return false;
		}
		else if (row.fileStatus == 'PAYMENT' && row.serviceType == 'MEAT_FISH_DUPLICATE') {
			return false;
		}
		else if (row.fileStatus == 'PAYMENT' )
			return true;
		else
			return false;
	}
	isPrintReceiptPaymentIntimation(row)
	{
		if (row.fileStatus == 'APPROVED' && (!row.fileNumber.indexOf("SHOP-IR")||!row.fileNumber.indexOf("SHOP-IT")) && row.serviceType == 'SHOP_ESTAB_TRANSFER') {
			return true;
		}
		if (row.fileStatus == 'APPROVED' && (!row.fileNumber.indexOf("SHOP-IR")||!row.fileNumber.indexOf("SHOP-IT")) && row.serviceType == 'SHOP_ESTAB_APPLICATION') {
			return true;
		}
	}
	isPrintReceiptAfterReschedule(row)
	{

		if(row.fileStatus == 'SUBMITTED'  && row.serviceType == 'MARRIAGE_REGISTRATION')
		{
		return true;
	}
}
	getInnerHTML() {
		return `<b>Remarks :</b> ${this.rejectRemarks}`;
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
        if(res.success==true){
          this.commonService.openAlert("Warning", "Please Enter Loi Number Generated By Newgen", "warning");
         }
		 else{
				this.toastr.success("No payment option");
				this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
		}
			},
			err => {
				let retUrl: string = '/citizen/my-applications?apiCode=' + apiCode + '&id=' + id;
				let retAfterPayment: string = environment.returnUrl;
				if (this.fromOtherModule) {
					retUrl = '/citizen/payable-services?apiCode=' + apiCode + '&id=' + id;
				}
				if (err.status === 402) {
					let payData = this.commonService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);
          // if(payData.amount==30){
          //   this.commonService.openAlert("Warning", "Please Enter Loi Number Generated By Newgen", "warning");
          // }
					let words = this.commonService.getToWords(payData.amount)
					let html =
						`
					<div class="text-center">
						<h2>Total Fee Pay</h2>
						<div class="payAmount">
							<i class="fa fa-inr" aria-hidden="true">` + payData.amount + `</i>
						</div>
						<p>Rupees in words</p>`
						+ words + `
					</div>
					`
					if (this.commonService.fromAdmin()) {
						this.openOfflinePaymentComponent(payData, retUrl, apiCode, id);
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

	/* Method to redirect to payable service from professional tax appoved application to make payment*/
	redirectToPayableService() {
		this.router.navigate(['/citizen/payable-services']);
	}
	/**
	 * This method is use to show For Query Raise remarks.
	 */
	remarksDisplayForQueryRaise(data: any) {
	    this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(data.serviceDetail.code);
		this.serviceType=data.serviceType;
		if(data.serviceType == 'MEAT_FISH_LICENCE' && data.fileStatus == 'QUERY_RAISED'){
			this.formService.getQueryData(data.id).subscribe(res=>{		
				for(let i=0;i<res.data.length;i++){
					res.data[i].queryList.forEach(element => {
						this.remarkMessage.push(element);
					});
				}
			})
			this.remarkMessage=[];
		}else{
			this.queryrraiseRemarks = data.remarks;
			this.statusHeader = data.fileStatusName;
			this.queryrraisereason = data.reason;
		}
		//this.queryrraiseRemarks = 'Remark here';
		
		//this.queryrraisereason = 'Remark reason here';
	}
	getInnerHTMLForRemark() {
		return `<b>Remarks :</b> ${this.queryrraiseRemarks}`;
	}
	getInnerHTMLForReason() {
		return `<b>Reason :</b> ${this.queryrraisereason}`;
	}
	copyInnerHTMLForRemark(val: string) {
		let selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = this.queryrraiseRemarks;
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);
	}

	isQueryRaiseDisplay(row) {
		if (row.fileStatus === 'QUERY_RAISED' || row.fileStatus === 'REJECTED') {
			return true;
		} else {
			return false;
		}
	}
	isDownloadLOI(row) {
		if (row.fileStatus != 'DRAFT') {
			return true;
		}
		return true;
	}
	getLoi(row) {
		console.log("Download LOI", row);
	}

	printLOIReceipt(apiCode: string, refNumber: string) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.getBase64StringURL(refNumber).subscribe(res => {
			if (res.success && res.displayForm) {
				this.viewBase64File(res.data);
			} else {
				this.toastr.error("You will get LOI after department process will be complete");
			}
		});
	}

	viewBase64File(url) {
		var iframe = "<iframe allowfullscreen border='0' style='margin:-8px' width='100%' height='100%' src='" + url + "'></iframe>"
		var x = window.open();
		if (!x || x.closed || typeof x.closed == 'undefined') {
			this.commonService.openAlert('Pop-up!', 'Please disable your Pop-up blocker and try again.', 'warning');
			return false;
		}
		x.document.open();
		x.document.write(iframe);
		x.document.close();
	}

	loiPayments(row) {
		this.router.navigate(['/citizen/loi-payments', row.uniqueId, row.id, row.serviceDetail.code]);
	}

	openOfflinePaymentComponent(payData, retUrl, apiCode, id) {
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
					offlinePayData.transactionId = payData.transactionId,
					offlinePayData.payableServiceType = payData.serviceCode,
					offlinePayData.amount = payData.amount;
				offlinePayData.payGateway = "OFFLINE"
				this.formService.createPayment(offlinePayData).subscribe(resData => {
					const payRespData = resData.data.responseData;
					if (resData.paymentStatus = "Paid") {
						this.formService.submitFormData(payRespData.serviceFormId).subscribe(res => {
							if (res) {
								this.router.navigate([retUrl.split('?')[0]], { queryParams: { apiCode: apiCode, id: id } });
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
	openErrorAlert(error) {
		if (error & error.error[0]) {
			this.commonService.openAlert("Error", "Error Occured for final submit : "
				+ error.error[0].message, "warning");
		} else {
			this.commonService.openAlert("Error", "Something went wrong", "warning");
		}
	}
	printPaymentReceipt(apiCode: string, id: number) {
		if (this.urlMap.has(apiCode)) {
			this.printPropertyACKReceiptAdmin(apiCode, id);
		} else {

			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
			this.formService.printPaymentReceipt(id).subscribe(
				receiptResponse => {
					let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
					sectionToPrintReceipt.innerHTML = receiptResponse;
					setTimeout(() => {
						window.print();
					}, 300);
				},
				err => {
					this.commonService.openAlert('Error!', err.error[0].message, 'error');
				}
			)
		}

	}
	printPaymentReceiptInti(apiCode: string, id: number) {

		if (this.urlMap.has(apiCode)) {
			this.printPropertyACKReceiptAdmin(apiCode, id);
		} else {

			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
			this.formService.printPaymentReceiptForShop(id).subscribe(
				receiptResponse => {
					let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
					sectionToPrintReceipt.innerHTML = receiptResponse;
					setTimeout(() => {
						window.print();
					}, 300);
				},
				err => {
					this.commonService.openAlert('Error!', err.error[0].message, 'error');
				}
			)
		}

	}


	PrintReceiptAfterReschedule(apiCode: string, id: number) {

		if (this.urlMap.has(apiCode)) {
			this.printPropertyACKReceiptAdmin(apiCode, id);
		} else {

			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
			this.formService.printAfterReschedule(id).subscribe(
				receiptResponse => {
					let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
					sectionToPrintReceipt.innerHTML = receiptResponse;
					setTimeout(() => {
						window.print();
					}, 300);
				},
				err => {
					this.commonService.openAlert('Error!', err.error[0].message, 'error');
				}
			)

		}

	}
	applicantName(row) {
		if (row.departmentName == "Contractor Registration") {
			return row.applicantName;
		} else if(row.fileStatusName == "Draft"){
			return "N/A";
		}else{
			return row.applicantName;
		}
	}
	// For Hide Admin side in Citizen Service process payment option

	// isShopHideButton(row) {

	// 	if ((this.commonService.fromAdmin() && row.serviceDetail.code == 'SHOP-ESTAB-LIC-NEW') || (this.commonService.fromAdmin() && row.serviceDetail.code == 'SHOP-ESTAB-TRANSFER')) {
	// 		return false;
	// 	} else {
	// 		return true;
	// 	}
	// }

	printPropertyACKReceipt(applicationNum, dept) {
		let url = "";
		if (dept === "WATER-SUPPLY") {
			url = "/water/ackReceipt?applicationNo=" + applicationNum;
		} else {
			url = "/property/ack?applicationNo=" + applicationNum;
		}
		this.paymentService.downloadFile(url).subscribe(
			(data) => {
				downloadFile(data, "certificate" + "-" + Date.now() + ".pdf", 'application/pdf');
			},
			(error) => {
				console.error(error.error.message);
			})
	}

	printPropertyACKReceiptAdmin(apiCode, id) {

		let url = this.urlMap.get(apiCode);
		console.log('url - > ', url);
		this.formService.printPaymentAckReceipt(id, url).subscribe(
			receiptResponse => {
				let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
				sectionToPrintReceipt.innerHTML = receiptResponse;
				setTimeout(() => {
					window.print();
				}, 300);
			},
			err => {
				this.commonService.openAlert('Error!', err.error[0].message, 'error');
			}
		)


	}

	// for deposit Receipt in vendor
	depositReceived(serviceId) {
		this.formService.nonRefundableCollection(serviceId).subscribe(res => {
			let sectionToPrint: any = document.getElementById('sectionToPrint');
			sectionToPrint.innerHTML = res;
			setTimeout(() => {
				window.print();
			});
		})
	}

	//for deposit Receipt in Contractor

	contractorDepositReceived(serviceId) {
		this.formService.nonRefundableCollections(serviceId).subscribe(res => {
			let sectionToPrint: any = document.getElementById('sectionToPrint');
			sectionToPrint.innerHTML = res;
			setTimeout(() => {
				window.print();
			});
		})
	}

	//for Deposit Payment in Contractor Registration
	depositPayment(apiCode: string, id: number, fileStatus:string) {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
		this.formService.contractorDepositePayment(id).subscribe(
			res => {
        if(res.success==true){
          this.commonService.openAlert("Warning", "Please Enter Loi Number Generated By Newgen", "warning");
         }
		 else{
				this.toastr.success("No payment option");
				this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
		}
			},
			err => {
				let retUrl: string = '/citizen/my-applications?apiCode=' + apiCode + '&id=' + id + '&fileStatus=' + fileStatus;
				let retAfterPayment: string = environment.returnUrl;
				if (this.fromOtherModule) {
					retUrl = '/citizen/payable-services?apiCode=' + apiCode + '&id=' + id;
				}
				if (err.status === 402) {
					let payData = this.commonService.storePaymentInfo(err.error.data, retUrl, retAfterPayment);
					let words = this.commonService.getToWords(payData.amount)
					let html =
						`
					<div class="text-center">
						<h2>Total Fee Pay</h2>
						<div class="payAmount">
							<i class="fa fa-inr" aria-hidden="true">` + payData.amount + `</i>
						</div>
						<p>Rupees in words</p>`
						+ words + `
					</div>
					`
					if (this.commonService.fromAdmin()) {
						this.openOfflinePaymentComponent(payData, retUrl, apiCode, id);
					} else {
						this.commonService.commonAlert('Payment Details', '', 'info', 'Make Payment!', false, html, cb => {
							this.paymentGateway.setPaymentDetailsFromActionBar(payData);
							this.paymentGateway.openModel();
						}, rj => {

						});
						return;
					}
				} else {
					this.commonService.openAlert("Error", "Error Occured for final submit : " + err.error[0].message, "warning")
				}
			});
	}


	deleteFormForRefundagainstvacancy(apiCode, id) {
		this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
			this.formService.deleteForm(id).subscribe(res => {
				this.commonService.successAlert('Deleted!', '', 'success');
				this.getAllData();
				err => {
					this.commonService.successAlert('Error!', err.error[0].message, 'error');
				}

			})
		})
	}

	copyRemarksContent() : void {
		let selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = this.rejectRemarks;
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);
		this.toastr.success("Content copied to clipboard")
	}

	//Withdraw Application
	withdrawApplication(apiCode: string, id: number) {
		this.commonService.confirmAlert('Are You Sure You Want To Withdraw Application?',"You won't be able to revert this!", 'warning','', performWithdrawl =>{
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
			this.formService.withdrawApplication(id).subscribe(
				res => {
					this.commonService.successAlert('Withdrawl!', '', 'success');
					this.getAllData();
				},
				err => {
					this.commonService.successAlert('Error!', err.error[0].message, 'error');
				}
			);
		});
	}
}