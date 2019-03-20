import { Component, OnInit } from '@angular/core';
import { ManageRoutes } from '../../../../../../../config/routes-conf';


@Component({
  selector: 'app-zoo-dashboard',
  templateUrl: './zoo-dashboard.component.html',
  styleUrls: ['./zoo-dashboard.component.scss']
})
export class ZooDashboardComponent implements OnInit {

  manageRoutes: any = ManageRoutes;

  // Modules List
  modules: Array<any> = [
    {
      'code': 'ZOOBOOK',
      'fieldView': 'ALL',
      'name': 'Zoo',
      'gujName': 'પ્રાણી સંગ્રહાલય',
      'appointmentRequired': false,
      'active': true
    },
    {
      'code': 'ANIMAL-ADOPTION',
      'fieldView': 'ALL',
      'name': 'Animal Adoption',
      'gujName': 'પ્રાણી સંગ્રહાલય',
      'appointmentRequired': false,
      'active': true
    }
  ];


  constructor() { }

  ngOnInit() {
  }

}
