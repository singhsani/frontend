
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

export class DataModel {
    propertyBasicId: number;
    propertyServiceApplicationId: number;
    rebateTypeLookupId: number;
    taxRebateApplicationId: number;
    totalOutstanding: number;
    propertyOccupierId: number;
}
