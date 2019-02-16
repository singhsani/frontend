import { Component, OnInit, Input } from '@angular/core';
import { ProfessionalTaxService } from './../../../core/services/citizen/data-services/professional-tax.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.scss']
})

export class PaymentOptionComponent implements OnInit {


  @Input() form: FormGroup;

  payModeArray: any = [
    { name: 'Cash', code: 'CASH' },
    { name: 'Cheque/DD', code: 'CHEQUE' }
  ];
  bankNameArray: Array<any>;
  maxDate = new Date();

  constructor(private profeService: ProfessionalTaxService) { }

  ngOnInit() {

    this.form.addControl('paymentMode', new FormControl(null, Validators.required));
    this.form.addControl('bank', new FormGroup({
      code: new FormControl(null),
      name: new FormControl(),
    }));
    this.form.addControl('branchName', new FormControl(''));
    this.form.addControl('chequeNo', new FormControl(null));
    this.form.addControl('bankAccountNo', new FormControl(''));
    this.form.addControl('chequeDate', new FormControl(''));

    this.getBankNames();

  }


  onPayModeChange() {
    if (this.form.get('paymentMode').value === 'CHEQUE') {
      this.form.get('branchName').setValidators([Validators.required]);
      this.form.get('chequeNo').setValidators([Validators.required]);
      this.form.get('bankAccountNo').setValidators([Validators.required]);
      this.form.get('chequeDate').setValidators([Validators.required]);
      this.form.get('bank.code').setValidators([Validators.required]);
    } else {
      // this.form.get('branchName').setValue('');
      // this.form.get('bankAccountNo').setValue('');
      // this.form.get('bank.code').setValue(null);

      this.form.get('chequeNo').setValue(null);
      this.form.get('chequeDate').setValue('');

      this.form.get('branchName').clearValidators();
      this.form.get('chequeNo').clearValidators();
      this.form.get('bankAccountNo').clearValidators();
      this.form.get('chequeDate').clearValidators();
      this.form.get('bank.code').clearValidators();
    }

    this.form.get('branchName').updateValueAndValidity();
    this.form.get('chequeNo').updateValueAndValidity();
    this.form.get('bankAccountNo').updateValueAndValidity();
    this.form.get('chequeDate').updateValueAndValidity();
    this.form.get('bank.code').updateValueAndValidity();

  }

	/**
	 * This method is use for get all bank names using API
	*/
  getBankNames() {
    this.profeService.getBankNames().subscribe(res => {
      this.bankNameArray = res.data;
    });
  }

	/**
	 * @param fieldName - get the selected field's name
	 * @param date get the selected date value
	 */
  onDateChange(fieldName, date) {
    this.form.get(fieldName).setValue(moment(date).format("YYYY-MM-DD"));
  }

}
