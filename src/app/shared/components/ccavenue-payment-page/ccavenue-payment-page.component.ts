import { Component, OnInit } from '@angular/core';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';

@Component({
  selector: 'app-ccavenue-payment-page',
  templateUrl: './ccavenue-payment-page.component.html',
  styleUrls: ['./ccavenue-payment-page.component.scss']
})
export class CcavenuePaymentPageComponent implements OnInit {

  constructor(private formService: FormsActionsService) {

  }

  ngOnInit() {
    this.ccAvenueMakePayment();
  }

  ccAvenueMakePayment() {
    this.formService.ccAvenueMakePayment().subscribe(res => {
      let ccAvenuePage = document.getElementById('ccAvenuePage');
        ccAvenuePage.innerHTML = res.data;
    },err=>{
      let ccAvenuePage = document.getElementById('ccAvenuePage');
        ccAvenuePage.innerHTML = err.error.text;
    });
  }

}
