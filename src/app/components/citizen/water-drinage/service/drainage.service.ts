import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';



@Injectable()
export class DrainageService {

    constructor(private http: HttpClient) { }

    searchByDrainageConnectionId(connectionId: string) {
        return this.http.get(`${Constants.serverApiIp}/api/form/newDrainageConnection/fetchByDrainageConnectionNo?drainageConnectionNo=${connectionId}`);
    }
}