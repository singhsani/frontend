export class OccupierModel {
    ownerName: string;
    propertyOccupierId: number;
    propertyAddress: PropertyAddress;
    censusNo:string;
}

export class PropertyAddress {
    propertyAddress: string;
}

export class VacancyPremiseCertficateModel {
    propertyServiceApplicationId: number;
    totalOutstanding: number;
    refundAmount: number;
    vacancyFrom: Date;
    vacancyTo: Date;
    vacancyPremiseCertficateId: number;
    certificateNumber:number;
    certificateDate:Date;
    approved:boolean;
}