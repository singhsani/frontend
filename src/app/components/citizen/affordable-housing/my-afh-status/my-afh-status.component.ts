import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-afh-status',
  templateUrl: './my-afh-status.component.html',
  styleUrls: ['./my-afh-status.component.scss']
})
export class MyAfhStatusComponent implements OnInit {

  constructor() { }

  finalPossessionData : any;

  ngOnInit() {
  }


  searchApplication(event, refNo) {

    if (event && refNo != ""){
      
    }
  }

}
