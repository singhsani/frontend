
export class PlumberLicenseModel{
    aadharNo: number;
    active: boolean;
    birthdate:Date
    businessAddress: string;
    educationQualificationId:number;
    emailId: string;
    licenseForId: number;
    licenseNo: string;
    licenseValidTill: Date;
    mobileNo1: number;
    mobileNo2: number;
    mobileNo3: number;
    nameOfApplicant: string;
    photo: string;
    plumberLicenseId: number;
    residentialAddress: string;
    workExperienceDetail: string;
    applicationNumber:string;
  }

  export class ApplicationModel {
    applicationNumber: string;
    applicantName: string;
    mobileNumber: number;
    aadharNumber: number;
    emailID: string;
}