
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
    pageNo: number;
	pageSize: number;
}


export class ServiceChargeDetail {
    chargeAmount: number;
    chargeName: string;
    chargeNameLocal: string;
    serviceRateMasterId: number
}
export class ServiceCharge {
    serviceName: string;
    serviceNameLocal: string;
    totalAmount: number;
    serviceChargeDetail: ServiceChargeDetail;
    noofCopies: number;
    propertyBasicId: number;
    totalAmountOriginal: number;
    occupierId: number;
    outstandingAmount: number;
    taxRateWiseOutstandingDetails: TaxRateWiseOutstandingDetails;
}

export class PaymentModel {
    propertyBasicId: number;
    numberOfCopies: number;
    occupierId: number;
    paymentDetail: PaymentDetail;
    propertyServiceApplicationId: number;
}

export class PaymentDetail {
    accountNumber: string;
    amount: number;
    bankId: number;
    branchId: number;
    instrumentDate: Date;
    instrumentNo: string;
    payeeName: string;
    paymentModeLookupId: number;
}

export class TaxRateWiseOutstandingDetails {
    taxRateId: number;
    name: string;
    nameLocal: string;
    outstandingAmount: number
}
