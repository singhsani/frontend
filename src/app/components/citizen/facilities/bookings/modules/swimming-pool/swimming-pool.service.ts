import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { HttpService } from "src/app/shared/services/http.service";


@Injectable()
export class AppSwimmingPoolService {

    constructor(
        private http: HttpService
    ) {
    
    }

    submitData(formInfo: any, resourceCode: any) {
        const requestURL = `api/booking/swimming/submit?resourceCode=${resourceCode}`;
        return this.http.post(requestURL, formInfo);
    }

    printAcknowledgeReceipt(refNumber) {
        const reqURL = `api/booking/swimming/print/acknowledgement/${refNumber}`;
        return this.http.get(reqURL, 'printReceipt');
    }
    
    // show Select Language Rules in swimming pool bashborad
    isShowRules: boolean = true;
    SelectLanguageShowRules = new BehaviorSubject<boolean>(this.isShowRules);
    observableIsShowRules = this.SelectLanguageShowRules.asObservable();
    updatedIsShowRules(data: boolean) {
      this.SelectLanguageShowRules.next(data);
    }
}