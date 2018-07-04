import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper, MatStepLabel } from '@angular/material';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../.././../../shared/services/common.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { identity } from 'rxjs';
import { element } from 'protractor';

@Component({
    selector: 'app-marriage-create',
    templateUrl: './marriage-create.component.html',
    styleUrls: ['./marriage-create.component.scss']
})
export class MarriageCreateComponent implements OnInit {

    @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
    @ViewChild(MatStepLabel) steplable: MatStepLabel;
    @ViewChild('address') addrComponent: any;

    //Mandatory attachments Array
    private uploadFileArray: Array<any> =
        [{ labelName: 'Marriage Photo', fieldIdentifier: '1' },
        { labelName: 'Groom Photo', fieldIdentifier: '2' },
        { labelName: 'Bride Photo', fieldIdentifier: '3' }
        ];

    translateKey: string = 'marriageRegScreen';
    marriageFormGroup: FormGroup;

    // Select id for edit marriage form
    formId: number;
    apiCode: string;

    // Lookups array list
    religionArray: any = [];
    maritalstatusArray: any = [];
    applicantrelationArray: any = [];
    identityproofArray: any = [];

    // Marriage date 
    disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
    adultPerson = moment().subtract(18, 'year').format("YYYY-MM-DD");
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

    // gujarati field (static)
    religionGujgroom: string = '';
    religionGujbride: string = '';
    maritalstatusGujgroom: string = '';
    maritalstatusGujbride: string = '';
    applicantrelationGuj: string = '';
    identityproofGuj: string = '';


    /**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     * @param commonService - Declare sweet alert.
     * @param route - Get url Id.
     * @param router - Navigate other page.
     */
    constructor(
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
            // marriageRegistrationDate: [''],
            marriagePlace: this.fb.group(this.addrComponent.addressControls()),
            // for NRI marriage
            isNriMarriage: [false, Validators.required],
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
            groomAadharNumber: ['', Validators.maxLength(12)],
            marriageTimeGroomStatus: this.fb.group({
                code: [null, Validators.required]
            }),
            aliveWives: ['', [Validators.maxLength(1), Validators.minLength(0)]],
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
            brideAadharNumber: ['', Validators.maxLength(12)],
            marriageTimeBrideStatus: this.fb.group({
                code: [null, Validators.required]
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
            applicantRelation: this.fb.group({
                code: [null, Validators.required]
            }),
            applicantRelationOther: [''],
            uniqueIdProofLable: this.fb.group({
                code: [null, Validators.required]
            }),
            uniqueIdProof: ['', Validators.required],

            attachments: [''],

            // gujarati field
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
            secondWitnessLastNameGuj: [''],

            // for NRI groom
            isGroomVisa: [false],

            groomPassportNumber: [null, [Validators.maxLength(9)]],
            groomCountry: [''],
            groomVisaNumber: ['', [Validators.maxLength(9)]],
            groomVisaFrom: [''],
            groomVisaTo: [''],
            groomSocialSecurityNumber: ['', [Validators.maxLength(9)]],
            groomEligibility: ['', [Validators.maxLength(50)]],
            groomDesignation: ['', [Validators.maxLength(50)]],
            groomPhoneNumber: ['', [Validators.maxLength(10)]],
            groomEmail: ['', [Validators.maxLength(50), ValidationService.emailValidator]],
            nriGroomAddress: ['', [Validators.maxLength(500)]],
            groomCompanyName: ['', [Validators.maxLength(100)]],
            groomCompanyPhoneNumber: ['', [Validators.maxLength(10)]],
            groomCompanyAddress: ['', [Validators.maxLength(500)]],

            // for NRI bride
            isBrideVisa: [false],

            bridePassportNumber: ['', [Validators.maxLength(9)]],
            brideCountry: [''],
            brideVisaNumber: ['', [Validators.maxLength(9)]],
            brideVisaFrom: [''],
            brideVisaTo: [''],
            brideSocialSecurityNumber: ['', [Validators.maxLength(9)]],
            brideEligibility: ['', [Validators.maxLength(50)]],
            brideDesignation: ['', [Validators.maxLength(50)]],
            brideEmail: ['', [Validators.maxLength(50), ValidationService.emailValidator]],
            bridePhoneNumber: ['', [Validators.maxLength(10)]],
            nriBrideAddress: ['', [Validators.maxLength(500)]],
            brideCompanyName: ['', [Validators.maxLength(100)]],
            brideCompanyPhoneNumber: ['', [Validators.maxLength(10)]],
            brideCompanyAddress: ['', [Validators.maxLength(500)]],

            nriGroomParentsAddress: ['', [Validators.maxLength(500)]],
            nriBrideParentsAddress: ['', [Validators.maxLength(500)]]
        });

    }

    /**
     * This method is use to patch Value in marriage form
     * @param id : Form Id.
     */
    getFormData(id: number) {
        this.formService.getFormData(id).subscribe(
            res => {
                // for address
                if (res.isGroomParResAddressSame.code == "YES") {
                    this.addObject['checkedPar1'] = true;
                    this.changeDisable('groomParentsAddressResidence');
                }
                else {
                    this.addObject['checkedPar1'] = false;
                    this.setValue('isGroomParResAddressSame', 'NO');
                }
                if (res.isBrideParResAddressSame.code == "YES") {
                    this.addObject['checkedPar2'] = true;
                    this.changeDisable('brideParentsAddressResidence');
                }
                else {
                    this.addObject['checkedPar2'] = false;
                    this.setValue('isBrideParResAddressSame', 'NO');
                }
                if (res.isPriestParResAddressSame.code == "YES") {
                    this.addObject['checkedPar3'] = true;
                    this.changeDisable('priestAddressResidence');
                }
                else {
                    this.addObject['checkedPar3'] = false;
                    this.setValue('isPriestParResAddressSame', 'NO');
                }

                this.marriageFormGroup.patchValue(res);
                this.showButtons = true;

                //set default value
                // this.marriageFormGroup.get('marriageRegistrationDate').setValue(moment().format('YYYY-MM-DD'));

                //for display static days
                if (res.groomBirthDate != null && res.marriageDate != null) {
                    this.CalculateAge();
                }
                //display static age calculation
                if (res.groomParentsBirthDate) {
                    this.parentAge('groomParentsBirthDate', 1);
                }
                if (res.brideParentsBirthDate) {
                    this.parentAge('brideParentsBirthDate', 2);
                }
                if (res.priestBirthDate) {
                    this.parentAge('priestBirthDate', 3);
                }
                if (res.firstWitnessBirthDate) {
                    this.parentAge('firstWitnessBirthDate', 4);
                }
                if (res.secondWitnessBirthDate) {
                    this.parentAge('secondWitnessBirthDate', 5);
                }

                //display static gujarati var
                if (!_.isUndefined(res.groomReligion.code)) {
                    this.onChange(res.groomReligion.code, this.religionArray, 'religionGujgroom')
                }

                if (!_.isUndefined(res.brideReligion.code)) {
                    this.onChange(res.brideReligion.code, this.religionArray, 'religionGujbride')
                }

                if (!_.isUndefined(res.marriageTimeGroomStatus.code)) {
                    this.onChange(res.marriageTimeGroomStatus.code, this.maritalstatusArray, 'maritalstatusGujgroom')
                }

                if (!_.isUndefined(res.marriageTimeGroomStatus.code)) {
                    this.onChange(res.marriageTimeGroomStatus.code, this.maritalstatusArray, 'maritalstatusGujbride')
                }

                if (!_.isUndefined(res.applicantRelation.code)) {
                    this.onChange(res.applicantRelation.code, this.applicantrelationArray, 'applicantrelationGuj')
                }
                if (!_.isUndefined(res.uniqueIdProofLable.code)) {
                    this.onChange(res.uniqueIdProofLable.code, this.identityproofArray, 'identityproofGuj')
                }

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
            this.applicantrelationArray = res.MARRIAGE_APPLICANT_RELATION;
            this.identityproofArray = res.MARRIAGE_ID_PROOFS;
        });
    }

    /**
     * This method is change date formate.
     * @param date : Input date(any format).
     * @param controlType : Input From Control.
     */
    dateFormate(date, controlType: string) {
        this.marriageFormGroup.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
    }

    /**
     * This method is calculate groom and bride age.
     */
    CalculateAge() {
        let marriagedate = this.marriageFormGroup.get("marriageDate").value;
        if (marriagedate === null || marriagedate === undefined) {
            this.commonService.openAlert("Warning", "Please select Date of Marriage", "warning");
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
     * This Method is set Datepicker when marriage date selected.
     */
    birthCalendar() {
        let marriagedate = this.marriageFormGroup.get("marriageDate").value;
        this.groomagecalendar = moment(marriagedate).subtract(21, 'year').format("YYYY-MM-DD");
        this.brideagecalender = moment(marriagedate).subtract(18, 'year').format("YYYY-MM-DD");
    }

    /**
     * This Method is set gujarati value in inputs (static).
     * @param lookupArray : Item List
     * @param resCode : From control value
     */
    getGujValue(lookupArray: Array<any>, resCode: string) {
        return _.result(_.find(lookupArray, function (obj) {
            return obj.code === resCode;
        }), 'gujName');
    }

    /**
     * This method is calculate age.
     * @param date : parents birth date
     * @param index : parents index
     */
    parentAge(date: string, index: number) {
        if (this.marriageFormGroup.get(date).value != null) {
            let bday = moment(this.marriageFormGroup.get(date).value, "YYYY-MM-DD");
            let year = moment().diff(bday, 'years', false);
            let days = moment().diff(bday.add(year, 'years'), 'days', false);
            this.ageObject[`parent${index}`] = year;
            this.ageObject[`days${index}`] = days;
        }
    }
    
    /**
    * This method is Reset NIR marriage related field.
    */
    changeFieldReset() {
        this.marriageFormGroup.get('isGroomVisa').setValue(false);
        this.marriageFormGroup.get('isBrideVisa').setValue(false);

        this.marriageFormGroup.get('nriGroomParentsAddress').reset();
        this.marriageFormGroup.get('groomParentsAddress').reset();
        this.marriageFormGroup.get('groomParentsAddressResidence').reset();

        this.marriageFormGroup.get('nriBrideParentsAddress').reset();
        this.marriageFormGroup.get('brideParentsAddress').reset();
        this.marriageFormGroup.get('brideParentsAddressResidence').reset();

        this.addObject['checkedPar1'] = false;
        this.addObject['checkedPar2'] = false;
        this.addObject['checkedPar3'] = false;
        this.marriageFormGroup.get('isGroomParResAddressSame').get('code').setValue('NO');
        this.marriageFormGroup.get('isBrideParResAddressSame').get('code').setValue('NO');
        this.marriageFormGroup.get('groomParentsAddress').get('addressType').setValue('GROOM_PARENTS_ADDRESS');
        this.marriageFormGroup.get('groomParentsAddressResidence').get('addressType').setValue('GROOM_PARENTS_ADDRESS_RESIDENCE');
        this.marriageFormGroup.get('brideParentsAddress').get('addressType').setValue('BRIDE_PARENTS_ADDRESS');
        this.marriageFormGroup.get('brideParentsAddressResidence').get('addressType').setValue('GROOM_PARENTS_ADDRESS_RESIDENCE');

    }

    /**
     * This method is Reset Visa related field.
     * @param person : Groom or Bride (Change Event).
     */
    changeReflection(person: string) {

        this.marriageFormGroup.get(`${person}PassportNumber`).reset();
        this.marriageFormGroup.get(`${person}Country`).reset();
        this.marriageFormGroup.get(`${person}VisaNumber`).reset();
        this.marriageFormGroup.get(`${person}VisaFrom`).reset();
        this.marriageFormGroup.get(`${person}VisaTo`).reset();
        this.marriageFormGroup.get(`${person}SocialSecurityNumber`).reset();
        this.marriageFormGroup.get(`${person}Eligibility`).reset();
        this.marriageFormGroup.get(`${person}Designation`).reset();
        this.marriageFormGroup.get(`${person}PhoneNumber`).reset();
        this.marriageFormGroup.get(`${person}Email`).reset();
        this.marriageFormGroup.get(`${person}CompanyName`).reset();
        this.marriageFormGroup.get(`${person}CompanyAddress`).reset();
        this.marriageFormGroup.get(`${person}CompanyPhoneNumber`).reset();
        // this.marriageFormGroup.get(`nriGroomAddress`).reset();
    }

    /**
     * This method is use when change selection of visa filed . 
     * @param person : Groom or Bride(Change Event).
     * @param type : Addrerss Type.
     */
    resetAddress(person: string, type: string) {
        this.marriageFormGroup.get(person).reset();
        this.marriageFormGroup.get(person).get('addressType').setValue(type);
    }

    /**
     * This method is set gujarati value on change event. 
     * @param event : get value on chnage event.
     * @param lookupArray : Item List.
     * @param varName : Static Variable.
     */
    onChange(event: string, lookupArray: Array<any>, varName: string) {
        if (!_.isUndefined(this.getGujValue(lookupArray, event)))
            this[varName] = this.getGujValue(lookupArray, event);
    }

    /**
     * This method is remove gujarati static variable. 
     * @param varName : Static Variable.
     */
    removeGuj(varName: string) {
        this[varName] = '';
    }

    /**
     * This method is check religion is same or not.
     */
    checkReligion() {
        //check religion is same or not    
        let groomreligionChange = this.marriageFormGroup.controls.groomReligion.get("code").value;
        let bridereligionChange = this.marriageFormGroup.controls.brideReligion.get("code").value;

        if (!_.isEmpty(groomreligionChange) && !_.isEmpty(bridereligionChange)) {
            if (bridereligionChange != groomreligionChange) {
                this.commonService.openAlert("Warning", "Bride Groom and Bride religion must be same. Your Marriage has to be Registered under Special Marriage Act. Kindly contact office of Special Marriage Registration at Kuber Bhavan, Kothi char Rasta, Vadodara", "warning");
            }
        }
    }

    /**
     * This method is use reset value. 
     */
    changeReset(controlName: string) {
        this.marriageFormGroup.get(controlName).reset();
    }

    /**
     * This method is use disable value. 
     * @param controlName : From control name
     */
    changeDisable(controlName: string) {
        this.marriageFormGroup.get(controlName).disable();
    }

    /**
     * This method is use set 'YES' or 'NO' value for checkbox. 
     * @param controlName : From control name.
     * @param value : control value.
     */
    setValue(controlName: string, value: string) {
        this.marriageFormGroup.get(controlName).get('code').setValue(value);
    }

    /**
     * This method is use for auto fill address . 
     * @param event : check box event(boolean).
     * @param ischeck : set 'Yes' or 'NO' value when check or uncheck.
     * @param controlfirst : Address control.
     * @param controlsecond : for copy address.
     * @param add : Static variable index.
     */
    checkBox(event, ischeck: string, controlfirst: string, controlsecond: string, add: string) {

        let firstControl = this.marriageFormGroup.get(controlfirst);
        let secondControl = this.marriageFormGroup.get(controlsecond);
        let addressType = this.marriageFormGroup.get(controlsecond).get('addressType').value;
        let resAddressType = this.marriageFormGroup.get(controlfirst).get('addressType').value;

        if (event.checked) {
            this.addObject[`checkedPar${add}`] = true;
            // this.marriageFormGroup.get(ischeck).get('code').setValue("YES");
            this.setValue(ischeck, 'YES');
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
            // this.marriageFormGroup.get(ischeck).get('code').setValue("NO");
            this.setValue(ischeck, 'NO');
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
            fieldIdentifier: indentifier.toString(),
            labelName: labelName,
            formPart: formPart,
            variableName: variableName,
            serviceFormId: this.formId,
        }
        return this.uploadModel;
    }

    /**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
    handleErrorsOnSubmit(flag) {

        let step1 = 17;
        let step2 = 26;
        let step3 = 34;
        let step4 = 42;
        let step5 = 50;
        let step6 = 56;
        let step7 = 62;
        let step8 = 66;
        let step9 = 67;

        if (flag != null) {
            //Check validation for step by step
            let count = flag;

            if (count <= step1) {
                this.stepper.selectedIndex = 0;
                return false;
            } else if (count <= step2) {
                this.stepper.selectedIndex = 1;
                return false;
            } else if (count <= step3) {
                this.stepper.selectedIndex = 2;
                return false;
            } else if (count <= step4) {
                this.stepper.selectedIndex = 3;
                return false;
            } else if (count <= step5) {
                this.stepper.selectedIndex = 4;
                return false;
            } else if (count <= step6) {
                this.stepper.selectedIndex = 5;
                return false;
            } else if (count <= step7) {
                this.stepper.selectedIndex = 6;
                return false;
            }
            else if (count <= step8) {
                this.stepper.selectedIndex = 7;
                return false;
            }
            else if (count == 67) {
                this.checkReligion();
                return false;
            }
            // for NIR marriage
            else if (count >= 90 && count <= 103) {
                this.stepper.selectedIndex = 0;
                return false;
            } else if (count >= 103 && count <= 118) {
                this.stepper.selectedIndex = 1;
                return false;
            } else if (count == 119) {
                this.stepper.selectedIndex = 2;
                return false;
            } else if (count == 120) {
                this.stepper.selectedIndex = 3;
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
        this.marriageFormGroup.get('isGroomParResAddressSame').get('code').setValue('NO');
        this.marriageFormGroup.get('isBrideParResAddressSame').get('code').setValue('NO');
        this.marriageFormGroup.get('isPriestParResAddressSame').get('code').setValue('NO');
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
