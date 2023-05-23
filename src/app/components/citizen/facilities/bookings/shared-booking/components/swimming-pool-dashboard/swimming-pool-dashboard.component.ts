import { Component, OnInit } from '@angular/core';
import { Subscription, from } from 'rxjs';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { RouterModule, Routes } from '@angular/router';
import {TranslateService} from 'src/app/shared/modules/translate/translate.service';
import { AppSwimmingPoolService } from '../../../modules/swimming-pool/swimming-pool.service';

@Component({
  selector: 'app-swimming-pool-dashboard',
  templateUrl: './swimming-pool-dashboard.component.html',
  styleUrls: ['./swimming-pool-dashboard.component.scss']
})
export class SwimmingPoolDashboardComponent implements OnInit {

  manageRoutes: any = ManageRoutes;
  guideLineFlag: boolean = true;
  translateKey: string = 'swimmingPoolScreen';
  subscription : Subscription
  // Modules List
  modules: Array<any> = [
    {
      'code': 'SWIMMINGPOOL',
      'fieldView': 'ALL',
      'name': 'Swimming-Pool',
      'gujName': 'પ્રાણી સંગ્રહાલય',
      'appointmentRequired': false,
      'active': true
    },
    {
      'code': 'SWIMMINGPOOLRENEWAL',
      'fieldView': 'ALL',
      'name': 'Swimming-Pool Renewal ',
      'gujName': 'પ્રાણી સંગ્રહાલય',
      'appointmentRequired': false,
      'active': true
    }
  ];
  showSelectLanguage : boolean = true;

  constructor(public translateService: TranslateService,
    public swimmingPoolService : AppSwimmingPoolService) { }

  ngOnInit() {
    this.subscription = this.swimmingPoolService.observableIsShowRules.subscribe(data => {
      this.showSelectLanguage = data

    })
  //  console.log('this.show', this.showSelectLanguage)
  }
 

}
