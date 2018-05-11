import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper, MatStepLabel } from '@angular/material';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { UploadFileService } from '../../../../../shared/upload-file.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import { ManageRoutes } from '../../../../../config/routes-conf';

@Component({
    selector: 'app-marriage-create',
    templateUrl: './marriage-create.component.html',
    styleUrls: ['./marriage-create.component.scss']
})
export class MarriageCreateComponent implements OnInit {

    @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
    @ViewChild(MatStepLabel) steplable: MatStepLabel;
    @ViewChild('address') addrComponent: any;

    translateKey: string = 'marriageScreen';

    marriageFormGroup: FormGroup;

    // Selected id for form edit
    formId: number;
    apiCode: string;

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
    private attachments: any[] = [];
    private showButtons: boolean = false;

    /**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     * @param uploadFileService - Declare upload file service property.
     */
    constructor(
        private uploadFileService: UploadFileService,
        private route: ActivatedRoute,
        public fb: FormBuilder,
        public validationError: ValidationService,
        private formService: FormsActionsService,
        private router: Router,
    ) { }

    myModel: boolean = true;
    checkboxArray;
    /**
    * This method is use for perform initialize time actions.
    */
    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            this.formId = Number(param.get('id'));
            this.apiCode = param.get('apiCode');
            this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
        });

        if (!this.formId) {
            this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
        }
        else {
            //Form Controls 
            this.marriageFormControls();
            //Get form data
            this.getFormData(this.formId);
            //Get lookup array 
            this.getLookupsData();
        }
    }
    /**
    * This method is listed form controls.
    */
    marriageFormControls() {

        this.marriageFormGroup = this.fb.group({
            // extra's important controls 
            apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
            serviceCode: "HEL-MR",
            applicantAadharNumber: [''],
            applicantEmail: [''],

            // first step**
            marriageDate: ['', Validators.required],
            marriageRegistrationDate: [''],
            marriagePlace: ['', [Validators.required, Validators.maxLength(50)]],
            groomFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomBirthDate: ['', Validators.required],
            groomAge: ['', ValidationService.groomAgeValidator],
            groomReligion: this.fb.group({
                code: [''],
                // na name: [''],
                // gujName: ['']
            }),
            // groomadoptionreligion: [''],
            groomAadharNumber: ['', [Validators.required, Validators.maxLength(12)]],
            marriageTimeGroomStatus: this.fb.group({
                code: ['', Validators.required]
            }),
            aliveWives: [''],

            // second step**
            brideFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideBirthDate: ['', Validators.required],
            brideAge: ['', ValidationService.brideAgeValidator],
            brideReligion: this.fb.group({
                code: [''],
            }),
            // brideadoptionreligion: [''],
            brideAadharNumber: ['', [Validators.required, Validators.maxLength(12)]],
            marriageTimeBrideStatus: this.fb.group({
                code: ['', Validators.required]
            }),

            //third step**
            groomParentsFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsBirthDate: ['', Validators.required],
            groomParentsAadharNumber: ['', Validators.maxLength(12)],

            //forth step
            brideParentsFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsBirthDate: ['', Validators.required],
            brideParentsAadharNumber: ['', Validators.maxLength(12)],

            //fifth step
            priestFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            priestMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            priestLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            priestBirthDate: ['', Validators.required],
            priestAddressAadharNumber: ['', Validators.maxLength(12)],

            //sixth step
            firstWitnessFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessBirthDate: ['', Validators.required],
            firstWitnessAadharNumber: ['', Validators.maxLength(12)],

            //seventh step
            secondWitnessFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessBirthDate: ['', Validators.required],
            secondWitnessAadharNumber: ['', Validators.maxLength(12)],

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
                this.attachments = res.attachments;
                this.marriageFormGroup.patchValue(res);
                this.showButtons = true;
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
	 * Method is used to set data value to upload method.
	 * @param indentifier - file identifier
	 * @param labelName - file label name.
	 * @param formPart - file form part
	 * @param variableName - file variable name.
	 */
    setDataValue(indentifier: number, labelName: string, formPart: string, variableName: string) {

        this.uploadModel = {
            fieldIdentifier: indentifier,
            labelName: labelName,
            formPart: formPart,
            variableName: variableName,
            serviceFormId: this.formId,
        }
        return this.uploadModel;
    }

    /**
     * This method required for final form submition.
     */
    handleErrorsOnSubmit(flag) {

        let step1 = 24;
        let step2 = 41;
        let step3 = 58;
        let step4 = 75;
        let step5 = 92;
        let step6 = 109;
        let step7 = 126;
        //Check form validation.
        if (this.marriageFormGroup.valid) {
            console.log("submitted");
            // this.marriageFormGroup.reset();
        }
        else {
            //Check validation for step by step
            let count = flag;

            if (count <= step1) {
                this.stepLable1 = "Bride groom Detail is not completed";
                this.stepper.selectedIndex = 0;
                return false;
            } else if (count <= step2) {
                this.stepLable2 = "Bride Detail is not completed";
                this.stepper.selectedIndex = 1;
                return false;
            } else if (count <= step3) {
                this.stepLable3 = "Guirdian of bried groom detail is not completed";
                this.stepper.selectedIndex = 2;
                return false;
            } else if (count <= step4) {
                this.stepLable4 = "Guirdian of bried detail is not completed";
                this.stepper.selectedIndex = 3;
                return false;
            } else if (count <= step5) {
                this.stepLable5 = "Priest detail is not completed";
                this.stepper.selectedIndex = 4;
                return false;
            } else if (count <= step6) {
                this.stepLable6 = "First witness detail is not completed";
                this.stepper.selectedIndex = 5;
                return false;
            } else if (count <= step7) {
                this.stepLable7 = "Second witness detail is not completed";
                this.stepper.selectedIndex = 6;
                return false;
            }
            else {
                console.log("else condition");
            }


        }
    }

}
