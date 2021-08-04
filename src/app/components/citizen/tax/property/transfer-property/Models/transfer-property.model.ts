
export class SearchModel {
    level1Id: number;
    level2Id: number;
    level3Id: number;
    level4Id: number;
    propertyNo: string;
    censusNo: string;
    occupierName: string;
    ownerName: string;
    address: string;
    mobileNo: string;
    transferOfproperty: boolean;
    pageNo: number;
	pageSize: number;
}

export class DocumentReferenceModel {
    documentTypeId: number;
    documentNo: string;
    documentDate: Date;
}


export class OutstandingDetailModel {
    propertyBasicId: number;
    propertyNo: string;
    ownerName: string;
    mobileNo: string;
    propertyAddress: string;
    applicationNo: string;
    outstandingAmount: number;
    occupierOutstandingDetails: OccupierOutstandingDetails;
}

export class OccupierOutstandingDetails {
    occupierCode: number;
    occupierId: number;
    occupierName: string;
    outstandingAmount: number;
    taxRateWiseOutstandingDetails: TaxRateWiseOutstandingDetails;
}
export class TaxRateWiseOutstandingDetails {
    taxRateId: number;
    name: string;
    nameLocal: string;
    outstandingAmount: number
}

export class ApplicationModel {
    actualTransferDate: Date;
    applicationNo: string;
    carpetArea: number;
    floorNoLookupIds: Array<number>;
    oldPropertyNo: string;
    propertyNo: string;
    propertyTransferId: number;
    propertyVersionId: number;
    transferArea: number;
    transferSubTypeLookupId: number;
    transferTypeLookupId: number
}

export class OwnerModel {
    aadharNo: string;
    entryModeLookupId: 0;
    firstName: string;
    isPrimaryOwner: true;
    lastName: string;
    middleName: string;
    mobileNo: string;
    emailAddress: String;
    propertyBasicVersionId: 0;
    propertyOwnerId: 0;
    titleId: 0;
    titleName: string;
    version: 0
}