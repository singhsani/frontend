import { ComponentConfig } from "../component-config";

export class HospitalConfig extends ComponentConfig {
    public MIN_BIRTH_DATE_VALIDATION: number = 21;

    public DELAYED_BIRTH_REGISTRATION_TITLE: string = "Delayed Birth Registration";

    public LESS_30_AND_MORE_21_MESSAGE: string  = `<p>It will considered as delayed birth registration because
             registration date is more than 21 days and there will be extra Fee of Rs. 2 plus departmental charges as delayed fee.`;
             
    public LESS_YEAR_AND_MORE_30_MESSAGE: string = `<p>It will considered as delayed birth registration because
             registration date is more than 30 days so Rs. 5=00 plus departmental charges as delayed fee and
             extra attachment (Affidavit Or health Order) 
             on Rs. 20/- Stamp paper. Registration needs to be approved by Registrar of Birth, VMC.`;
             
    public MORE_THAN_YEAR_MESSAGE: string = `<p>It will considered as delayed birth registration because
             registration date is more than 1 year and there will be extra attachment (Court Order) as well as fees.`;
             
    constructor(){
        super();
    }

     getDeathDummyJSON(){
        return {
            "unknownCategory": {
                "code": "NO",
                "name": "No",
                "gujName": "ના"
            },
            "unknownDescription": null,
            "delayedPeriod": 15,
            "gender": {
                "code": "MALE",
                "name": "Male",
                "gujName": "પુરૂષ"
            },
            "deathDate": "2018-12-12",
            "birthDate": "2018-12-03",
            "fatherOrHusbandName": "sasasas",
            "motherName": "asasa",
            "religion": {
                "code": "HINDU",
                "name": "Hindu",
                "gujName": "હિંદુ"
            },
            "education": {
                "code": "7_TO_12STD",
                "name": "More than Std. 7 but less than Std. 12",
                "gujName": "ધોરણથી વધુ 7 પરંતુ ધોરણથી ઓછી છે 12"
            },
            "occupation": {
                "code": "PROF_TECH_WORKER",
                "name": "Professional, Technical and Related Workers",
                "gujName": "વ્યવસાયિક, તકનીકી અને સંબંધિત કામદારો"
            },
            "deathPlace": {
                "code": "OTHER_PLACE",
                "name": "Other Place",
                "gujName": "અન્ય સ્થાન"
            },
            "otherPlace": "asasasas",
            "otherEducation": null,
            "medicalTreatment": {
                "code": "ORGANIZATIONAL",
                "name": "Organizational",
                "gujName": "સંસ્થાકીય"
            },
            "medicalReason": {
                "code": "NO",
                "name": "No",
                "gujName": "ના"
            },
            "femaleDeathReason": {
                "code": "NO",
                "name": "No",
                "gujName": "ના"
            },
            "smokingSince": 0.0,
            "tobaccoSince": 0.0,
            "sopariPanmasalaSince": 0.0,
            "alcoholSince": 0.0,
            "presentAddress": {
                "buildingName": "sasas",
                "buildingNameGuj": "સસસ",
                "streetName": "A- 110 Azad Nagar",
                "streetNameGuj": "આ- ૧૧૦ આઝદ ણગર",
                "landmark": "asas",
                "landmarkGuj": "અસસ",
                "area": "asasasasas",
                "areaGuj": "અસસસસસ",
                "state": "GUJARAT",
                "stateGuj": "ગુજરાત",
                "district": null,
                "districtGuj": null,
                "city": "Vadodara",
                "cityGuj": "વડોદરા",
                "pincode": "311001",
                "country": "INDIA",
                "countryGuj": "ભારત"
            },
            "permanentAddress": {
                "buildingName": "sasas",
                "buildingNameGuj": "સસસ",
                "streetName": "A- 110 Azad Nagar",
                "streetNameGuj": "આ- ૧૧૦ આઝદ ણગર",
                "landmark": "asas",
                "landmarkGuj": "અસસ",
                "area": "asasasasas",
                "areaGuj": "અસસસસસ",
                "state": "GUJARAT",
                "stateGuj": "ગુજરાત",
                "district": null,
                "districtGuj": null,
                "city": "Vadodara",
                "cityGuj": "વડોદરા",
                "pincode": "311001",
                "country": "INDIA",
                "countryGuj": "ભારત"
            },
            "applicantAddress": {
                "buildingName": "asas",
                "buildingNameGuj": "અસસ",
                "streetName": "AF-01, Shapath-4, 605",
                "streetNameGuj": "આ-૦૧, ષપથ્૪, ૬૦૫",
                "landmark": "Opp. Karnavati Club",
                "landmarkGuj": "ઑપ્પ. અર્નવતિ ચ્લુબ",
                "area": null,
                "areaGuj": null,
                "state": "GUJARAT",
                "stateGuj": "ગુજરાત",
                "district": null,
                "districtGuj": null,
                "city": "Vadodara",
                "cityGuj": "વડોદરા",
                "pincode": "380051",
                "country": "INDIA",
                "countryGuj": "ભારત"
            },
            "isPermanentPresentAddressSame": {
                "code": "YES",
                "name": "Yes",
                "gujName": "હા"
            },
            "applicantRelation": {
                "code": "FATHER",
                "name": "Father",
                "gujName": "પિતા"
            },
            "relationOther": null,
            "deathReason": "sasas",
            "deceasedMiddleName": null,
            "deceasedLastName": "asas",
            "deceasedFirstName": "asas",
            "deceasedFirstNameGuj": "અસસ",
            "deceasedLastNameGuj": "અસસ",
            "deceasedMiddleNameGuj": null,
            "deathRegNumber": null
        }
    }

    getBirthDummyJSON() {
        return {
            "isOrphan": {
                "code": "NO",
                "name": "No",
                "gujName": "ના"
            },
            "noOfChilds": 1,
            "birthPlace": {
                "code": "HOSPITAL",
                "name": "Hospital",
                "gujName": "હોસ્પિટલ"
            },
            "fatherFirstName": "A",
            "fatherMiddleName": null,
            "fatherLastName": "A",
            "fatherFirstNameGuj": "આ",
            "fatherMiddleNameGuj": null,
            "fatherLastNameGuj": "આ",
            "fatherEducation": {
                "code": "7_TO_12STD",
                "name": "More than Std. 7 but less than Std. 12",
                "gujName": "ધોરણથી વધુ 7 પરંતુ ધોરણથી ઓછી છે 12"
            },
            "fatherOccupations": {
                "code": "PROF_TECH_WORKER",
                "name": "Professional, Technical and Related Workers",
                "gujName": "વ્યવસાયિક, તકનીકી અને સંબંધિત કામદારો"
            },
            "fatherAadharNumber": null,
            "motherFirstName": "A",
            "motherMiddleName": null,
            "motherLastName": "A",
            "motherFirstNameGuj": "આ",
            "motherMiddleNameGuj": null,
            "motherLastNameGuj": "આ",
            "motherEducation": {
                "code": "7_TO_12STD",
                "name": "More than Std. 7 but less than Std. 12",
                "gujName": "ધોરણથી વધુ 7 પરંતુ ધોરણથી ઓછી છે 12"
            },
            "motherOccupations": {
                "code": "PROF_TECH_WORKER",
                "name": "Professional, Technical and Related Workers",
                "gujName": "વ્યવસાયિક, તકનીકી અને સંબંધિત કામદારો"
            },
            "motherAadharNumber": null,
            "motherPrevRegNumber": null,
            "petaKendraNumber": null,
            "motherMarriageAge": 23,
            "motherDeliveryAge": 34,
            "totalAliveChild": 1,
            "deliveryTreatment": {
                "code": "GOV_INSTITUTE",
                "name": "Govt. Institutes",
                "gujName": "સરકારી સંસ્થાઓ"
            },
            "deliveryType": {
                "code": "NORMAL_BIRTH",
                "name": "Normal birth",
                "gujName": "સામાન્ય જન્મ"
            },
            "pregnancyDuration": 35,
            "isPermanentPresentAddressSame": {
                "code": "YES",
                "name": "Yes",
                "gujName": "હા"
            },
            "familyReligion": {
                "code": "HINDU",
                "name": "Hindu",
                "gujName": "હિંદુ"
            },
            "parentDeliveryAddress": {
                "buildingName": null,
                "buildingNameGuj": null,
                "streetName": "A- 110 Azad Nagar",
                "streetNameGuj": "આ- ૧૧૦ આઝદ ણગર",
                "landmark": "Rajasthan",
                "landmarkGuj": "રજસ્થન",
                "area": null,
                "areaGuj": null,
                "state": "GUJARAT",
                "stateGuj": "ગુજરાત",
                "district": null,
                "districtGuj": null,
                "city": "Vadodara",
                "cityGuj": "વડોદરા",
                "pincode": "311001",
                "country": "INDIA",
                "countryGuj": "ભારત"
            },
            "parentPermanentAddress": {
                "buildingName": null,
                "buildingNameGuj": null,
                "streetName": "A- 110 Azad Nagar",
                "streetNameGuj": "આ- ૧૧૦ આઝદ ણગર",
                "landmark": "Rajasthan",
                "landmarkGuj": "રજસ્થન",
                "area": null,
                "areaGuj": null,
                "state": "GUJARAT",
                "stateGuj": "ગુજરાત",
                "district": null,
                "districtGuj": null,
                "city": "Vadodara",
                "cityGuj": "વડોદરા",
                "pincode": "311001",
                "country": "INDIA",
                "countryGuj": "ભારત"
            },
            "childs": [
                {
                    "birthDate": "2018-12-17",
                    "birthTime": "12:12:00",
                    "sex": {
                        "code": "MALE",
                        "name": "Male",
                        "gujName": "પુરૂષ"
                    },
                    "weightKg": {
                        "code": "1",
                        "name": "1",
                        "gujName": "એક"
                    },
                    "weightGram": null,
                    "childName": "A",
                    "childNameGuj": null,
                    "prematureInfantReason": null,
                    "certificateNumber": null
                }
            ],
            "otherPlace": null,
            "delayPeriod": 2,
            "motherOtherEducation": null,
            "fatherOtherEducation": null,
            "familyReligionOther": null,
            "totalChildsBeforePregnancy": 1,
            "totalBoyChildsBeforePregnancy": 0,
            "totalGirlChildsBeforePregnancy": 1,
            "emamtaRegNumber": null
        }
    }
}
