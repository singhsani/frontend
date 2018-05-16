import { Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Injectable()
export class ValidationService {

    /**
     * This method is use for return validation messages
     * @param validatorName - get form controls name eg. firstName, etc..
     * @param validatorValue - get validators type eg. required, maxlength, etc..
     */
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            // error list
            required: 'Required',
            namelengtherror: 'Name must be at least 2 characters long.',
            namecharerror: 'Not include numeric character.',
            invalidCreditCard: 'Is invalid credit card number',
            invalidEmail: 'Invalid email address',
            invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
            invalidemarrigedate: 'Required and Should not be future date!',
            invalideDate: 'Date Invalid',
            invalidAadharno: 'Aadhar Number must be 12',
            invalidNumberEntry: 'Enter only Number',
            minlength: `Minimum length ${validatorValue.requiredLength} characters`,
            maxlength: `Cannot exceed ${validatorValue.requiredLength} characters`,
            invalidName: `Pattern Is Not Valid`,
            invalidPinCode: `Pin Code Not Valid`,
            invalidAadhar: `Aadhar Number is not valid`,
            invalidNumber: `Mobile Number Not Valid`,
            invalidpregnanceTime: 'Pregnancy duration incorrect',
            invalidbirthRegNumber:'Invalid Birth Registration Date.'
        }

        return config[validatorName];
    }

    static showValidatorErrorMessage(validatorName: string, validatorValue: any) {
        let config = {
            invalidgroomage: 'Age must be greater than 21 year',
            invalidbridebirthdate: 'Age must be greater than 18 year',
        }
        return config[validatorName];
    }

    // Name validation 
    static nameValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/^[a-zA-Z]*$/);
            return matches ? null : { 'invalidName': true };
        } else {
            return null;
        }
    }

    // Email validation
    static emailValidator(control: FormControl) {
        if (control.value) {
            const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
            return matches ? null : { 'invalidEmail': true };
        } else {
            return null;
        }
    }

    // Groom age
    static groomAgeValidator(control: FormControl) {
        if (control.value != null) {
            const matches = (control.value) >= 21;
            return matches ? null : { 'invalidgroomage': true };
        } else {
            return null;
        }
    }

    // Bride age
    static brideAgeValidator(control: FormControl) {
        if (control.value != null) {
            const matches = (control.value) >= 18;
            return matches ? null : { 'invalidbridebirthdate': true };
        } else {
            return null;
        }
    }

    static aadharValidation(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (control.value && control.value.match(/^[0-9]{12,12}$/)) {
            return '';
        } else {
            return { 'invalidAadhar': true };
        }
    }

    static mobileNumberValidation(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (control.value && control.value.match(/^[0-9]{10,10}$/)) {
            return '';
        } else {
            return { 'invalidNumber': true };
        }
    }

    static pregnancyDurationValidation(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (Number(control.value) >= 25 && Number(control.value) <= 50) {
            return '';
        } else {
            return { 'invalidpregnanceTime': true };
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

}
