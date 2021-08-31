import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CommonService } from 'src/app/shared/services/common.service';
import { Constants } from 'src/app/vmcshared/Constants';

@Injectable({
    providedIn: 'root'
})
export class BillprintingserviceService {


    constructor(private http: HttpClient, private commonService: CommonService) { }

    getPropertyTypeList(data: any) {
        return this.http.post(`${Constants.baseApiUrl}property/propertyType/search`, data,
            { observe: 'response' })
            .pipe(map((response: any) => response))
    }
    getPropertySubTypeList(data: any) {
        return this.http.post(`${Constants.baseApiUrl}property/subPropertyType/search`, data,
            { observe: 'response' })
            .pipe(map((response: any) => response))
    }
    getUsageList(data: any) {
        return this.http.post(`${Constants.baseApiUrl}usage/propertyUsages`, null,
            { observe: 'response' })
            .pipe(map((response: any) => response))
    }

    getSubUsageList(data: any) {
        return this.http.post(`${Constants.baseApiUrl}subUsage/search`, data,
            { observe: 'response' })
            .pipe(map((response: any) => response))
    }

    getWardZoneLevel() {
        return this.http.post(`${Constants.baseApiUrl}wardzoneLevelDef/propertyWardzones`, null,
            { observe: 'response' })
            .pipe(map((response: any) => response))
    }

    getWardZoneFirstLevel(level: any, key: any) {
        return this.http.post(`${Constants.baseApiUrl}wardzoneMst/searchByLevel?levelOrderSeq=${level}&moduleKey=${key}`, null,
            { observe: 'response' })
            .pipe(map((response: any) => response))
    }

    getWardZone(data: any) {
        return this.http.post(`${Constants.baseApiUrl}wardzoneMst/search`, data,
            { observe: 'response' })
            .pipe(map((response: any) => response))
    }

    search(data: any) {
        return this.http.post(`${Constants.assessmentModuleApiUrl}bill/searchpropertybillByPage`, data,
            { observe: 'response' })
            .pipe(map((response: any) => response))
    }

    billPrint(data: any) {
        return this.http.post(`${Constants.assessmentModuleApiUrl}bill/print`, data,
            { responseType: "arraybuffer" })
            .pipe(map((response: any) => response))
    }
    getFinancialYear() {
        return this.http.get(`${Constants.baseApiUrl}financialyear/list`,
            { observe: 'response' })
            .pipe(map((response: any) => response))
    }

    delete(billId: number) {
        return this.http.delete(`${Constants.assessmentModuleApiUrl}bill/delete/${billId}`, { observe: 'response' })
            .pipe(map((response: any) => response));
    }

}
