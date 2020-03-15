
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

export class PropertyTypeModel {
    highRiseLowRiseLookupId: number;
    locationFactorMstId: number;
    propertyBasicVersionsId: number;
    propertyTypeId: number;
    propertyTypeMstId: number;
    subPropertyTypeMstId: number;
    version: number;
    waterZoneLookupId: number
}

export class OccupierModel {
    occupierCode: number;
    titleId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    aadharNo: string;
    mobileNo: string;
    propertyBasicVersionId: number;
    propertyOccupierId:number;
}



export class UnitDetailModel {
    annualRent: number;
    buildingPermissionDate: Date;
    buildingPermissionNo: string;
    constructionClassDescriptionGuj: string;
    constructionClassMstId: number;
    constructionClassShortCode: string;
    constructionClassdescription: string;
    constructionYear: number;
    effectiveFromDate: Date;
    effectiveToDate: Date;
    entryModeLookupId: number;
    firstAssessmentDate: Date;
    floorNoLookupId: number;
    hasDrainageConnection: true;
    hasGasConnection: true;
    hasKhalkuvaConnection: true;
    locationFactorMstId: number;
    locationName: string;
    locationNameGuj: string;
    occupancyCertificateDate: Date;
    occupancyCertificateNo: string;
    completionDate: Date;
    completionNo: string;
    occupancyFactorMstId: number;
    occupierId: number;
    occypancyFactorMstType: string;
    occypancyFactorMstTypeGuj: string;
    propertyBasicId: number;
    propertyUnitId: number;
    remarks: string;
    subUsage: string;
    subUsageGuj: string;
    subUsageMstId: number;
    tikaDate: Date;
    tikaNo: string;
    unitNo: string;
    unitStatusId: number;
    usageGuj: string;
    usageMstId: number;
    usageName: string;
    version: number
  }
  
  export class MeasurementModel {
    assessableArea: number;
    builtUpArea: number;
    carpetArea: number;
    exemptedArea: number;
    generalTax: number;
    manualArea: boolean;
    propertyMeasurementId: number;
    propertyUnitVersionId: number;
    roomWiseMeasurement: number;
    valuation: number;
    version: number
  }
  
  export class RoomModel {
    assessableArea: number;
    breadth: number;
    builtUpArea: number;
    carpetArea: number;
    entryModeLookupId: number;
    exemptedArea: number;
    length: number;
    propertyRoomId: number;
    propertyUnitVersionId: number;
    roomTypeLookupId: number;
    roomTypeName: string;
    valuation: number;
    version: number
  }