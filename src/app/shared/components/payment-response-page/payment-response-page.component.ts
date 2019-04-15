import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

@Component({
  selector: 'app-payment-response-page',
  templateUrl: './payment-response-page.component.html',
  styleUrls: ['./payment-response-page.component.scss']
})
export class PaymentResponsePageComponent implements OnInit {

  /**
   * responsible for payment status from gateway
   */
  paymentStatus: any;

  /**
   * data to display like amount, transaction is etc.
   */
  dispData: any;

  /**
   * display time count to redirect my application page.
   */
  dispTime: number = 10;

  /**
   * constructor
   * @param router - router.
   * @param formService - form service.
   * @param sessionStore - session storage.
   * @param route - route service.
   */
  constructor(
    public router: Router,
    private formService: FormsActionsService,
    private sessionStore: SessionStorageService,
    private route: ActivatedRoute) {
    this.dispData = JSON.parse(this.sessionStore.get('paymentData'));
  }

  /**
   * Method initializes first.
   */
  ngOnInit() {

    if (this.dispData) {
      this.route.queryParams.subscribe(resp => { 
        if (resp.status) {
          this.paymentStatus = resp.status;
        }
      });

      /**
       * redirect after 10 seconds.
       */
      this.locateTotargetPage(this.dispData);

      /**
       * clear session data.
       */
      this.clearSession();

    } else {

      /**
       * navigate to 404.
       */
      this.router.navigateByUrl('/404');
    }

  }

  /**
   * method is used to locate gateway response and redirect to my application page.
   * @param data 
   */
  locateTotargetPage(data) {

    /**
     * payment data object.
     */
    let payData = {
      id: null,
      uniqueId: null,
      version: null,
      refNumber: data.refNumber ? data.refNumber : null,
      resourceType: data.resourceType ? data.resourceType : null,
      response: JSON.stringify({
        data: "paid",
        status: true
      }),
      transactionId: data.transactionId,
      paymentStatus: this.paymentStatus
    }

    /**
     * call api to get details after success payment.
     */
    this.formService.createPayment(payData).subscribe(payResp => {
      const payRespData = payResp.data.responseData;
        setTimeout(() => {
          this.redirectToMyApplication(data.myApplicationUrl, payRespData.refNumber, payData.resourceType, payRespData.payableServiceType);
        }, 10000);

        /**
         * increase time to 10 secs.
         */
        this.interVal();
      });
  }

  /**
   * method is used to redirect to my application page.
   */
  redirectToMyApplication(myApplicationUrl,refNumber = undefined, resourceType = undefined, serviceType = undefined) {
    if(refNumber && resourceType && serviceType){
      this.router.navigateByUrl(myApplicationUrl + `?refNumber=${refNumber}&resourceType=${resourceType}&serviceType=${serviceType}`);
    } else {
      this.router.navigateByUrl(myApplicationUrl);
    }
  }

  /**
   * Method is used to increase time interval.
   */
  interVal() {

    /**
     * setting time interval.
     */
    setInterval(() => {
      this.dispTime = this.dispTime - 1
    }, 1000)

  }

  /**
   * method is used to clear session data.
   */
  clearSession() {
    this.sessionStore.remove('paymentData');
  }
}
