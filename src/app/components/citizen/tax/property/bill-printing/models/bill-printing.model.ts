export class BillPrintingModel {
    address: string;
    batchNoFrom: number;
    batchNoTo: number;
    billDateFrom: any;
    billDateTo: any;
    billNo: number;
    censusNo: string;
    level1Id: number;
    level2Id: number;
    level3Id: number;
    level4Id: number;
    mobileNo: string;
    occupierName: string;
    ownerName: string;
    propertyGenerateBill: PropertyGenerateBill;
    propertyNo: string;
    propertySubTypeId: number;
    propertyTypeId: number;
    serialNo: number;
    subUsageId: number;
    usageId: number;
    financialyearId: number;
    pageNo: number;
    pageSize: number;
}

export class PropertyGenerateBill {
    propertyBillType: string;
}

export interface ListModel {
    assessmentYear: string,
    occupierName: string,
    ownerName: string,
    propertyBillMstId: number,
    propertyNo: string
}