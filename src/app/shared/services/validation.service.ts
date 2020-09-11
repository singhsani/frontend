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
            matDatepickerMin: `Date Should not below the CURRENT DATE`,
            matDatepickerMax: `Date Should not exceed ${moment(validatorValue.max).format("DD/MM/YYYY")}`,
            invalidName: `${_.startCase(controlName)} Is Not Valid`,
            invalidPinCode: `Pin Code Not Valid`,
            invalidAadhar: `Invalid Aadhar Number`,
            invalidNumber: `Invalid Mobile Number`,
            invalidpregnanceTime: 'Pregnancy duration between 25 to 40',
            invalidbirthRegNumber: 'Invalid Birth Registration Date',
            invalidBuildingName: 'Building name is not valid',
            invalidemployeeage: 'Age must be >13 year',
            invalidIfscCode: 'IFSC Code is not valid',
            invalidPan: 'Enter valid PAN number e.g. ABCDE1234T',
            invalidPanLastFour: 'Enter valid PAN number e.g. 234T',
            invalidGstin: 'The GSTIN is invalid, Please enter a valid GSTIN e.g. 29ABCDE1234F2Z5',
            invalidpetaKendraNumber: 'Should contains only alpha-numeric and numeric value',
            invalidAmount: 'Amount should be in digit and Only two digit allowed after decimal',
            motherMarriageTimeAge: 'Mothers age at marriage time should not be less then 12 Years',
            invalidGstNo:'Invalid GST No',
            invalidAccountNo:'Invalid Account No',
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
            const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
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

    // gst number validation 
	static gstinValidator(control: FormControl) {
		if (control.value) {
			const matches = control.value.match(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/g);
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
      return matches ? null : { 'invalidAccountNo': true };
    } else {
      return null;
    }
  }



}

