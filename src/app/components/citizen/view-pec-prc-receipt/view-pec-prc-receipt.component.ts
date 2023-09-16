import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfessionalTaxService } from 'src/app/core/services/citizen/data-services/professional-tax.service';
import { CommonService } from '../../../shared/services/common.service';
import { PftConfig } from '../tax/professional-tax/pftConfig';
// import { AccessRightService } from 'src/app/shared/services/accessRightService';
// import { AuthorizationConstants } from '../../authorization-matrix/AuthorizationConstants';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { ManageRoutes } from 'src/app/config/routes-conf';


@Component({
  selector: 'app-view-pec-prc-receipt',
  templateUrl: './view-pec-prc-receipt.component.html',
  styleUrls: ['./view-pec-prc-receipt.component.scss']
})
export class ViewPecPrcReceiptComponent implements OnInit {

  // translateKey: string = 'ReprintReceipt';

  dupReceiptObj: Array<any> = [];
	isRecordExixt: boolean = false;
  public config = new PftConfig;
  regno : any;
  //authoContants = AuthorizationConstants;
 

  constructor(
    private router: Router,
		private toastr: ToastrService,
		private commonService: CommonService,
		private profeService: ProfessionalTaxService,
    private route: ActivatedRoute,
    private formService: FormsActionsService,
  ) {
    this.route.paramMap.subscribe(param => {
			this.regno = param.get('id');
		});
    
   }
  

  ngOnInit() {
    this.searchDetailsByRegNo(this.regno);

	}
  

  searchDetailsByRegNo(regNo) {
		this.dupReceiptObj = [];
		this.isRecordExixt = false;

		if (regNo == '') {
			this.commonService.openAlert("Warning", this.config.PEC_PRC_REQUIRED_MESSAGE, "warning");
			return;
		}

		regNo = regNo.toUpperCase();

		this.profeService.getReceiptDetails(regNo).subscribe(res => {
			
			if (res && res.length > 0) {
				for (let i = 0; i < res.length; i++) {
					if (res[i].receiptType != 'CERTIFICATE_RECEIPT') {
						console.log(res);
						this.dupReceiptObj = res;
						this.isRecordExixt = true;
					}
				}
			} else {
				this.toastr.warning(this.config.NO_RECORD_MSG);
			}
		}, err => {
			this.dupReceiptObj =[];
			if(err.status == 501){
				this.commonService.openAlert('Warning', err.error[0].message, 'warning');
			}
		});
	}

  OnereprintReceipt(regNo,refNo) {
    
		this.profeService.printDupOneReceipt(regNo,refNo).subscribe(
			receiptResponse => {
				
				if (receiptResponse == null || receiptResponse == "") {
					this.commonService.openAlert('Message!', "Print Receipt Not Available !!!", 'warning');
					return false;
				}

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


