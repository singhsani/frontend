import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
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
            invalidgroombirthdate: 'Age must be greater than 21 year',
            invalidbridebirthdate: 'Age must be greater than 18 year',
            invalidAadharno: 'Aadhar Number must be 12',
            minlength: `Minimum length ${validatorValue.requiredLength} characters`,
            maxlength: `Cannot exceed ${validatorValue.requiredLength} characters`,
        }

        return config[validatorName];
    }


    static nameValidator(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (control.value && control.value.match(/^[a-zA-Z ]{2,30}$/)) {
            return '';
        } else {
            return { 'invalidName': true };
        }
    }

    static emailValidator(control: AbstractControl) {
        // RFC 2822 compliant regex
        if (control.value && control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmail': true };
        }
    }

    static passwordValidator(control: AbstractControl) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value && control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }

    static creditCardValidator(control: AbstractControl) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value && control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            return { 'invalidCreditCard': true };
        }
    }

    marriagedateValidator() {
        // marriage date validation : disable future date
        let currentDate: Date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        let day = currentDate.getDate() - 1;
        let month = currentDate.getMonth();
        let year = currentDate.getFullYear();
        var marriageDate = new Date(year, month, day);
        return marriageDate;
    }

    // current date
    currentDate = moment(new Date());
    day = this.currentDate.days();
    month = this.currentDate.month();
    year = this.currentDate.year();

    groombirthdateValidator() {
        //groom birth date validation: must be 21 up
        let minAge: number = 21;
        var groombirth = new Date(this.year - minAge, this.month, this.day);
        return groombirth;
    }

    bridebirthdateValidator() {
        //bride birth date validation: must be 18 up
        let minAge: number = 18;
        var bridebirth = new Date(this.year - minAge, this.month, this.day);
        return bridebirth;
    }


}
