
export class PaymentModel {
    asOnDate: Date;
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


