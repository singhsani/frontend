
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
}

export class DataModel {
    actionOnVacancyAmountLookupId: number;
    bankBranchId: number;
    bankId: number;
    ifscCode: string;
    occupierId: number;
    propertyServiceApplicationId: number;
    refundAccountName: string;
    refundAccountNumber: string;
    totalOutstanding: number;
    vacancyFrom: Date;
    vacancyPremiseCertficateId: number;
    vacancyTo: Date;
    outstandingAmount: number;
    taxRateWiseOutstandingDetails: TaxRateWiseOutstandingDetails;
}

export class TaxRateWiseOutstandingDetails {
    taxRateId: number;
    name: string;
    nameLocal: string;
    outstandingAmount: number
}
