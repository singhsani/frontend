import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CommonService } from '../../services/common.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HosFormActionsService } from 'src/app/core/services/hospital/data-services/hos-form-actions.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
declare var $: any;
declare const window: any;

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

  isLoading: boolean = false;

  paymentGatewayArr: any = [
    { name: 'BillDesk', code: 'BILLDESK' },
    // { name: 'CC Avenue', code: 'CC_AVENUE' },
  ];

  constructor(
    private modalService: BsModalService,
    private commonService: CommonService, private formService: FormsActionsService,
    private toastr: ToastrService, private fb: FormBuilder,
    private router: Router, private hosFormActionsService: HosFormActionsService,
    private alertService: AlertService
    ) {

  }

  ngOnInit() {
    /**
     * this method is used to create form controls for payment gateway form
     */
    this.paymentGatewayForm = this.fb.group({
      paymentGateway: ['BILLDESK', Validators.required]
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
    } else if (this.applicationType == 'booking') {
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
      },
      (error) => {
        this.alertService.error(error.error[0].message);      }
      );
    } else {
      this.formService.ccAvenueMakePayment(this.payData).subscribe(res => {
        this.getTransactionDetail(res.data);
      },
      (error) => {
        this.alertService.error(error.error[0].message);      }
        );
    }

  }

  getBillDeskPage() {


    /**
     * This condition is added as there are two transactions in swimming pool and each time bill desk needs different customerId so
     * instead of reference number of Gateway transaction Id is passed.
     */
    let obj = {
      ru: this.payData.returnUrl,
      orderid: this.payData.gatewayCustomerId ? this.payData.gatewayCustomerId : this.payData.refNumber,
      amount: this.payData.amount,
      // txtadditionalInfo1: this.payData.payableServiceType ? this.payData.payableServiceType : this.payData.resourceType,
      txtadditionalInfo2: this.payData.txtadditionalInfo1 ? this.payData.txtadditionalInfo1  : this.payData.resourceType
      //txtadditionalInfo2: this.payData.resourceType

    }

    if (this.applicationType == 'HOSPITAL') {
      this.hosFormActionsService.getBillDeskPage(obj).subscribe(res => {
        if(res.data== 'undefined'){
          this.toastr.error("BillDesk Server Down Please Try After Some Time");
          this.onCancel();
        }else{
        var flow_config = {
          merchantId: res.data.mercid,
          bdOrderId: res.data.bdorderid,
          authToken: res.data.links[1].headers.authorization,
          childWindow: false,
          returnUrl: res.data.ru,
          retryCount: 3,
        }

        var responseHandler = function (txn) {
          console.log("callback received status:: ", txn.status)
          console.log("callback received response:: ", txn.response)
        }
        var config = {
          responseHandler: responseHandler,
          merchantLogo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAArCAYAAACARVOCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM4RTBFQkFCNTFGMDExRThBMDE2RTBFRjM1NjM4MUUxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM4RTBFQkFDNTFGMDExRThBMDE2RTBFRjM1NjM4MUUxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzhFMEVCQTk1MUYwMTFFOEEwMTZFMEVGMzU2MzgxRTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzhFMEVCQUE1MUYwMTFFOEEwMTZFMEVGMzU2MzgxRTEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz58ptsUAAAJ9UlEQVR42sSYCXBV5RXHf/fteUvey/ayEUICIRBigBRlRw1LFAoydakL06KtiLTaoVqXSm3tlLY6Vh1nRGacquM4WJeBokVZi1RWWQIqAklIQhKyku3t63397n2QR1QggDPeN+/d++79vvP/vrP8zzlXisVic/mBDp3yc93cFzcMZrAsx/D5w9w5v5xHfjUDjV7mzbereOOdA4TkEEa9ltgggT//ePk83WBXGQpH0Wg1LF8yhWlzMthYs4l3D63nncWr6DM2sXltDx1dbsymQYtEM5hBym5T7Gb+/vB1TC84wzMfPUtV81FKnCN5bsdrNLo+4rmloxhfnIPHG0aY8urBFSFeIWzy2BEse6yYU+3r0QT1/MI6gVAoSJ/sRz7ZwIMFC9F665h+Uwfz544mGtIQjcpXDq5MDgahomIYK56aiDUNjoXc9JxuYsT4qRTX93JjExQZ0skbO4nGU/XU690887sbuX1RvvAHPeGQfPngin0lScfyu8u4Zb6RF/a+SrLGitthpvZEFX2EaXKaiNrMHMwz8sWG9zkeaMcny6w7spn90vusvH8kmZlW/P7I4MGDQZnMNDv3PziC/cnraT2wl0lSDi/ueh3JoMMtPPzUru3ojCaCkow1EKVp/25abOAOuPnXgbU8kDqDXYEtGKZ9Tvl4J6GAYsJLgAeCMQqG21i6fDguxwmspjRedB2gu+YYlbEcglqJIcNL6Tpcxezh07H4ZK71WPC4eoimpZBlTOGe6DDWNe1le1c95YWF5FQ0UDkvm6isIRKNfTvOlVuBgMzCycORy6v4wt3LiopHqDvTQJLewo+Kr8ez7kN8YQ1mh5Wuk9V49h+g88vDaDUadA4HM0fNIPLZXqZOW0CH7zhTNSYWXXsbbe42FrUtY/782RzYnkRznxujIb5nSWG4sornN0yels28Si19Xx7kaG4ySToT6ZY0QRwG9jYdQePzM2NfK60tjfi9bqFGxZkkYnKUpGQ7mem5mMqvYY2tnTtK5tDt6aVi5DSe3vQP8nU2Sr0y0vAK1rxxmjPtfg5ve3SeuoRxxXncdU8hT+5bLXbhRN/agSM5lWgsws7aPRQK9dtyhlB26yL6OloE2WjR6vTiq0NnMOLr7UEW+kuZOZPu3k521uzhk+P/xagzkmq2M/YM7NP4WX38FZ56dAo5GakJtVfMyeaaoUU8NGkxFvH5ZbiMqhRYsX4lT876NXJ1DbO6bZhHO0RYTaD1xFEV9Hw+KJ1/O1luPSszZqMrKmRb93Ee+OBxVs98gtPdm7FMLqNS2DxniJGKysyEw3Un1TL31bup62ri+W2v0Hammc8bq3hoxn0caTnGP11VvB74go1rXibi8yFptAOAk2zJ1Hy2mVUfvsD+9BhLtj6LHAkzNncMh2sP8XXnSf685SW2Vu9g+ks/wZHvT4DfN+M2bh5dgazT8Mi4e6jdv5ODDVXMGjuHv9zyR1b++EkM+fnc8tu/4Xf1CQ6Q+sGV64DbTd6YchrHFnDa38Wqnz7Hn+Y+jsmazPrDG3D2RfnN1MW0ujtZOe8JFo6vTDjc4eavNmw5tYueliaG7aulM+zGqU8mb8Q1OHMLSMvNRysYS2dMYseaVRzd/gkGkzme6aIRTDY7S1Z9QF80iFZowugN0XKqmqoD2wgFvUiCtLSZTo4W2YVnRCm1lYoN3x7PakfqqvDu/IyJPivBayewunMHK6+7E8+/P6a95mva66tJy8rD29FGb3dnP7CqOq2OkDDFWw/fhUbS4nJ1k5wlEowYt3DZ07wmzFXbe4q7o3bu6E1jY7SehlBjwuEqh07mLese9hWlsbtrH3PyJpCSV0DR3FtJH1nCiU8/wTlzNn9du5LiHdX4W9uQdInUqRNEUe3UMHHhzxh32kvR9ZU0HzvMsAnTKKkL0O5u5Q/tW/l9+SKye1JYMPXehM31GRnstgfw6qKUpOYjC9V5fH3I4TBhvw+91UqOI5vFNy1j9LTZQpWBRAISjmVNz+DmJU8wfcoCsopLMSZZMNsceP1uTp6pZ9bIGxjnLKJLH+Hlxi3UdTcmwB2mZN6+62XGZZdgNVh4bNZD3FAwBV/IfxYgglFrZGreeOz2jIH5WlzLgnbnjbmJYRYnPp9bZMSI8IWoqHyiLJ3ycxHvesbnllKWPZptS99jREZhQu2yYCurwcq9kxbhCriwGW2qFw9k4pjKaIrAbyd+kQnFQg06qzpP+cTnSgx15GIZdSOOJLug4niIdod9CfDzj2Shhf4wuoKiMCio19PdMSAc0yyp31hrbPBl1OUclpQMJfjFOU2l36uu4S7n0BvNKrhOJCS/SC7fL/glikO9yYQ5OUUUEH41/q8KXIGKyYlaTCM892KHYmqDKUmdKGmkSzcNFywiRQxLklJApKrhpTiRLc2JRnPhNXc21KhzBHGLcJOvHDwtr1AtFJSdR8MhkUZNly6HRa4Pi6ItbUiBGutXDD6sbKJ6dguejoTOgQ9UpZJeA24XARFiBrMVW3q2OsKekXP1HYtSLoWF80j9qpb74zTRw0UH+MVgGeLS3i5wYsJ258R1NdUJoAS4Yv+g10NPW/NlB84lwZUdKw4nLgRnhzmxR9TsBsMA9w4Lkxz736bvHzzeOoXV+N239i2avjykLkiJhHNfhckOffweve3NougwnK1sB9mf63Xaiw7KLy6h5ehevtr0LkOLRyFptQOsqxgh5PNS9eGblFbMF6a4uLwkkz5RRn26u2ZDPHZj5zlL4lrZScDjUs9KyfxdLbB0lheMFpsaAQO5QOqXp5CQyxNk3sySeBn18Ip1F2S3c0WimqWE3aVv+Lp03jjOZ8OL0bCQJcDjajeZ9Bfsz0MRGYUlFZmKdSLiv16vFbuUVfpUWul4Do8LlRV61euQpEHa/LuOsBCePySFslGZBEIRIVDbrwWdLq4FORIVpVJYfZaZYaOmvpPcLDtrN3zFYNBVcGU3ylglfJWzojFZbLWz20uK6Mk7u7xkO214vEHCoutQnik21QqFOS1GtFqN+rIoJ9OOPTkJm8VAZ4+obAzaeJkVi5tBrY7OnvvBszNt6gsBq1nk4KBwGtGHKyrViIHbdtYIIIndBxvU+z29fuF0GrLSrfG2WmhFJ/6HQmJ+kl7Mj2C1mXCkmOntC6jPLGZR84sF+gOiFhQLUsb2g986dwwub5gRw9Loc/nw+SN0d3tw+0OMLMzAL1RrMcd7sx27a/GIdnrsaCdGo14VPCQzmfYuH4qDe4V2lAYjPyeZ2oYuUh1JVJ/sFNrRkpNlU2VnpNsS4P/Zely128ZPTwiVGVWPjgr1KquuqTtDW4cHhz1JxKdBKSFpbnOrYaU0+5Jqtqi6kJZWF6mpZnWeMl95LaZoIhgIi3taMSYegm4RancuKI/H+Q/1BvL/AgwAg2M0FfA8aT4AAAAASUVORK5CYII=",
          flowConfig: flow_config,
          flowType: "payments"
        }
        window.loadBillDeskSdk(config);
      }
      },
      (error) => {
        this.alertService.error(error.error[0].message);      }
      );
    } else {

      this.formService.getBillDeskPage(obj).subscribe(res => {
      if(res.data.status== "Already Paid"){
         this.commonService.openAlert('Error', res.data.status, 'error', '', performDelete => {
            	//window.location.reload();
            	this.onCancel();
            	location.reload();
            	//this.router.navigate(['/citizen/bookings/my-bookings']);

            	//this.router.navigate(['/citizen/dashboard']);

          });
      }
        if(res.data== undefined){
          this.toastr.error("BillDesk Server Down Please Try After Some Time");
          this.onCancel();
        }else{
        var flow_config = {
          merchantId: res.data.mercid,
          bdOrderId: res.data.bdorderid,
          authToken: res.data.links[1].headers.authorization,
          childWindow: false,
          returnUrl: res.data.ru,
          retryCount: 3,
        }

        var responseHandler = function (txn) {
          console.log("callback received status:: ", txn.status)
          console.log("callback received response:: ", txn.response)
        }
        var config = {
          responseHandler: responseHandler,
          merchantLogo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAArCAYAAACARVOCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM4RTBFQkFCNTFGMDExRThBMDE2RTBFRjM1NjM4MUUxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM4RTBFQkFDNTFGMDExRThBMDE2RTBFRjM1NjM4MUUxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzhFMEVCQTk1MUYwMTFFOEEwMTZFMEVGMzU2MzgxRTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzhFMEVCQUE1MUYwMTFFOEEwMTZFMEVGMzU2MzgxRTEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz58ptsUAAAJ9UlEQVR42sSYCXBV5RXHf/fteUvey/ayEUICIRBigBRlRw1LFAoydakL06KtiLTaoVqXSm3tlLY6Vh1nRGacquM4WJeBokVZi1RWWQIqAklIQhKyku3t63397n2QR1QggDPeN+/d++79vvP/vrP8zzlXisVic/mBDp3yc93cFzcMZrAsx/D5w9w5v5xHfjUDjV7mzbereOOdA4TkEEa9ltgggT//ePk83WBXGQpH0Wg1LF8yhWlzMthYs4l3D63nncWr6DM2sXltDx1dbsymQYtEM5hBym5T7Gb+/vB1TC84wzMfPUtV81FKnCN5bsdrNLo+4rmloxhfnIPHG0aY8urBFSFeIWzy2BEse6yYU+3r0QT1/MI6gVAoSJ/sRz7ZwIMFC9F665h+Uwfz544mGtIQjcpXDq5MDgahomIYK56aiDUNjoXc9JxuYsT4qRTX93JjExQZ0skbO4nGU/XU690887sbuX1RvvAHPeGQfPngin0lScfyu8u4Zb6RF/a+SrLGitthpvZEFX2EaXKaiNrMHMwz8sWG9zkeaMcny6w7spn90vusvH8kmZlW/P7I4MGDQZnMNDv3PziC/cnraT2wl0lSDi/ueh3JoMMtPPzUru3ojCaCkow1EKVp/25abOAOuPnXgbU8kDqDXYEtGKZ9Tvl4J6GAYsJLgAeCMQqG21i6fDguxwmspjRedB2gu+YYlbEcglqJIcNL6Tpcxezh07H4ZK71WPC4eoimpZBlTOGe6DDWNe1le1c95YWF5FQ0UDkvm6isIRKNfTvOlVuBgMzCycORy6v4wt3LiopHqDvTQJLewo+Kr8ez7kN8YQ1mh5Wuk9V49h+g88vDaDUadA4HM0fNIPLZXqZOW0CH7zhTNSYWXXsbbe42FrUtY/782RzYnkRznxujIb5nSWG4sornN0yels28Si19Xx7kaG4ySToT6ZY0QRwG9jYdQePzM2NfK60tjfi9bqFGxZkkYnKUpGQ7mem5mMqvYY2tnTtK5tDt6aVi5DSe3vQP8nU2Sr0y0vAK1rxxmjPtfg5ve3SeuoRxxXncdU8hT+5bLXbhRN/agSM5lWgsws7aPRQK9dtyhlB26yL6OloE2WjR6vTiq0NnMOLr7UEW+kuZOZPu3k521uzhk+P/xagzkmq2M/YM7NP4WX38FZ56dAo5GakJtVfMyeaaoUU8NGkxFvH5ZbiMqhRYsX4lT876NXJ1DbO6bZhHO0RYTaD1xFEV9Hw+KJ1/O1luPSszZqMrKmRb93Ee+OBxVs98gtPdm7FMLqNS2DxniJGKysyEw3Un1TL31bup62ri+W2v0Hammc8bq3hoxn0caTnGP11VvB74go1rXibi8yFptAOAk2zJ1Hy2mVUfvsD+9BhLtj6LHAkzNncMh2sP8XXnSf685SW2Vu9g+ks/wZHvT4DfN+M2bh5dgazT8Mi4e6jdv5ODDVXMGjuHv9zyR1b++EkM+fnc8tu/4Xf1CQ6Q+sGV64DbTd6YchrHFnDa38Wqnz7Hn+Y+jsmazPrDG3D2RfnN1MW0ujtZOe8JFo6vTDjc4eavNmw5tYueliaG7aulM+zGqU8mb8Q1OHMLSMvNRysYS2dMYseaVRzd/gkGkzme6aIRTDY7S1Z9QF80iFZowugN0XKqmqoD2wgFvUiCtLSZTo4W2YVnRCm1lYoN3x7PakfqqvDu/IyJPivBayewunMHK6+7E8+/P6a95mva66tJy8rD29FGb3dnP7CqOq2OkDDFWw/fhUbS4nJ1k5wlEowYt3DZ07wmzFXbe4q7o3bu6E1jY7SehlBjwuEqh07mLese9hWlsbtrH3PyJpCSV0DR3FtJH1nCiU8/wTlzNn9du5LiHdX4W9uQdInUqRNEUe3UMHHhzxh32kvR9ZU0HzvMsAnTKKkL0O5u5Q/tW/l9+SKye1JYMPXehM31GRnstgfw6qKUpOYjC9V5fH3I4TBhvw+91UqOI5vFNy1j9LTZQpWBRAISjmVNz+DmJU8wfcoCsopLMSZZMNsceP1uTp6pZ9bIGxjnLKJLH+Hlxi3UdTcmwB2mZN6+62XGZZdgNVh4bNZD3FAwBV/IfxYgglFrZGreeOz2jIH5WlzLgnbnjbmJYRYnPp9bZMSI8IWoqHyiLJ3ycxHvesbnllKWPZptS99jREZhQu2yYCurwcq9kxbhCriwGW2qFw9k4pjKaIrAbyd+kQnFQg06qzpP+cTnSgx15GIZdSOOJLug4niIdod9CfDzj2Shhf4wuoKiMCio19PdMSAc0yyp31hrbPBl1OUclpQMJfjFOU2l36uu4S7n0BvNKrhOJCS/SC7fL/glikO9yYQ5OUUUEH41/q8KXIGKyYlaTCM892KHYmqDKUmdKGmkSzcNFywiRQxLklJApKrhpTiRLc2JRnPhNXc21KhzBHGLcJOvHDwtr1AtFJSdR8MhkUZNly6HRa4Pi6ItbUiBGutXDD6sbKJ6dguejoTOgQ9UpZJeA24XARFiBrMVW3q2OsKekXP1HYtSLoWF80j9qpb74zTRw0UH+MVgGeLS3i5wYsJ258R1NdUJoAS4Yv+g10NPW/NlB84lwZUdKw4nLgRnhzmxR9TsBsMA9w4Lkxz736bvHzzeOoXV+N239i2avjykLkiJhHNfhckOffweve3NougwnK1sB9mf63Xaiw7KLy6h5ehevtr0LkOLRyFptQOsqxgh5PNS9eGblFbMF6a4uLwkkz5RRn26u2ZDPHZj5zlL4lrZScDjUs9KyfxdLbB0lheMFpsaAQO5QOqXp5CQyxNk3sySeBn18Ip1F2S3c0WimqWE3aVv+Lp03jjOZ8OL0bCQJcDjajeZ9Bfsz0MRGYUlFZmKdSLiv16vFbuUVfpUWul4Do8LlRV61euQpEHa/LuOsBCePySFslGZBEIRIVDbrwWdLq4FORIVpVJYfZaZYaOmvpPcLDtrN3zFYNBVcGU3ylglfJWzojFZbLWz20uK6Mk7u7xkO214vEHCoutQnik21QqFOS1GtFqN+rIoJ9OOPTkJm8VAZ4+obAzaeJkVi5tBrY7OnvvBszNt6gsBq1nk4KBwGtGHKyrViIHbdtYIIIndBxvU+z29fuF0GrLSrfG2WmhFJ/6HQmJ+kl7Mj2C1mXCkmOntC6jPLGZR84sF+gOiFhQLUsb2g986dwwub5gRw9Loc/nw+SN0d3tw+0OMLMzAL1RrMcd7sx27a/GIdnrsaCdGo14VPCQzmfYuH4qDe4V2lAYjPyeZ2oYuUh1JVJ/sFNrRkpNlU2VnpNsS4P/Zely128ZPTwiVGVWPjgr1KquuqTtDW4cHhz1JxKdBKSFpbnOrYaU0+5Jqtqi6kJZWF6mpZnWeMl95LaZoIhgIi3taMSYegm4RancuKI/H+Q/1BvL/AgwAg2M0FfA8aT4AAAAASUVORK5CYII=",
          flowConfig: flow_config,
          flowType: "payments"
        }
        window.loadBillDeskSdk(config);
      }
      },
      (error) => {
        this.alertService.error(error.error[0].message);      }
      );
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
