import { Component, OnInit, ViewChild } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { UploadFileService } from '../../../../../shared/upload-file.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-marriage-create',
    templateUrl: './marriage-create.component.html',
    styleUrls: ['./marriage-create.component.scss']
})
export class MarriageCreateComponent implements OnInit {

    @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
    @ViewChild(MatStepLabel) steplable: MatStepLabel;
    @ViewChild('address') addrComponent: any;

    marriageFormGroup: FormGroup;

    // Selected id for form edit
    formId: number;
    private navigateSub: any;

    // Steps Titles
    stepLable1: string = "Bride Groom Detail";
    stepLable2: string = "Bride Detail";
    stepLable3: string = "Guirdian of bried groom";
    stepLable4: string = "Guirdian of bride";
    stepLable5: string = "Detail of Priest";
    stepLable6: string = "Detail of First Witness";
    stepLable7: string = "Detail of Second Witness";
    stepLable8: string = "Upload";

    // Lookups array list
    religionArray: any = [];
    maritalstatusArray: any = [];

    // Marriage date 
    disablefutureDate = new Date(moment().format('YYYY-MM-DD'));

    //Groom age
    groomBirthDate: any; // ngModel
    groomage: number = 0;
    groomdays: number = 0;
    any
    // Bride age
    brideBirthdate: any; // ngModel
    brideage: number = 0;
    bridedyas: number = 0;

    //File and image upload
    uploadModel: any = {};

    /**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     * @param uploadFileService - Declare upload file service property.
     */
    constructor(
        private uploadFileService: UploadFileService, 
        private route: ActivatedRoute, 
        private fb: FormBuilder, 
        private validationError: ValidationService, 
        private formService: FormsActionsService,
        private router: Router,
    ) {
        this.formService.apiType = "marriageReg";
    }

    /**
    * This method is use for perform initialize time actions.
    */
    ngOnInit() {
        //Get id
        this.navigateSub = this.route.params.subscribe(params => {
            this.formId = +params['id']; // (+) converts string 'id' to a number
        });

        if(!this.formId){
            this.router.navigate(['citizen/dashboard']);
        }

        //Form Controls
        this.marriageFormControls();

        //Get form data 
        this.getFormData(this.formId);

        //Get lookup array
        this.getLookupsData();
    }

    /**
    * This method is listed form controls.
    */
    marriageFormControls() {

        this.marriageFormGroup = this.fb.group({
            // extra's important controls 
            apiType: 'marriageReg',
            id: 0,
            uniqueId: null,
            version: 0,
            createdDate: null,
            updatedDate: null,
            serviceType: null,
            fileStatus: null,

            // first step applicant details
            serviceFormId: [this.formId],
            applicantAadharNumber: [],
            applicantEmail: [],

            // first step**
            marriageDate: [, [Validators.required]],
            marriageRegistrationDate: [],
            marriagePlace: ['', [Validators.required, Validators.maxLength(50)]],
            groomFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomBirthDate: [, [Validators.required]],
            groomAge: [, [ValidationService.groomAgeValidator]],
            groomReligion: this.fb.group({
                code: [''],
                // name: [''],
                // gujName: ['']
            }),
            // groomadoptionreligion: [''],
            groomAadharNumber: [, [Validators.maxLength(12)]],
            marriageTimeGroomStatus: [, [Validators.required]],
            aliveWives: [],

            // second step**
            brideFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideBirthDate: [, [Validators.required]],
            brideAge: [, [ValidationService.brideAgeValidator]],
            brideReligion: this.fb.group({
                code: [''],
            }),
            // brideadoptionreligion: [''],
            brideAadharNumber: [, [Validators.maxLength(12)]],
            marriageTimeBrideStatus: [, [Validators.required]],

            //third step**
            groomParentsFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsBirthDate: [, [Validators.required]],
            groomParentsAadharNumber: [, [Validators.maxLength(12)]],

            //forth step
            brideParentsFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsBirthDate: [, [Validators.required]],
            brideParentsAadharNumber: [, [Validators.maxLength(12)]],

            //fifth step
            priestFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            priestMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            priestLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            priestBirthDate: [, [Validators.required]],
            priestAddressAadharNumber: [, [Validators.maxLength(12)]],

            //sixth step
            firstWitnessFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessBirthDate: [, [Validators.required]],
            firstWitnessAadharNumber: [, [Validators.maxLength(12)]],

            //seventh step
            secondWitnessFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessBirthDate: [, [Validators.required]],
            secondWitnessAadharNumber: [, [Validators.maxLength(12)]],

            //first step control
            groomAddress: this.fb.group(this.addrComponent.addressControls()),
            //second step control
            brideAddress: this.fb.group(this.addrComponent.addressControls()),
            //third step control
            groomParentsAddress: this.fb.group(this.addrComponent.addressControls()),
            //third step control
            groomParentsAddressResidence: this.fb.group(this.addrComponent.addressControls()),
            //fourth step control
            brideParentsAddress: this.fb.group(this.addrComponent.addressControls()),
            //fourth step control
            brideParentsAddressResidence: this.fb.group(this.addrComponent.addressControls()),
            //fifth step control
            priestAddress: this.fb.group(this.addrComponent.addressControls()),
            //fifth step control
            priestAddressResidence: this.fb.group(this.addrComponent.addressControls()),
            //sixth step control
            firstWitnessAddress: this.fb.group(this.addrComponent.addressControls()),
            //seventh step control
            secondWitnessAddress: this.fb.group(this.addrComponent.addressControls()),
            //eighthth step control
            attachments: []
        });
    }

    /**
	 * This method is use to patch Value in marriage form
	 */
    getFormData(id) {
        this.formService.getFormData(id).subscribe(
            res => {
                // patch form value
                // if (res.groomReligion === null && res.brideReligion === null) {
                //     res.groomReligion = {};
                //     res.brideReligion = {}
                // this.marriageFormGroup.patchValue(res);
                // }
                // else {
                //     console.log("object is not found");
                // }
                this.marriageFormGroup.patchValue(res);
            },
            err => {
                console.log("get fail" + err);
            }
        );
    }

    /**
	 * This method is loaded lookups array
	 */
    getLookupsData() {
        this.formService.getDataFromLookups().subscribe(res => {
            this.religionArray = res.RELIGION;
            this.maritalstatusArray = res.MARITAL_STATUS;
        });
    }

    /**
	 * This method is change date formate
	 */
    dateFormate(date, controlType) {
        this.marriageFormGroup.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
        console.log("get date " + this.marriageFormGroup.get(controlType).value);
    }

    /**
	 * This method is calculate groom and bride age
	 */
    CalculateAge() {

        let now = moment(new Date());
        if (this.groomBirthDate) {
            //display days and years
            let m = moment(this.groomBirthDate, "YYYY-MM-DD");
            this.groomage = moment().diff(m, 'years', false);
            this.groomdays = moment().diff(m.add(this.groomage, 'years'), 'days', false);

            this.marriageFormGroup.get("groomAge").setValue(this.groomage);
        }

        if (this.brideBirthdate) {
            let m = moment(this.brideBirthdate, "YYYY-MM-DD");
            this.brideage = moment().diff(m, 'years', false);
            this.bridedyas = moment().diff(m.add(this.brideage, 'years'), 'days', false);

            this.marriageFormGroup.get("brideAge").setValue(this.brideage);
        }
    }

	/**
	 * This method use to return file upload model
	 * @param indentifier - get different indentifier for different file 
	 */
    setDataValue(indentifier: number) {

        this.uploadModel = {
            fieldIdentifier: indentifier,
            labelName: 'marriageReg',
            formPart: '3',
            variableName: 'test',
            serviceFormId: this.formId,
        }
        return this.uploadModel;
    }

    /**
     * This method required for final form submition.
     */
    handleErrorsOnSubmit(flag) {

        let step1 = 14;
        let step2 = 23;
        let step3 = 31;
        let step4 = 39;
        let step5 = 47;
        let step6 = 55;
        let step7 = 63;
        //Check form validation.
        if (this.marriageFormGroup.valid) {
            console.log("submitted");
            // this.marriageFormGroup.reset();
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

        }
    }


}
