import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CommonService } from '../../services/common.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'select-payment-gateway',
  templateUrl: './select-payment-gateway.component.html',
  styleUrls: ['./select-payment-gateway.component.scss']
})
export class SelectPaymentGatewayComponent implements OnInit {

  confirmRef: BsModalRef;
  @ViewChild("confirmationModel") confirmationModel: TemplateRef<any>;

  payData: any;
  form: any;
  // router: any;
  applicationrouter: any;
  redirectURLAfterPayment: any;

  paymentGatewayForm:FormGroup;

  paymentGatewayArr:any = [
    {name: 'CC Avenue', code:'CC_AVENUE'},
    {name: 'BillDesk', code:'BILLDESK'},
  ];

  constructor(
    private modalService: BsModalService,
    private commonService: CommonService, private formService: FormsActionsService,
    private toastr: ToastrService, private fb: FormBuilder,
    private router:Router) {

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
    this.confirmRef = this.modalService.show(this.confirmationModel, Object.assign({ keyboard: false }, {backdrop : 'static'}, { ignoreBackdropClick: false }, { class: 'gray .modal-md' }));
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
  setPaymentDetailsFromActionBar(payData){
    this.payData = payData;
  }

  /**
   * This method is used to hide the modal and redirect to my application page
   */
  onCancel() {

    this.confirmRef.hide();

    // let errHtml = `
    // <div class="alert alert-danger">
    //   Please Complete Payment, Otherwise the application will be considered as in-complete
    // </div>`
    // this.commonService.commonAlert("Application Incomplete", "", 'warning', 'Make Payment!', false, errHtml, ccb => {
    //   this.makePayment();
    // }, arj => {
      this.router.navigate(['citizen/my-applications']);
    // });
    // return;
  }

/**
 * This method is used to make payment according to user payment gateway selection
 */
  makePayment(){
    let option = this.paymentGatewayForm.get('paymentGateway').value;
    if(option == 'CC_AVENUE'){
        this.ccAvenueMakePayment();
    }else{
      this.getBillDeskPage();
    }
  }

  /**
   * This method is used to call ccavenue make payment
   */
  ccAvenueMakePayment() {
    this.formService.ccAvenueMakePayment(this.payData).subscribe(res => {
      this.getTransactionDetail(res.data);
    }, err => {

    });
  }

  getBillDeskPage(){

    let obj = {
      frontRedirectURL : this.payData.returnUrl,
      customerID : this.payData.refNumber,
      txtadditionalInfo2 : this.payData.payableServiceType,
      txtAmount : this.payData.amount,
    };

    this.formService.getBillDeskPage(obj).subscribe(res =>{
      window.open(res.data.url, "_self");
    });
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

    form.appendTo(document.body)

    $(form).submit();

  }


}
