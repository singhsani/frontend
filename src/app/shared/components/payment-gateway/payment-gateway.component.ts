import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.scss']
})
export class PaymentGatewayComponent implements OnInit {

  private PaymentModes : any[] = [
    {
      name: "Debit/Credit card (Payment Gateway)",
      code: "dc"
    },
    {
      name: "Net Banking/Wallet/Bharat QR/UPI",
      code: "nwbu"
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
