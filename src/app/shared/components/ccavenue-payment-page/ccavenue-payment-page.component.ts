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

    let form = $(document.createElement('form'));
    $(form).attr("action", data.url);
    $(form).attr("method", "POST");

    let input = $("<input>")
      .attr("type", "hidden")
      .attr("name", "access_code")
      .val(data.access_code);

    let input2 = $("<input>")
      .attr("type", "hidden")
      .attr("name", "encRequest")
      .val(data.encRequest);

    $(form).append($(input));
    $(form).append($(input2));

    form.appendTo(document.body)

    $(form).submit();

  }



}
