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
    duplicateBill:boolean;
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
    billTypeLookupId: number;
}

export class PaymentModel {
    occupierId: number;
    billTypeLookupId: number;
    numberOfCopies: number;
    propertyBasicId: number;
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
