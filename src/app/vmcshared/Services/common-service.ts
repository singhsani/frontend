import { Injectable } from '@angular/core';
import { Constants } from '../Constants';
import { HttpClient } from '@angular/common/http';
import { HttpModule, Headers, Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class CommonService {

    applicationNo :string ;

    serviceFormId ;

    /* Lookup API Url */
    getLookupValuesUrl = Constants.baseApiUrl + 'lookup/gets';
    getLookupValuesAccordingToScreenUrl = Constants.baseApiUrl + 'lookup/get';
    getMessageValuesUrl = Constants.messageApiUrl + 'byKeys';

    /* Common APIs */
    getWardLabelUrl = Constants.baseApiUrl + 'property/propertyType/search';
    getWardZoneLevelUrl = Constants.baseApiUrl + 'wardzoneLevelDef/search';
    getWardZoneUrl = Constants.baseApiUrl + 'wardzoneMst/search';
    getUsageListUrl = Constants.baseApiUrl + 'usage/search';
    getSubUsageListUrl = Constants.baseApiUrl + 'subUsage/search';
    getPropertyListUrl = Constants.baseApiUrl + 'property/propertyType/search';
    getSubPropertyListUrl = Constants.baseApiUrl + 'property/subPropertyType/search';

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type'

        })
    };

    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        private router: Router
    ) { }

    getLookupValues() {
        return this.http.get(this.getLookupValuesUrl);
    }

    getLookupValuesAccordingToScreen(lookupIdCode: any) {
        // console.log('Common API', this.getLookupValuesUrl + "?" + lookupIdCode);
        return this.http.get(this.getLookupValuesUrl + "?" + lookupIdCode);
    }

    getMessagesAccordingToScreen(messageKey: any) {
        return this.http.get(this.getMessageValuesUrl + "?" + messageKey);
    }

    /** Get Ward Zone Level */
    getWardZoneLevel(moduleItemId: any) {
        return this.http.post(this.getWardZoneLevelUrl + '?moduleItemId=' + moduleItemId, null, { observe: 'response' })
            .pipe(map((response: any) => response))
    }

    getWardZone(data: any) {
        return this.http.post(this.getWardZoneUrl, data, { observe: 'response' })
            .pipe(map((response: any) => response))
    }

    /** Ward Label */
    getWardLabels(moduleItemId: any) {
        return this.http.post<any>(this.getWardLabelUrl, {}, { observe: 'response' })
    }

    /** Get Usage List */
    getUsageList(data: any) {
        return this.http.post(this.getUsageListUrl, data, { observe: 'response' })
            .pipe(map((response: any) => response))
    }

    /** Get Sub Usage List */
    getSubUsageList(data: any) {
        return this.http.post(this.getSubUsageListUrl, data, { observe: 'response' })
            .pipe(map((response: any) => response));
    }

    /** Get Property List */
    getPropertyList(data: any) {
        return this.http.post(this.getPropertyListUrl, data, { observe: 'response' })
            .pipe(map((response: any) => response));
    }

    /** Get Sub Property List */
    getSubPropertyList(data: any) {
        return this.http.post(this.getSubPropertyListUrl, data, { observe: 'response' })
            .pipe(map((response: any) => response));
    }

    getPayloadDate(formDate: any) {
        if (formDate != null && formDate !== undefined) {
            const fdate = new Date(formDate);
            let mdate: any = fdate.getDate();
            let mondate: any = fdate.getMonth() + 1;
            if (fdate.getDate() <= 9) {
                mdate = '0' + fdate.getDate();
            }
            if (mondate <= 9) {
                mondate = '0' + mondate;
            }
            const formatedData = (fdate.getFullYear() + '-' + mondate + '-' + mdate).toString();
            return formatedData;
        } else {
            return formDate;
        }
    }
    /**
     * Compares two Date objects and returns e number value that represents 
     * the result:
     * 0 if the two dates are equal.
     * 1 if the first date is greater than second.
     * -1 if the first date is less than second.
     * @param date1 First date object to compare.
     * @param date2 Second date object to compare.
     */
    compareDate(date1: Date, date2: Date): number {
        // With Date object we can compare dates them using the >, <, <= or >=.
        // The ==, !=, ===, and !== operators require to use date.getTime(),
        // so we need to create a new instance of Date with 'new Date()'
        let d1 = new Date(date1); let d2 = new Date(date2);

        // Check if the dates are equal
        let same = d1.getTime() === d2.getTime();
        if (same) return 0;

        // Check if the first is greater than second
        if (d1 > d2) return 1;

        // Check if the first is less than second
        if (d1 < d2) return -1;
    }
    compare(a: any, b: any, isAsc) {
        return (a.toLowerCase() < b.toLowerCase() ? -1 : 1) * (isAsc ? 1 : -1);
    }
    compareNum(a, b, isAsc) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    getCurrentFY(financialYearList) {
        if (financialYearList) {
            const todayDate = new Date();
            var obj = financialYearList.filter(f => new Date(f.startDate) <= todayDate && new Date(f.endDate) >= todayDate)[0];
            if (obj) {
                return obj.financialYearId;
            }
        }
        return null;
    }

    getCurrentfinancialyear() {
        return this.http.get(`${Constants.baseApiUrl}financialyear/currrentFinancialYear`,
          { observe: 'response' })
          .pipe(map((response: any) => response))
      }

    getPropertyBatchErrorUrl(pId:Number) {
        return '/property/batch/error?pId='+pId;
    }

    getPropertyBatchErrorLink(pId:Number) {
        return '<a href="'+this.getPropertyBatchErrorUrl(pId)+'" target="_blank">more details</a> ';
    }


    // handle error response globally 
    callErrorResponse(error) {
        if (error.status === 400) {
            var errorMessage = '';
            error.error[0].propertyList.forEach(element => {
              errorMessage = errorMessage + element + "</br>";
            });
            this.alertService.error(errorMessage);
          }
          else {
            if(error.error instanceof ArrayBuffer) {
                let responseData = this.convertArrayBufferToNumber(error.error);
                this.alertService.error(responseData.message);
            } else {
              this.alertService.error(error.error.message);
            }
          }
    }

    convertArrayBufferToNumber(data: ArrayBuffer){
        var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
        var obj = JSON.parse(decodedString);
        return obj;
      }
    
    dueToOutstandingMessage(pNo) {
        // this.alertService.warning('Due to outstanding application can not proceed. Click ok button to make payment.',' ');
        this.alertService.warning('Can not proceed further due to remaining outstanding payment. Please complete payment of remaining outstanding amount.',' ');
        var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
        if (isConfirm) {
            // this path is present in admin side so it can't reach there. 
            // As disscuss with BA now we have commented this because payment flow is not define from citizen side.
            //this.router.navigateByUrl('/property/transaction/collection?pNo='+pNo);
        }
        subConfirm.unsubscribe();
        });
    }

    getToWords(amount){
		let toWords = require('to-words');
					let words = '';
						//toWords.convert(payData.amount);
						if(amount>0){
							words = toWords(amount);
						}else{
							words =  " "
						}
					return words;
	}


    // handle error response globally 
    callInfoResponse(error) {
        if (error.status === 400) {
            var errorMessage = '';
            error.error[0].propertyList.forEach(element => {
              errorMessage = errorMessage + element + "</br>";
            });
            this.alertService.info(errorMessage);
          }
          else {
            if(error.error instanceof ArrayBuffer) {
                let responseData = this.convertArrayBufferToNumber(error.error);
                this.alertService.info(responseData.message);
            } else {
              this.alertService.info(error.error.message);
            }
          }
    }

    /**
     * API error is handled, and display the 
     * message as warning
     * @param warn API response object
     */
    callWarningResponse(warn) {
        if (warn.status === 400) {
            let warnMessage = '';
            warn.error[0].propertyList.forEach(element => {
                warnMessage = warnMessage + element + "</br>";
            });
            this.alertService.warning(warnMessage);
          } else {
            if(warn.error instanceof ArrayBuffer) {
                let responseData = this.convertArrayBufferToNumber(warn.error);
                this.alertService.warning(responseData.message);
            } else {
              this.alertService.warning(warn.error.message);
            }
          }
    }

    /**
	 * This method is used to get user profile data
	 */
  getUserProfile() {
    return this.http.get(`${Constants.serverApiIp}/api/user/profile`);
  }
}