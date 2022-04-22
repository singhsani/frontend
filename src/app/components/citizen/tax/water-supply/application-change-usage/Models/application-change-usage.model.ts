export class DataModel {
    applicationNumber: string;
    changeOfUsageId: number;
    changedFromDate: Date;
    connectionDtlId: number;
    subusageId: number;
    usageId: number
}

export class ConnectionsModel {
    address: string;
    propertyDues: number;
    waterDues: number
    connectionDetail: ConnectionDetail;
}

export class ConnectionDetail {
    ownerName: string;
    connectionDtlId: number;
    subusageName: string;
    usageName: string;
    usageId:number;
    subusageId:number;
}


export class ApplicationModel {
    applicationNumber: string;
    applicantName: string;
    mobileNumber: number;
    aadharNumber: number;
    emailID: string;
}