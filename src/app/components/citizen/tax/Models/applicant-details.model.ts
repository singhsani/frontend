
export class ApplicantDetailDTO {

    firstName: String;

    lastName: String;

    middleName: String;

    contactNo: String;

    mobileNo: String;

    email: String;

    citizenServiceType: String;

    citizenAddressDTO: CitizenAddressDTO;

}


export class CitizenAddressDTO {

    addressType: String;

    buildingName: String;

    buildingNameGuj: String;

    streetName: String;

    streetNameGuj: String;
    
    landmark: String;

    landmarkGuj: String;

    area: String;

    areaGuj: String;

    state: String;

    stateGuj: String;

    district: String;

    districtGuj: String;

    city: String;

    cityGuj: String;

    pincode: String;

    country: String;

    countryGuj: String;

}