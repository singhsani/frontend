import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../../services/validation.service';



@Component({
	selector: 'app-payment-gateway',
	templateUrl: './payment-gateway.component.html',
	styleUrls: ['./payment-gateway.component.scss']
})
export class PaymentGatewayComponent implements OnInit {

	constructor(private router: Router,
		private formService: HosFormActionsService,
		private toastr: ToastrService,
		private commonService: CommonService,
		private route: ActivatedRoute) { }

	ngOnInit() {

		// this.route.queryParams.subscribe(resp => {
		// 	this.paymentData = JSON.parse(resp.resp);
		// });
	}
}
