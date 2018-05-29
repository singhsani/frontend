import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper, MatStepLabel } from '@angular/material';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { UploadFileService } from '../../../../../shared/upload-file.service';
import { CommonService } from '../../.././../../shared/services/common.service';

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

    translateKey: string = 'marriageRegScreen';

    marriageFormGroup: FormGroup;

    // Select id for edit marriage form
    formId: number;
    apiCode: string;

    // Steps Titles
    stepLable1: string = "Bride Groom Detail";
    stepLable2: string = "Bride Detail";
    stepLable3: string = "Guirdian of Bried groom";
    stepLable4: string = "Guirdian of Bride";
    stepLable5: string = "Detail of Priest";
    stepLable6: string = "Detail of First Witness";
    stepLable7: string = "Detail of Second Witness";
    stepLable8: string = "Upload";

    // Lookups array list
    religionArray: any = [];
    maritalstatusArray: any = [];

    // Marriage date 
    disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
    groomagecalendar = moment().subtract(21, 'year').format("YYYY-MM-DD");
    brideagecalender = moment().subtract(18, 'year').format("YYYY-MM-DD");
    //Groom age
    groomage: number = null;
    groomdays: number = null;

    // Bride age
    brideage: number = null;
    bridedays: number = null;

    //File and image upload
    uploadModel: any = {};
    private attachments: any[] = [];
    private showButtons: boolean = false;

    //age calculation
    ageObject = {
        1: { 1: 'parent1', 2: 'days1' },
        2: { 1: 'parent2', 2: 'days2' },
        3: { 1: 'parent3', 2: 'days3' },
        4: { 1: 'parent4', 2: 'days4' },
        5: { 1: 'parent5', 2: 'days5' },
    };

    //for same address
    addObject = {
        1: { checkedPar1: Boolean },
        2: { checkedPar2: Boolean },
        3: { checkedPar3: Boolean }
    }

    // riligion in gujarati
    religionGujgroom: string;
    religionGujbride: string;
    // smarital status in gujarati
    maritalstatusGujgroom: string;
    maritalstatusGujbride: string;

    /**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     * @param uploadFileService - Declare upload file service property.
     * @param commonService - Declare sweet alert.
     */
    constructor(
        private uploadFileService: UploadFileService,
        private route: ActivatedRoute,
        public fb: FormBuilder,
        public validationError: ValidationService,
        private formService: FormsActionsService,
        private router: Router,
        private commonService: CommonService,
    ) { }

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
            marriageDate: [null, Validators.required],
            marriageRegistrationDate: [''],
            marriagePlace: this.fb.group(this.addrComponent.addressControls()),

            groomFirstName: ['abc', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomBirthDate: ['', Validators.required],
            groomAge: [null, ValidationService.groomAgeValidator],
            groomReligion: this.fb.group({
                code: [null],
                gujName: [null],
                name: [null]
            }),
            groomAadharNumber: ['', [Validators.required, Validators.maxLength(12)]],
            marriageTimeGroomStatus: this.fb.group({
                code: ['']
            }),
            aliveWives: ['', [Validators.maxLength(2), Validators.minLength(0)]],
            groomAddress: this.fb.group(this.addrComponent.addressControls()),

            // second step**
            brideFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideBirthDate: ['', Validators.required],
            brideAge: [null, ValidationService.brideAgeValidator],
            brideReligion: this.fb.group({
                code: [null],
                gujName: [null],
                name: [null]
            }),
            brideAadharNumber: ['', [Validators.required, Validators.maxLength(12)]],
            marriageTimeBrideStatus: this.fb.group({
                code: ['']
            }),
            brideAddress: this.fb.group(this.addrComponent.addressControls()),

            //third step**
            groomParentsFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsBirthDate: [null, Validators.required],
            groomParentsAadharNumber: ['', Validators.maxLength(12)],
            groomParentsAddress: this.fb.group(this.addrComponent.addressControls()),
            groomParentsAddressResidence: this.fb.group(this.addrComponent.addressControls()),
            isGroomParResAddressSame: this.fb.group({
                code: [null]
            }),

            //forth step
            brideParentsFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsBirthDate: [null, Validators.required],
            brideParentsAadharNumber: ['', Validators.maxLength(12)],
            brideParentsAddress: this.fb.group(this.addrComponent.addressControls()),
            brideParentsAddressResidence: this.fb.group(this.addrComponent.addressControls()),
            isBrideParResAddressSame: this.fb.group({
                code: [null]
            }),

            //fifth step
            priestFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            priestMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            priestLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            priestBirthDate: [null, Validators.required],
            priestAddressAadharNumber: ['', Validators.maxLength(12)],
            priestAddress: this.fb.group(this.addrComponent.addressControls()),
            priestAddressResidence: this.fb.group(this.addrComponent.addressControls()),
            isPriestParResAddressSame: this.fb.group({
                code: [null]
            }),

            //sixth step
            firstWitnessFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessBirthDate: [null, Validators.required],
            firstWitnessAadharNumber: ['', Validators.maxLength(12)],
            firstWitnessAddress: this.fb.group(this.addrComponent.addressControls()),

            //seventh step
            secondWitnessFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessMiddleName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessBirthDate: [null, Validators.required],
            secondWitnessAadharNumber: ['', Validators.maxLength(12)],
            secondWitnessAddress: this.fb.group(this.addrComponent.addressControls()),

            //eighth step
            attachments: [''],

            // gujarati field
            marriagePlaceGuj: [''],
            groomFirstNameGuj: [''],
            groomMiddleNameGuj: [''],
            groomLastNameGuj: [''],

            brideFirstNameGuj: [''],
            brideMiddleNameGuj: [''],
            brideLastNameGuj: [''],

            groomParentsFirstNameGuj: [''],
            groomParentsMiddleNameGuj: [''],
            groomParentsLastNameGuj: [''],

            brideParentsFirstNameGuj: [''],
            brideParentsMiddleNameGuj: [''],
            brideParentsLastNameGuj: [''],

            priestFirstNameGuj: [''],
            priestMiddleNameGuj: [''],
            priestLastNameGuj: [''],

            firstWitnessFirstNameGuj: [''],
            firstWitnessMiddleNameGuj: [''],
            firstWitnessLastNameGuj: [''],

            secondWitnessFirstNameGuj: [''],
            secondWitnessMiddleNameGuj: [''],
            secondWitnessLastNameGuj: ['']

        });

    }

    /**
     * This method is use to patch Value in marriage form
     */
    getFormData(id) {
        this.formService.getFormData(id).subscribe(
            res => {
                // for address
                if (res.isGroomParResAddressSame.code == "YES") {
                    this.addObject['checkedPar1'] = true;
                    this.marriageFormGroup.get('groomParentsAddressResidence').disable();
                }
                else {
                    this.addObject['checkedPar1'] = false;
                    this.marriageFormGroup.get('isGroomParResAddressSame').get('code').setValue('NO');
                }
                if (res.isBrideParResAddressSame.code == "YES") {
                    this.addObject['checkedPar2'] = true;
                    this.marriageFormGroup.get('brideParentsAddressResidence').disable();
                }
                else {
                    this.addObject['checkedPar2'] = false;
                    this.marriageFormGroup.get('isBrideParResAddressSame').get('code').setValue('NO');
                }
                if (res.isPriestParResAddressSame.code == "YES") {
                    this.addObject['checkedPar3'] = true;
                    this.marriageFormGroup.get('priestAddressResidence').disable();
                }
                else {
                    this.addObject['checkedPar3'] = false;
                    this.marriageFormGroup.get('isPriestParResAddressSame').get('code').setValue('NO');
                }

                this.attachments = res.attachments;
                this.marriageFormGroup.patchValue(res);

                //set default value
                this.marriageFormGroup.get('marriageRegistrationDate').setValue(moment().format('YYYY-MM-DD'));
                this.showButtons = true;

                //for display days
                if (res.groomBirthDate != null && res.marriageDate != null) {
                    this.CalculateAge();
                }
                //display parents age
                if (res.groomParentsBirthDate) {
                    this.age('groomParentsBirthDate', 1);
                }
                if (res.brideParentsBirthDate) {
                    this.age('brideParentsBirthDate', 2);
                }
                if (res.priestBirthDate) {
                    this.age('priestBirthDate', 3);
                }
                if (res.firstWitnessBirthDate) {
                    this.age('firstWitnessBirthDate', 4);
                }
                if (res.secondWitnessBirthDate) {
                    this.age('secondWitnessBirthDate', 5);
                }

                // display riligion
                this.religionGujgroom = _.result(_.find(this.religionArray, function (obj) {
                    return obj.code === res.groomReligion.code;
                }), 'gujName');

                this.religionGujbride = _.result(_.find(this.religionArray, function (obj) {
                    return obj.code === res.groomReligion.code;
                }), 'gujName');

                this.maritalstatusGujgroom = _.result(_.find(this.maritalstatusArray, function (obj) {
                    return obj.code === res.marriageTimeGroomStatus.code;
                }), 'gujName');

                this.maritalstatusGujbride = _.result(_.find(this.maritalstatusArray, function (obj) {
                    return obj.code === res.marriageTimeGroomStatus.code;
                }), 'gujName');

            },
            err => {
                console.log("get fail" + err);
            }
        );
    }

    /**
     * This method is loaded lookups array.
     */
    getLookupsData() {
        this.formService.getDataFromLookups().subscribe(res => {
            this.religionArray = res.RELIGION;
            this.maritalstatusArray = res.MARITAL_STATUS;
        });
    }

    /**
     * This method is change date formate.
     */
    dateFormate(date, controlType) {
        this.marriageFormGroup.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
    }

    /**
     * This method is calculate groom and bride age.
     */
    CalculateAge() {
        let marriagedate = this.marriageFormGroup.get("marriageDate").value;
        if (marriagedate === null || marriagedate === undefined) {
            this.commonService.openAlert("Warning", "please select marriage date", "warning");
        }

        //display days and years
        let mday = moment(this.marriageFormGroup.get("marriageDate").value, "YYYY-MM-DD");

        if (this.marriageFormGroup.get("groomBirthDate").value != null && marriagedate != null) {
            let bday = moment(this.marriageFormGroup.get("groomBirthDate").value, "YYYY-MM-DD");
            this.groomage = mday.diff(bday, 'years', false);
            this.groomdays = mday.diff(bday.add(this.groomage, 'years'), 'days', false);

            this.marriageFormGroup.get("groomAge").setValue(this.groomage);
        }

        if (this.marriageFormGroup.get("brideBirthDate").value != null && marriagedate != null) {
            let bday = moment(this.marriageFormGroup.get("brideBirthDate").value, "YYYY-MM-DD");
            this.brideage = mday.diff(bday, 'years', false);
            this.bridedays = mday.diff(bday.add(this.brideage, 'years'), 'days', false);

            this.marriageFormGroup.get("brideAge").setValue(this.brideage);
        }
    }

    /**
    * This method is calculate age.
    */
    age(date, index) {
        if (this.marriageFormGroup.get(date).value != null) {
            let bday = moment(this.marriageFormGroup.get(date).value, "YYYY-MM-DD");
            let year = moment().diff(bday, 'years', false);
            let days = moment().diff(bday.add(year, 'years'), 'days', false);
            this.ageObject[`parent${index}`] = year;
            this.ageObject[`days${index}`] = days;
        }
    }

    /**
     * This method is use for religion verification and reset marriage status. 
     */
    onChange(event, controlName) {
        if (controlName == 'groomReligion') {
            this.religionGujgroom = _.result(_.find(this.religionArray, function (obj) {
                return obj.code === event;
            }), 'gujName');
        }
        if (controlName == 'brideReligion') {
            this.religionGujbride = _.result(_.find(this.religionArray, function (obj) {
                return obj.code === event;
            }), 'gujName');
        }

        if (controlName == 'marriageTimeGroomStatus') {
            this.maritalstatusGujgroom = _.result(_.find(this.maritalstatusArray, function (obj) {
                return obj.code === event.value;
            }), 'gujName');
        }

        if (controlName == 'marriageTimeBrideStatus') {
            this.maritalstatusGujbride = _.result(_.find(this.maritalstatusArray, function (obj) {
                return obj.code === event.value;
            }), 'gujName');
        }

        let groomreligionChange = this.marriageFormGroup.controls.groomReligion.get("code").value;
        let bridereligionChange = this.marriageFormGroup.controls.brideReligion.get("code").value;

        if (bridereligionChange != groomreligionChange && (groomreligionChange != null && bridereligionChange != null)) {
            this.commonService.openAlert("Warning", "Bride Groom and Bride religion must be same. Your Marriage has to be Registered under Special Marriage Act. Kindly contact office of Special Marriage Registration at Kuber Bhavan, Kothi char Rasta, Vadodara", "warning");
            this.stepper.selectedIndex = 0;
        }
    }

    /**
     * This method is use reset value. 
     */
    changeReset(controlName) {
        this.marriageFormGroup.get(controlName).reset();
    }

    /**
     * This method is use for autofill address . 
     */
    check(event, ischeck, controlfirst, controlsecond, add) {

        let firstControl = this.marriageFormGroup.get(controlfirst);
        let secondControl = this.marriageFormGroup.get(controlsecond);
        let addressType = this.marriageFormGroup.get(controlsecond).get('addressType').value;
        let resAddressType = this.marriageFormGroup.get(controlfirst).get('addressType').value;

        if (event.checked) {
            this.addObject[`checkedPar${add}`] = true;
            this.marriageFormGroup.get(ischeck).get('code').setValue("YES");
            firstControl.setValue(secondControl.value);
            firstControl.disable();
            this.marriageFormGroup.get(controlsecond).get('addressType').setValue(addressType);
            this.marriageFormGroup.get(controlfirst).get('addressType').setValue(resAddressType);
        }
        else {
            this.addObject[`checkedPar${add}`] = false;
            firstControl.reset();
            firstControl.enable();
            this.marriageFormGroup.get(controlsecond).get('addressType').setValue(addressType);
            this.marriageFormGroup.get(controlfirst).get('addressType').setValue(resAddressType);
            this.marriageFormGroup.get(ischeck).get('code').setValue("NO");
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
     * @param count - flag of invalid control.
     */
    handleErrorsOnSubmit(flag) {

        let step1 = 17;
        let step2 = 26;
        let step3 = 34;
        let step4 = 42;
        let step5 = 50;
        let step6 = 56;
        let step7 = 62;

        if (flag != null) {
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

    /**
     * Method is used to reset form its a output event from action bar.
     */
    stepReset() {
        this.stepper.reset();
        this.addObject['checkedPar1'] = false;
        this.addObject['checkedPar2'] = false;
        this.addObject['checkedPar3'] = false;
        this.marriageFormGroup.get('groomAddress').get('addressType').setValue('GROOM_ADDRESS');
        this.marriageFormGroup.get('brideAddress').get('addressType').setValue('BRIDE_ADDRESS');
        this.marriageFormGroup.get('groomParentsAddress').get('addressType').setValue('GROOM_PARENTS_ADDRESS');
        this.marriageFormGroup.get('groomParentsAddressResidence').get('addressType').setValue('GROOM_PARENTS_ADDRESS_RESIDENCE');
        this.marriageFormGroup.get('brideParentsAddress').get('addressType').setValue('BRIDE_PARENTS_ADDRESS');
        this.marriageFormGroup.get('brideParentsAddressResidence').get('addressType').setValue('GROOM_PARENTS_ADDRESS_RESIDENCE');
        this.marriageFormGroup.get('priestAddress').get('addressType').setValue('PRIEST_ADDRESS');
        this.marriageFormGroup.get('priestAddressResidence').get('addressType').setValue('PRIEST_ADDRESS_RESIDENCE');
        this.marriageFormGroup.get('firstWitnessAddress').get('addressType').setValue('FIRST_WITNESS_ADDRESS');
        this.marriageFormGroup.get('secondWitnessAddress').get('addressType').setValue('SECOND_WITNESS_ADDRESS');
    }

}
