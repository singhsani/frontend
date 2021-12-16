export class DataModel{
    connectionDtlId: number;
    disconncetionId: number;
    applicationNumber: string;
    disconnectionTypeId: number;
    meterDetailId: number;
    reasonForDisconnectionId: number;
    plumberId: number;
    connectionNumber: string;
  }

  export class ConnectionsModel{
    address:string;
    propertyDues:number;
    waterDues:number
    connectionDetail:ConnectionDetail;
    meterDetail:MeterDetail;
  }

  export class ConnectionDetail{
    ownerName:string;
    connectionDtlId:number;
  }

  export class MeterDetail{
    meterDetailId:number;
  }

  export class ApplicationModel {
    applicationNumber: string;
    applicantName: string;
    mobileNumber: number;
    aadharNumber: number;
    emailID: string;
}