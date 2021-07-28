import { Injectable } from "@angular/core";
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
}