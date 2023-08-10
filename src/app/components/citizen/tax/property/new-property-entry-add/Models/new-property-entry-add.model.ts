export class AddressModel {
  applicationNumber: string;
  approvedOn: Date;
  entryModeLookupId: number;
  gisRefNo: string;
  level1Id: number;
  level1Name: string;
  level2Id: number;
  level2Name: string;
  level3Id: number;
  level3Name: string;
  level4Id: number;
  level4Name: string;
  locationFactorMst: string;
  locationFactorMstId: number;
  oldPropertyNo: string;
  propertyBasicId: number;
  propertyNo: string;
  propertyStatus: number;
    reasonForCreationItemId: number;
  referencePropertyNo: string;
  serialNo: number;
  version: number;
  entryModeLookupCode: string;
  reasonForCreationItemCode: string;
  subReasonForCreationItemId : string;
  propertyAddressDTO: PropertyAddressDTO
}

export class PropertyAddressDTO {
  areaName: string;
  buildingName: string;
  fpNo: string;
  houseNo: string;
  isPostalAddressDiff: true;
  landMark: string;
  pincode: string;
  plotPartNo: string;
  postalAddress: string;
  propertyAddress: string;
  propertyAddressId: number;
  serveyNo: string;
  cityCensusNo: string;
  societyName: string;
  streetName: string;
  tpNo: string;
  version: number
  state: string;
  district: string;
  city: string;
};


export class OwnerModel {
  aadharNo: string;
  entryModeLookupId: number;
  firstName: string;
  isPrimaryOwner: true;
  lastName: string;
  middleName: string;
  mobileNo: string;
  emailAddress: string;
  propertyBasicVersionId: number;
  propertyOwnerId: number;
  titleId: number;
  titleName: string;
  version: number
}

export class PropertyModel {
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
  occupierType: number;
  occupierSubType: number;
  titleId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  aadharNo: string;
  mobileNo: string;
  emailAddress: string;
  propertyBasicVersionId: number;
  propertyOccupierId: number;
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