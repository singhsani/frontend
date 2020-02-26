export class PlumberLicenseModel {
    aadharNo: string;
    active: boolean;
    applicationNumber: string;
    birthdate: Date;
    businessAddress: string;
    educationQualificationId: number;
    emailId: string;
    licenseForId: number;
    licenseNo: string;
    licenseValidTill: Date;
    mobileNo1: string;
    mobileNo2: string;
    mobileNo3: string;
    nameOfApplicant: string;
    photo: string;
    plumberLicenseId: number;
    residentialAddress: string;
    workExperienceDetail: string;
    licenseRenewUpto:Date;
    licenseForName:string;
    licenseForGujName:string;
    educationQualificationName:string;
    educationQualificationGujName:string;
}

export class ApplicationModel {
    applicationNumber: string;
    applicantName: string;
    mobileNumber: number;
    aadharNumber: number;
    emailID: string;
}