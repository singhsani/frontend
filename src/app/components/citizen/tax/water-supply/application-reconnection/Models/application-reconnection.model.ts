export class DataModel{
    applicationNumber: string;
    connectionDtlId: number;
    reconnectionId:number;
    plumberId: number;
  }

  export class ConnectionsModel{
    address:string;
    propertyDues:number;
    waterDues:number
    connectionDetail:ConnectionDetail;
  }

  export class ConnectionDetail{
    ownerName:string;
    connectionDtlId:number;
  }


  export class ApplicationModel {
    applicationNumber: string;
    applicantName: string;
    mobileNumber: number;
    aadharNumber: number;
    emailID: string;
}