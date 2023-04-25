import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class ValidationService {

    /**
     * This method is use for return validation messages
     * @param validatorName - get form controls name eg. firstName, etc..
     * @param validatorValue - get validators type eg. required, maxlength, etc..
     */
    static getValidatorErrorMessage(controlName: string, validatorName: string, validatorValue?: any) {
        let config = {
            // error list
            required: `${_.startCase(controlName)} is Required`,
            namelengtherror: 'Name must be at least 2 characters long',
            nameCharerror: 'Not include numeric character and special symbols',
            invalidCreditCard: 'Is invalid credit card number',
            invalidEmail: 'Invalid email address',
            invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number',
            invalidemarrigedate: 'Required and Should not be future date!',
            invalideDate: 'Date Invalid',
            invalidAadharno: 'Aadhar Number length should be 12',
            invalidNumberEntry: 'Enter only Number',
            max: `Maximum value should be ${validatorValue.max}`,
            min: `Minimum value should be ${validatorValue.min}`,
            minlength: `Minimum length ${validatorValue.requiredLength} characters`,
            maxlength: `Cannot exceed ${validatorValue.requiredLength} characters`,
            matDatepickerMin: `Date Should not below the ${moment(validatorValue.min).format("DD/MM/YYYY")}`,
            matDatepickerMax: `Date Should not exceed ${moment(validatorValue.max).format("DD/MM/YYYY")}`,
            invalidName: `${_.startCase(controlName)} Is Not Valid`,
            invalidPinCode: `Pin Code Not Valid`,
            invalidAadhar: `Invalid Aadhar Number`,
            invalidNumber: `Invalid Mobile Number`,
            invalidNumberVehcile: `Maximum Length is 10 digit`,
            invalidFaxNumber: `Invalid Fax Number`,
            invalidpregnanceTime: 'Pregnancy duration between 25 to 40',
            invalidbirthRegNumber: 'Invalid Birth Registration Date',
            invalidBuildingName: 'Building name is not valid',
            invalidemployeeage: 'Age must be >13 year',
            invalidIfscCode: 'IFSC Code is not valid',
            invalidPan: 'Enter valid PAN number e.g. ABCDE1234T',
            invalidTan: 'Enter valid TAN number e.g. HIJKL1234Z',
            invalidPanLastFour: 'Enter valid PAN number e.g. 234T',
            invalidGstin: 'The GSTIN is invalid, Please enter a valid GSTIN e.g. 29ABCDE1234F2Z5',
            invalidpetaKendraNumber: 'Should contains only alpha-numeric and numeric value',
            invalidAmount: 'Amount should be in digit and Only two digit allowed after decimal',
            motherMarriageTimeAge: 'Mothers age at marriage time should not be less then 12 Years',
            invalidGstNo: 'Please enter a valid GST Number e.g. 29ABCDE1234F2Z5',
            invalidAccountNo: 'Invalid Account No',
            invalidAcHolderName: 'Invalid Name',
            invalidDrivingLicense: 'Enter valid License number e.g. GJ0620210012122',
            invalidElectionCard: 'Enter valid Election Card Number e.g. ABC1234567',
            invalidPassport: 'Enter valid Passport number e,g, A1234567 or AB1234567',
            invalidPropertyNo: 'Please enter valid property no. with occupier code',
            invalidMemberNo: 'Please enter valid member no.',
            invalidCensusNumber: `Census Number length should be 21`,
            invalidPrcNumber : `Enter valid PRC number e.g. PRC123456789`,
            invalidPecNumber : `Enter valid PEC number e.g. PEC123456789`,
            inValidelectricityBill  :`Enter valid Election Card Number e.g. 12345678901`,
            invalidTelPhoneNumber : `Minimum length should be 10 digit`
        }

        return config[validatorName];
    }

    static showValidatorErrorMessage(validatorName: string, validatorValue: any) {
        let config = {
            invalidgroomage: 'Age must be greater than 21 year',
            invalidbridebirthdate: 'Age must be greater than 18 year',
            invalidmarriagedate: 'Select Marriage date'
        }
        return config[validatorName];
    }

    // Name validation 
    static nameValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[A-Za-z\s]+$/);
            return matches ? null : { 'invalidName': true };
        } else {
            return null;
        }
    }

    static swimmingPoolMemberValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[0-9]{11}$/); 
            // const matches = control.value.match(/^[A-Za-z]{2}[0-9]{4}[-][0-9]{2}[A-Za-z]{2}[0-9]{5}$/);
            return matches ? null : { 'invalidMemberNo': true }
        }
    }

    static telPhoneNumberValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[0-9]{11}$/); 
            return matches ? null : { 'invalidTelPhoneNumber': true }
        }
    }

    static amountValidator(control: FormControl) {
        if (control.value) {
            let regexp = /^\d*(\.\d{0,2})?$/;
            const matches = regexp.test(control.value);
            return matches ? null : { 'invalidAmount': true };
        } else {
            return null;
        }
    }

    // buildingName validation 
    static buildingNameValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[a-zA-Z0-9_/,\s-]*$/);
            return matches ? null : { 'invalidBuildingName': true };
        } else {
            return null;
        }
    }
    //
    // Email validation
    static emailValidator(control: FormControl) {
        if (control.value) {
            //    const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
            // const matches = control.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            // const matches = control.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/);
            const matches = control.value.match(/^[\w-\.]+@[\w-]+(\.[\w-]{2,3}){1,2}$/);
            return matches ? null : { 'invalidEmail': true };
        } else {
            return null;
        }
    }


    // Gst No validation
    static gstNoValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);
            return matches ? null : { 'invalidGstNo': true };
        } else {
            return null;
        }
    }


    // Groom age
    static groomAgeValidator(control: FormControl) {
        if (control.value) {
            const matches = (control.value) >= 21;
            return matches ? null : { 'invalidgroomage': true };
        }
        else if (control.value != null && !control.value) {
            return { 'invalidmarriagedate': true };
        }
        else {
            return null;
        }
    }

    // Bride age
    static brideAgeValidator(control: FormControl) {
        if (control.value) {
            const matches = (control.value) >= 18;
            return matches ? null : { 'invalidbridebirthdate': true };
        } else if (control.value != null && !control.value) {
            return { 'invalidmarriagedate': true };
        } else {
            return null;
        }

    }

    // employee age
    static employeeAgeValidate(control: FormControl) {
        if (control.value != null) {
            const matches = parseInt(control.value) >= 14 && parseInt(control.value) <= 99;
            return matches ? null : { 'invalidemployeeage': true };
        } else {
            return null;
        }
    }

    static aadharValidation(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (control.value) {
            const matches = control.value.match(/^[0-9]{12,12}$/);
            return matches ? null : { 'invalidAadhar': true };
        } else {
            return null;
        }
    }



    static mobileNumberValidation(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (control.value) {
            const matches = control.value.match(/^[0-9]{10,10}$/);
            return matches ? null : { 'invalidNumber': true };
        } else {
            return null;
        }
    }

    static mobileNumberValidationVehicle(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (control.value) {
            const matches = control.value.match(/^[0-9]{10,10}$/);
            return matches ? null : { 'invalidNumberVehcile': true };
        } else {
            return null;
        }
    }

    static faxValidation(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (control.value) {
            const matches = control.value.match(/^[0-9]{10,10}$/);
            return matches ? null : { 'invalidFaxNumber': true };
        } else {
            return null;
        }
    }

    // mother age
    static motherMarriageTimeAge(control: FormControl) {
        if (control.value != null) {
            const matches = parseInt(control.value) > 11;
            return matches ? null : { 'motherMarriageTimeAge': true };
        } else {
            return null;
        }
    }


    static pregnancyDurationValidation(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (Number(control.value) >= 25 && Number(control.value) <= 40) {
            return '';
        } else {
            return { 'invalidpregnanceTime': true };
        }
    }

    static petaKendraNumber(control: AbstractControl) {
        if (String(control.value).split('').includes(" ")) {
            return { 'invalidpetaKendraNumber': true };
        } else {
            return ''
        }
    }

    static pinCodeValidation(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (control.value && control.value.match(/^[0-9]{6,6}$/)) {
            return '';
        } else {
            return { 'invalidPinCode': true };
        }
    }

    static birthRegNumber(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (control.value && control.value.match(/^[0-9A-Z]{20,20}$/)) {
            return '';
        } else {
            return { 'invalidbirthRegNumber': true };
        }
    }

    // Name validation 
    static fullNameValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[a-zA-Z ]*$/);
            return matches ? null : { 'invalidName': true };
        } else {
            return null;
        }
    }

    static ifscCodeValidator(control: AbstractControl) {
        if (control.value) {
            const matches = control.value.match(/^[A-Z]{4}0[0-9|A-Z]{6}/);
            return matches ? null : { 'invalidIfscCode': true };
        } else {
            return null;
        }
    }

    // pan number validation 
    static panValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}/);
            return matches ? null : { 'invalidPan': true };
        } else {
            return null;
        }
    }

    // tan number validation 
    static tanValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}/);
            return matches ? null : { 'invalidTan': true };
        } else {
            return null;
        }
    }

    // gst number validation 
    static gstinValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z-0-9]{1}[Z]{1}[A-Z-0-9]{1}/g);
            return matches ? null : { 'invalidGstin': true };
        } else {
            return null;
        }
    }

    // Last 4 Digit pan number validation
    static panValidatorforlastfour(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[0-9]{3}[a-zA-Z]{1}/);
            return matches ? null : { 'invalidPanLastFour': true };
        } else {
            return null;
        }
    }

    static accountNoValidation(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^-?(0|[1-9]\d*)?$/);
            return matches ? null : { 'invalidAccountNo': true };
        } else {
            return null;
        }
    }



    static accountNolderNameValidation(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^\\p{L}+[\\p{L}\\p{Z}\\p{P}]{0,}/);
            return matches ? null : { 'invalidAcHolderName': true };
        } else {
            return null;
        }
    }

    static drivingLicenseValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[A-Z]{2}[0-9]{13}/);
            return matches ? null : { 'invalidDrivingLicense': true };
        }
        else {
            return null;
        }
    }

    static electionCardValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[A-Z]{3}[0-9]{7}/);
            return matches ? null : { 'invalidElectionCard': true };
        }
        else {
            return null;
        }
    }

    static passportValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/[A-Z]{1}[0-9]{7}/ || /[A-Z]{2}[0-9]{7}/);
            return matches ? null : { 'invalidPassport': true };
        }
        else {
            return null;
        }
    }

    static alphaNumericValidation(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[a-zA-Z0-9,-]*$/);
            return matches ? null : { 'invalidName': true };
        } else {
            return null;
        }
    }

    // Email validation
    static propertyNoValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^\d{2}-\d{2}-\d{6}-\d{3}$/);
            return matches ? null : { 'invalidPropertyNo': true };
        } else {
            return null;
        }
    }

    static censusNumberValidator(control: FormControl) {
         // censusNumber regex
        if (control.value) {
            const matches = control.value.match(/^\d{2}-\d{2}-\d{3}-\d{3}-\d{3}-\d{3}$/);
            return matches ? null : { 'invalidCensusNumber': true }
        }
    }

    static prcValidation(control: AbstractControl) {
        // PFC regex
        if (control.value) {
            const matches = control.value.match(/^\P{1}\R{1}\C{1}[0-9]{9}$/);
            return matches ? null : { 'invalidPrcNumber': true };
        } else {
            return null;
        }
    }

    static pecValidation(control: AbstractControl) {
        // PEC regex
        if (control.value) {
            const matches = control.value.match(/^\P{1}\E{1}\C{1}[0-9]{9}$/);
            return matches ? null : { 'invalidPecNumber': true };
        } else {
            return null;
        }
    }


    static electricityBillValidation(control: AbstractControl) {
        // electricity Bill length should be 11 digits
        if (control.value) {
            const matches = control.value.match(/^[0-9]{11,11}$/);
            return matches ? null : { 'inValidelectricityBill': true };
        } else {
            return null;
        }
    }
}

