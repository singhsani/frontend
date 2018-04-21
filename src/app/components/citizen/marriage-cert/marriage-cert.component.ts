/**
 * Import required angular core functions.
 */
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
/**
 * Import required angular form functions.
 */
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
/**
 * Import material class
 */
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';
/**
 * Import form validation service
 */
import { ValidationService } from '../../../shared/services/validation.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-marriage-cert',
    templateUrl: './marriage-cert.component.html',
    styleUrls: ['./marriage-cert.component.scss']
})
export class MarriageCertiComponent implements OnInit {
    @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
    @ViewChild(MatStepLabel) steplable: MatStepLabel;

    marriageFormGroup: FormGroup;

    // Steps Titles
    stepLable2: string = "Bride Groom Detail";
    stepLable3: string = "Bride Detail";
    stepLable4: string = "Guirdian of bried groom";
    stepLable5: string = "Guirdian of bride";
    stepLable6: string = "Detail of Priest";
    stepLable7: string = "Detail of First Witness";
    stepLable8: string = "Detail of Second Witness";

    // for progress bar
    color = 'primary';
    mode = 'determinate';
    progressvalue = 50;
    bufferValue = 75;

    // submit for when user click submit button
    clicksubmit: boolean = false;

    // marriage date 
    marriageDate = this.validationError.marriagedateValidator();

    //groom age
    groombirth = this.validationError.groombirthdateValidator(); //for matDatepicker
    groomBirthdate: any; //for ngModel
    groomage: number;
    groommonth: number;
    groomdays: number;

    // bride age
    bridebirth = this.validationError.bridebirthdateValidator(); //for matDatepicker
    brideBirthdate: any; //for ngModel
    brideage: number;
    bridedyas: number;
    bridemonth: number;

    /**
     * @param fb - Declare FormBuilder property.
     */
    constructor(public fb: FormBuilder, public validationError: ValidationService) { }

    /**
    * This method required for form submit as a Draft.
    */
    saveDraft() {
        console.log("save as a draft " + JSON.stringify(this.marriageFormGroup.value));
    }

    /**
     * This method is use for calculate groom age.
     */
    public CalculateAge(): void {

        let now = moment(new Date());
        if (this.groomBirthdate) {
            let timeDiff = moment.duration(now.diff(this.groomBirthdate));

            this.groomdays = timeDiff.days();
            this.groomage = timeDiff.years();
            this.groommonth = timeDiff.months();
        }

        if (this.brideBirthdate) {
            let timeDiff = moment.duration(now.diff(this.brideBirthdate));

            this.bridedyas = timeDiff.days();
            this.brideage = timeDiff.years();
            this.bridemonth = timeDiff.months();
        }
    }

    /**
     * This method is use for perform initialize time actions.
     */
    ngOnInit() {
        // console.log("step "+MatStep)
        this.marriageFormGroup = this.fb.group({
            // first step
            // title: [''],
            // firstname: ['', [Validators.required, ValidationService.nameValidator]],
            // middlename: ['', [Validators.required, ValidationService.nameValidator]],
            // lastname: ['', [Validators.required, ValidationService.nameValidator]],
            // address: ['', [Validators.required]],
            // mobilenumber: [''],
            // emailId: ['', [Validators.required, ValidationService.emailValidator]],
            // aadharnumber: [''],
            // relationwithApplicant: [''],

            // second step
            marriagedate: ['', [Validators.required]],
            marriageplace: ['', Validators.required],
            groomfirstname: ['', [Validators.required, ValidationService.nameValidator]],
            groommiddlename: ['', [Validators.required, ValidationService.nameValidator]],
            groomlastname: ['', [Validators.required, ValidationService.nameValidator]],
            groombirthdate: ['', [Validators.required]],
            groomreligion: [''],
            groomadoptionreligion: [''],
            groomaddress: ['', [Validators.required]],
            groompincode: [''],
            groomaadharno: ['', [Validators.minLength(5)]],
            groommaritalstatus: ['', [Validators.required]],

            // third step
            bridefirstname: ['', [Validators.required, ValidationService.nameValidator]],
            bridemiddlename: ['', [Validators.required, ValidationService.nameValidator]],
            bridelastname: ['', [Validators.required, ValidationService.nameValidator]],
            bridebirthdate: ['', [Validators.required]],
            bridereligion: [''],
            brideadoptionreligion: [''],
            brideaddress: ['', [Validators.required]],
            bridepincode: [''],
            bridemaritalstatus: ['', [Validators.required]],
            brideaadharno: [''],

            //forth step
            groomguirdianfirstname: ['', [Validators.required, ValidationService.nameValidator]],
            groomguirdianmiddlename: ['', [Validators.required, ValidationService.nameValidator]],
            groomguirdianlastname: ['', [Validators.required, ValidationService.nameValidator]],
            groomguirdianbirthdate: ['', [Validators.required]],
            groomguirdianaddress: ['', [Validators.required]],
            groomguirdianresidenceaddress: [''],
            groomguirdianpincode: [''],
            groomguirdianaadharno: [''],

            //fifth step
            brideguirdianfirstname: ['', [Validators.required, ValidationService.nameValidator]],
            brideguirdianmiddlename: ['', [Validators.required, ValidationService.nameValidator]],
            brideguirdianlastname: ['', [Validators.required, ValidationService.nameValidator]],
            brideguirdianbirthdate: ['', [Validators.required]],
            brideguirdianaddress: ['', [Validators.required]],
            brideguirdianresidenceaddress: [''],
            brideguirdianpincode: [''],
            brideguirdianaadharno: [''],

            //sixth step
            priestfirstname: ['', [Validators.required, ValidationService.nameValidator]],
            priestmiddlename: ['', [Validators.required, ValidationService.nameValidator]],
            priestlastname: ['', [Validators.required, ValidationService.nameValidator]],
            priestbirthdate: ['', [Validators.required]],
            priestaddress: ['', [Validators.required]],
            priestresidenceaddress: [''],
            priestpincode: [''],
            priestaadharno: [''],

            //seventh step
            firstwitnessfirstname: ['', [Validators.required, ValidationService.nameValidator]],
            firstwitnessmiddlename: ['', [Validators.required, ValidationService.nameValidator]],
            firstwitnesslastname: ['', [Validators.required, ValidationService.nameValidator]],
            firstwitnessbirthdate: ['', [Validators.required]],
            firstwitnessaddress: ['', [Validators.required]],
            firstwitnessresidenceaddress: [''],
            firstwitnesspincode: [''],
            firstwitnessaadharno: [''],

            //eighthth step
            secondwitnesssecondname: ['', [Validators.required, ValidationService.nameValidator]],
            secondwitnessmiddlename: ['', [Validators.required, ValidationService.nameValidator]],
            secondwitnesslastname: ['', [Validators.required, ValidationService.nameValidator]],
            secondwitnessbirthdate: ['', [Validators.required]],
            secondwitnessaddress: ['', [Validators.required]],
            secondwitnessresidenceaddress: [''],
            secondwitnesspincode: [''],
            secondwitnessaadharno: [''],
        });

    }

    /**
     * This method required for final form submition.
     */
    onSubmit() {

        this.clicksubmit = true;

        let step1 = 12;
        let step2 = 22;
        let step3 = 30;
        let step4 = 38;
        let step5 = 46;
        let step6 = 54;
        let step7 = 62;
        //Check form validation.
        if (this.marriageFormGroup.valid) {
            this.marriageFormGroup.reset();
        }
        else {
            //Check validation for step by step
            let count = 1;

            _.forEach(this.marriageFormGroup.controls, (key) => {

                if (!key.valid) {
                    if (count <= step1) {
                        this.stepLable2 = "Bride groom Detail is not completed";
                        this.stepper.selectedIndex = 0;
                        return false;
                    } else if (count <= step2) {
                        this.stepLable3 = "Bride Detail is not completed";
                        this.stepper.selectedIndex = 1;
                        return false;
                    } else if (count <= step3) {
                        this.stepLable4 = "Guirdian of bried groom detail is not completed";
                        this.stepper.selectedIndex = 2;
                        return false;
                    } else if (count <= step4) {
                        this.stepLable5 = "Guirdian of bried detail is not completed";
                        this.stepper.selectedIndex = 3;
                        return false;
                    } else if (count <= step5) {
                        this.stepLable6 = "Priest detail is not completed";
                        this.stepper.selectedIndex = 4;
                        return false;
                    } else if (count <= step6) {
                        this.stepLable7 = "First witness detail is not completed";
                        this.stepper.selectedIndex = 5;
                        return false;
                    } else if (count <= step7) {
                        this.stepLable8 = "Second witness detail is not completed";
                        this.stepper.selectedIndex = 6;
                        return false;
                    }
                    else {
                        console.log("else condition");
                    }
                }
                count++;

            });

            // if (this.marriageFormGroup.controls.firstname.valid && this.marriageFormGroup.controls.lastname.valid) {
            //     this.stepLable1 = "Completed";
            // }
            // else {
            //     this.stepLable1 = "it's not complete";
            //     this.stepper.selectedIndex = 0;
            // }
            // //Check validation for step two
            // if (this.marriageFormGroup.controls.marriageplace.valid) {
            //     this.stepLable2 = "Completed";
            // }
            // else {
            //     this.stepLable2 = "it's not complete";
            //     this.stepper.selectedIndex = 1;
            // }

        }
    }


    // temporary array
    titleArray: any = [
        { name: 'Title', id: 't' },
        { name: 'Mr', id: 'mr' },
        { name: 'Miss', id: 'miss' },
        { name: 'Mrs', id: 'mrs' },
        { name: 'Ms', id: 'ms' }
    ];

    // temporary list
    relationArray: any = [
        { name: 'Self', id: 'self' },
        { name: 'Father', id: 'f' },
        { name: 'Mother', id: 'm' },
        { name: 'Other', id: 'o' }
    ];

    // temporary list
    religionArray: any = [
        { name: 'Hindu', id: 'self' },
        { name: 'Muslim', id: 'f' },
        { name: 'Christian', id: 'm' },
        { name: 'Sikh', id: 's' },
        { name: 'Buddhist', id: 'b' },
        { name: 'Others', id: 'o' }
    ];

    // temporary list
    maritalstatusArray: any = [
        { name: 'Unmarried', id: 'self' },
        { name: 'Married', id: 'f' },
        { name: 'other', id: 'm' }
    ];

}