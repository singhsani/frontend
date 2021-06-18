import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CommonService } from '../../services/common.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HosFormActionsService } from 'src/app/core/services/hospital/data-services/hos-form-actions.service';
declare var $: any;

@Component({
  selector: 'select-payment-gateway',
  templateUrl: './select-payment-gateway.component.html',
  styleUrls: ['./select-payment-gateway.component.scss']
})
export class SelectPaymentGatewayComponent implements OnInit {

  confirmRef: BsModalRef;
  @ViewChild("confirmationModel") confirmationModel: TemplateRef<any>;
  @Input('applicationType') applicationType: any;

  payData: any;
  form: any;
  // router: any;
  applicationrouter: any;
  redirectURLAfterPayment: any;

  paymentGatewayForm: FormGroup;

  isLoading : boolean = false;

  paymentGatewayArr: any = [
    { name: 'CC Avenue', code: 'CC_AVENUE' },
    { name: 'BillDesk', code: 'BILLDESK' },
  ];

  constructor(
    private modalService: BsModalService,
    private commonService: CommonService, private formService: FormsActionsService,
    private toastr: ToastrService, private fb: FormBuilder,
    private router: Router, private hosFormActionsService: HosFormActionsService) {

  }

  ngOnInit() {
    /**
     * this method is used to create form controls for payment gateway form
     */
    this.paymentGatewayForm = this.fb.group({
      paymentGateway: ['CC_AVENUE', Validators.required]
    });
  }

  /**
   * This method is used to open model from different different modules
   */
  openModel() {
    this.isLoading = false;
    this.confirmRef = this.modalService.show(this.confirmationModel, Object.assign({ keyboard: false }, { backdrop: 'static' }, { ignoreBackdropClick: false }, { class: 'gray .modal-md' }));
  }

  /**
   * This method is used to set the data passed from different different modules
   */
  setPaymentDetails(payData, form, router, applicationrouter, redirectURLAfterPayment) {
    this.payData = payData;
    this.form = form;
    // this.router = router;
    this.applicationrouter = applicationrouter;
    this.redirectURLAfterPayment = redirectURLAfterPayment;
  }

  /**
   * This method is used to set the data passed from different different citizen service modules
   */
  setPaymentDetailsFromActionBar(payData) {
    console.log("payData", payData);
    this.payData = payData;
  }

  /**
   * This method is used to hide the modal and redirect to my application page
   */
  onCancel() {
    this.isLoading = false;
    this.confirmRef.hide();
    if (this.applicationType == 'HOSPITAL') {
      this.router.navigate(['hospital/my-applications']);
    } else if (this.applicationType == 'FACILITYBOOKING') {
      this.router.navigate(['citizen/bookings/my-bookings']);
    } else if (this.applicationType == 'ticketing') {
      this.router.navigate(['citizen/ticketings/my-ticketings']);
    } else if (this.applicationType == 'Zooticketing') {
      this.confirmRef.hide();
    } else {
      this.router.navigate(['citizen/my-applications']);
    }
  }

  /**
   * This method is used to make payment according to user payment gateway selection
   */
  makePayment() {
    this.isLoading = true;
    
    let option = this.paymentGatewayForm.get('paymentGateway').value;
    if (option == 'CC_AVENUE') {
      this.ccAvenueMakePayment();
    } else {
      this.getBillDeskPage();
    }
  }

  /**
   * This method is used to call ccavenue make payment
   */
  ccAvenueMakePayment() {
    if (this.applicationType == 'HOSPITAL') {
      this.hosFormActionsService.ccAvenueMakePayment(this.payData).subscribe(res => {
        this.getTransactionDetail(res.data);
      });
    } else {
      this.formService.ccAvenueMakePayment(this.payData).subscribe(res => {
        this.getTransactionDetail(res.data);
      });
    }

  }

  getBillDeskPage() {

    /**
     * This condition is added as there are two transactions in swimming pool and each time bill desk needs different customerId so
     * instead of reference number of Gateway transaction Id is passed.
     */
    let obj = {
      frontRedirectURL: this.payData.returnUrl,
      customerID: this.payData.gatewayCustomerId ? this.payData.gatewayCustomerId : this.payData.refNumber,
      txtadditionalInfo2: this.payData.gatewayAccountKey,
      txtAmount: this.payData.amount,
      txtadditionalInfo1: this.payData.txtadditionalInfo1
    };

    if (this.applicationType == 'HOSPITAL') {
      this.hosFormActionsService.getBillDeskPage(obj).subscribe(res => {
        window.open(res.data.url, "_self");
      });
    } else {
      this.formService.getBillDeskPage(obj).subscribe(res => {
        window.open(res.data.url, "_self");
      });
    }


  }

  /**
   * This method is used to get the cc avenue page url and redirect to there page
   * @param data
   */
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

    form.appendTo(document.body);

    $(form).submit();

  }


}
