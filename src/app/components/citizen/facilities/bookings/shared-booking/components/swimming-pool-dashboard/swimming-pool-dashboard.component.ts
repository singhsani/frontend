import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { RouterModule, Routes } from '@angular/router';
import {TranslateService} from 'src/app/shared/modules/translate/translate.service';

@Component({
  selector: 'app-swimming-pool-dashboard',
  templateUrl: './swimming-pool-dashboard.component.html',
  styleUrls: ['./swimming-pool-dashboard.component.scss']
})
export class SwimmingPoolDashboardComponent implements OnInit {

  manageRoutes: any = ManageRoutes;
  guideLineFlag: boolean = true;
  translateKey: string = 'swimmingPoolScreen';
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


  constructor(public translateService: TranslateService) { }

  ngOnInit() {
  }

}
