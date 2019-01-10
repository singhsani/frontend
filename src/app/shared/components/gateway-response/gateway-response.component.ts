import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ManageRoutes } from './../../../config/routes-conf';
import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';

@Component({
	selector: 'app-gateway-response',
	templateUrl: './gateway-response.component.html',
	styleUrls: ['./gateway-response.component.scss']
})
export class GatewayResponseComponent implements OnInit {

	responseObj: any = {};
	dispTime: number = 10;
	interval: any;

	constructor(
		private formService: FormsActionsService,
		private route: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit() {

		this.route.queryParams.subscribe(param => {
			if (param && param.rqst_token) {
				this.gatewayResponse(param.rqst_token);
			}else{
				this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
			}
		});

	}

	gatewayResponse(token) {
		this.formService.getPaymentResponse(token).subscribe(res => {
			this.responseObj = res.data;

			setTimeout(() => {
				this.redirectToMyApplication();
			}, 10000);

			this.interval = setInterval(() => {
				this.dispTime = this.dispTime - 1
			}, 1000);
		});
	}

	redirectToMyApplication() {
		clearInterval(this.interval);
		this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
	}

	redirectToHome(){
		this.router.navigate([ManageRoutes.getFullRoute('CITIZENMYAPPS')]);
	}

}

