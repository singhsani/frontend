import { Component, OnInit } from '@angular/core';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
declare var $: any;

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
      this.getTransactionDetail(res.data);
    }, err => {

    });
  }

  getTransactionDetail(data) {
    // this.formService.ccAvenuetransactionPage(obj, data.url).subscribe(res=>{
    // });
    $.post(data.url,
      {
        access_code: data.access_code,
        encRequest: data.encRequest
      },
      function (data, status) {
        console.log(data);
        console.log(status);
      });
  }



}
