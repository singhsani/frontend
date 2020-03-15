import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { ManageRoutes } from '../../../../config/routes-conf';
import { CommonService } from '../../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-login-through-admin',
	templateUrl: './login-through-admin.component.html',
	styleUrls: ['./login-through-admin.component.scss']
})
export class LoginThroughAdminComponent implements OnInit {

	accessToken: string;
	apiCode: string;

	constructor(
		private session: SessionStorageService,
		public router: Router,
		public route: ActivatedRoute,
		public commonService: CommonService,
		private toastr: ToastrService,
		private formService: FormsActionsService,
	) { }

	ngOnInit() {
		this.route.queryParams.subscribe(param => {

			if (param) {
				this.accessToken = param['authToken'];
				this.apiCode = param['apiCode'];
				if (this.accessToken && this.apiCode) {
					this.saveToken(this.apiCode);

				} else {
					this.commonService.openAlert('Error', 'Access Token Not Available', 'warning');
				}
			} else {
				this.router.navigate(['/404']);
			}
		});
	}

	/**
	 * This method will store Token to the Session Storage.
	 */
	saveToken(apiCode) {
		this.session.set('access_token', { 'token': this.accessToken, now: +new Date }, 999999, 's');
		this.session.set('fromAdmin', 'fromAdmin', 999999, 's');

		switch (apiCode) {
			case 'HEL-BCR':
			case 'HEL-DCR':
			case 'HEL-NRCBR':
			case 'HEL-NRCDR':
			case 'HEL-DUPBR':
			case 'HEL-DUPDR':
			case 'HEL-DUPMR':
			case 'SHOP-REN':
			case 'SHOP-TRAF':
			case 'SHOP-CAN':
			case 'SHOP-DUP':
			case 'MF-REN':
			case 'MF-TRA':
			case 'MF-DUP':
			case 'MF-CAN':
			case 'APL-REN':
			case 'APL-TRA':
			case 'APL-CAN':
			case 'APL-DUP':
			case 'FL-REN':
			case 'FL-MODIFY':
			case 'FL-DUP':
			case 'FS-FINAL':
			case 'FS-REVISED':
			case 'FS-REN':
			case 'FS-FINAL-HOSPITAL':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode), false, apiCode]);
				break;
			case 'PRC_REG':
			case 'PRO-ASS':
			case 'PRO-EXT':
			case 'PRO-TRAN':
			case 'PRO-DUP':
			case 'PRO-NDU':
			case 'PRO-VAC':
			case 'PRO-ASSCER':
			case 'PRO-REFUND':
			case 'PRO-TAX-REBATE':
			case 'PRO-REVALUATION':
			case 'WTR-NEW':
			case 'WTR-DISCON':
			case 'WTR-TRXF-OWN':
			case 'WTR-CHNG-USG':
			case 'WTR-RECON':
			case 'WTR-PLUMB-LIC':
			case 'WTR-RNW-PLUMB-LIC':
				this.router.navigate([ManageRoutes.getFullRoute(apiCode)]);
				break;
			default:
				if (ManageRoutes.getApiTypeFromApiCode(apiCode)) {
					this.createRecord();
				} else {
					// todo
					this.toastr.error("Invalid API Code");
				}
				break;
		}

	}

	/**
	 * This method is use to create new record for citizen
	 */
	createRecord() {
		this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
		this.formService.createFormData().subscribe(res => {
			let redirectUrl = ManageRoutes.getFullRoute(this.apiCode);
			this.router.navigate([redirectUrl, res.serviceFormId, this.apiCode]);
		});
	}
}
