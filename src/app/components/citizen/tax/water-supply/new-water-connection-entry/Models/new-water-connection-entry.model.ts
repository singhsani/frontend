export class NewWaterConnectionEntry {
    aadharNo: string;
    active: boolean;
    buildingPermissionNo: string;
    completionCertificateNo: string;
    connectionDtlId: number;
    connectionNo: string;
    connectionSizeId: number;
    connectionTypeId: number;
    electricityConnectionNo: string;
    gasConnectionNo: string;
    level1Id: number;
    level2Id: number;
    level3Id: number;
    level4Id: number;
    limitLookupId: number;
    mobileNo: string;
    occupancyCertificateNo: string;
    oldConnectionNo: string;
    ownerName: string;
    plumberId: number;
    subusageId: number;
    usageId: number;
    applicationNumber: string;
}


export class ApplicationModel {
    applicationNumber: string;
    applicantName: string;
    mobileNumber: string;
    aadharNumber: string;
    emailID: string;
}

export class PropertyAddressModel {
    areaName: string;
    buildingName: string;
    connectionDtlId: number;
    fpNo: string;
    houseNo: string;
    landMark: string;
    plotPartNo: string;
    pincode: string;
    postalAddress: string;
    postalAddressDiff: boolean;
    serveyNo: string;
    societyName: string;
    streetName: string;
    tpNo: string;
    propertyAddressId: number;
    waterAddressId:number
    address: string;
}

export class PropertyModel {
    active: boolean;
    connectionDtlId: number;
    primaryProperty: boolean;
    propertyNo: string;
    waterConnectionPropertyDetailId: number
}