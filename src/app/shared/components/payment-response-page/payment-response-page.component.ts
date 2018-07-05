import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
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
  private paymentStatus: any;

  /**
   * data to display like amount, transaction is etc.
   */
  private dispData: any;

  /**
   * display time count to redirect my application page.
   */
  private dispTime: number = 0;

  /**
   * constructor
   * @param router - router.
   * @param formService - form service.
   * @param sessionStore - session storage.
   * @param route - route service.
   */
  constructor(
    private router: Router,
    private formService: FormsActionsService,
    private sessionStore: SessionStorageService,
    private route: ActivatedRoute) {
    this.dispData = JSON.parse(this.sessionStore.get('paymentData'));
    console.log(this.dispData);
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
      refNumber: data.serviceFormId,
      response: JSON.stringify({
        data: "paid",
        status: true
      }),
      transactionId: data.transactionId,
      paymentStatus: "SUCCESS"
    }

    /**
     * call api to get details after success payment.
     */
    this.formService.createPayment(payData).subscribe(payResp => {

      console.log(payResp);

      if (payResp.success) {

        /**
         * set time out to redirect.
         */
        setTimeout(() => {
          this.redirectToMyApplication(data.myApplicationUrl);
        }, 10000);

        /**
         * increase time to 10 secs.
         */
        this.interVal();
      }
    }, err => {

      /**
       * set time out to redirect.
       */
      setTimeout(() => {
        this.redirectToMyApplication(data.myApplicationUrl);
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
  redirectToMyApplication(myApplicationUrl) {
    this.router.navigateByUrl(myApplicationUrl);
  }

  /**
   * Method is used to increase time interval.
   */
  interVal() {

    /**
     * setting time interval.
     */
    setInterval(() => {
      this.dispTime = this.dispTime + 1
    }, 1000)

  }

  /**
   * method is used to clear session data.
   */
  clearSession() {
    this.sessionStore.remove('paymentData');
  }
}
