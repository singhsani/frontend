import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';

import { ManageRoutes } from '../../../config/routes-conf';
import { ToastrService } from 'ngx-toastr';
import { HospitalConfig } from '../hospital-config';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class HospitalDashboardComponent implements OnInit {
	translateKey: string = 'hospitalDashboardScreen';

	userServicesList: any;
	config : HospitalConfig = new HospitalConfig;
	manageRoutes: any = ManageRoutes;
	brTag: string ="<br>"

	public chartData : Array<any> =[];

	showChart : boolean = false;
	//for charts


	public pieChartColors = [
		{
			backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', 'red','green', 'yellow', 'black', 'gray', 'orange'],
		},
	]
	public pieChartLabels : Array<string> = ["DRAFT","SUBMITTED","APPROVED","REJECTED","PAYMENT_RECEIVED","PAYMENT"];
	public pieChartLabelValue : Array<string> = ["Draft","Submitted","Approved","Rejected","Payment Received","Payment Pending"];
	public pieChartType = 'pie';
	// public pieChartData = [120, 150, 180, 90, 20];
	
	/**
	 * Constructor to declare defualt propeties of class
	 * @param formService - Declare form service property
	 * @param paginationService - Declare pagination service property
	 * @param router - Declare router property
	 */
	constructor(
		private router: Router,
		private formService: HosFormActionsService,
		private toastr: ToastrService
	) {
		this.getAllServices();
		
	}

	loadChartData(){
		this.formService.getChartData().subscribe(res => {
			this.chartData = res.data.chart;
			//this.pieChartLabels = res.data.label;
			//this.pieChartLabelValue = res.data.valueTitle;
			this.showChart = true;
		})
	}

	getFiltered(appCode: string): boolean {
		let cData = this.getPieChartData(appCode);
		if(cData.length == 0){
			return true
		} else {
			return cData.filter(d => d.count === 0).length === this.chartData.length;
		}
	}

	ngOnInit() {
		this.loadChartData()
	}

	getPieChartData(appCode : string) : Array<any> {
		if(this.chartData){
			return this.chartData.filter(m => m.code === appCode);
		}
	}

	/**
	 * This method is use to create new record for citizen
	 */
	createRecord(apiCode: string) {
		
		if (apiCode == 'HEL-BCR'){
			this.router.navigate([ManageRoutes.getFullRoute(apiCode + "-HOSPITAL"), false, apiCode]);
		} else {
			if (ManageRoutes.getApiTypeFromApiCode(apiCode)) {
				this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(apiCode);
				this.formService.createFormData().subscribe(res => {
					let redirectUrl = ManageRoutes.getFullRoute(apiCode);
					this.router.navigate([redirectUrl, res.serviceFormId, apiCode]);
				});
			} else {
				// todo 
				this.toastr.error("Invalid API Code");
			}
		}
	}

	getAllServices(){
		this.formService.getUserServices().subscribe(
			res => {
				this.userServicesList = res.modules;
			},
			err => {
				
			}
		);
	}

	getIconImg(moduleCode: string) {
		switch (moduleCode) {
			case 'SHOP-ESTAB':
				return { card: 'yelloCard', icon: 'assets/icons/shop-estab.png' };
			case 'BIRTH-DEATH':
				return { card: 'redCard', icon: 'assets/icons/birth-death.png' };
			case 'FIRE':
				return { card: 'greenCard', icon: 'assets/icons/fire.png' };
			case 'MUTTON-FISH-POND':
				return { card: 'kyeBlueCard', icon: 'assets/icons/mutton-fish-pond.png' };
			case 'PROPERTY-TAX':
				return { card: 'grayCard', icon: 'assets/icons/property-tax.png' };
			default:
				break;
		}
	}

}