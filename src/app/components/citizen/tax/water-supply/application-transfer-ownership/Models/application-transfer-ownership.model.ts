export class DataModel{
    aadharNo: string;
    applicationNumber: string;
    connectionDtlId: number;
    mobileNo: string;
    newOwnerName: string;
    reasonForTransferId: number;
    transferOfOwnershipId: number;
    waterConnectionNumber: string;
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