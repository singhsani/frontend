import { Component, OnInit, ViewChild, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../.././../../shared/services/common.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ManageRoutes } from '../../../../../config/routes-conf';



@Component({
    selector: 'app-marriage-create',
    templateUrl: './marriage-create.component.html',
    styleUrls: ['./marriage-create.component.scss']
})
export class MarriageCreateComponent implements OnInit, OnChanges {

    @ViewChild('address') addrComponent: any;

    //Mandatory attachments Array
    private uploadFileArray: Array<any> =
        [{ labelName: 'Marriage Photo', fieldIdentifier: '1' },
        { labelName: 'Groom Photo', fieldIdentifier: '2' },
        { labelName: 'Bride Photo', fieldIdentifier: '3' }
        ];

        
    public dummyJSON = {
        "applicantAadharNumber": "",
        "applicantEmail": "",
        "marriageDate": "2018-11-05",
        "marriagePlace": {
            "buildingName": "dsfsdf",
            "streetName": "gfgf",
            "landmark": "fg",
            "area": "gf",
            "state": "GUJARAT",
            "district": null,
            "city": "Gandhinagar",
            "country": "INDIA",
            "pincode": "344235",
            "buildingNameGuj": "દ્સ્ફ્સ્દ્ફ",
            "streetNameGuj": "ગ્ફ્ગ્ફ",
            "landmarkGuj": "ફ્ગફ્ગ",
            "areaGuj": "ગ્ફ",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "ગાંધીનગર",
            "countryGuj": "ભારત"
        },
        "isNriMarriage": false,
        "groomFirstName": "gfdsg",
        "groomMiddleName": null,
        "groomLastName": "fgfdsgsdfg",
        "groomBirthDate": "1997-11-02",
        "groomAge": 21,
        "groomReligion": {
            "code": "HINDU",
            "gujName": "હિંદુ",
            "name": "Hindu"
        },
        "groomAadharNumber": "633363545675",
        "marriageTimeGroomStatus": {
            "code": "UNMARRIED"
        },
        "aliveWives": null,
        "groomAddress": {
            "buildingName": "gfh",
            "streetName": "gfh",
            "landmark": "hgf",
            "area": "gfhd",
            "state": "GUJARAT",
            "district": null,
            "city": "Junagadh",
            "country": "INDIA",
            "pincode": "474774",
            "buildingNameGuj": "ગ્ફ્હ",
            "streetNameGuj": "ગ્ફ્હ",
            "landmarkGuj": "હ્ગ્ફ",
            "areaGuj": "ગ્ફ્હ્દ",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "brideFirstName": "tgh",
        "brideMiddleName": "gf",
        "brideLastName": "fhg",
        "brideBirthDate": "2000-11-05",
        "brideAge": 18,
        "brideReligion": {
            "code": "HINDU",
            "gujName": "હિંદુ",
            "name": "Hindu"
        },
        "brideAadharNumber": null,
        "marriageTimeBrideStatus": {
            "code": "UNMARRIED"
        },
        "brideAddress": {
            "buildingName": "674",
            "streetName": "ghfd",
            "landmark": "sdhf",
            "area": "hgd",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "457645",
            "buildingNameGuj": "૬૭૪",
            "streetNameGuj": "ઘ્ફ્દ",
            "landmarkGuj": "સ્ધ્ફ",
            "areaGuj": "હ્ગ્દ",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "groomParentsFirstName": "gfndh",
        "groomParentsMiddleName": "vchbdg",
        "groomParentsLastName": "jfd",
        "groomParentsBirthDate": "2000-11-06",
        "groomParentsAadharNumber": "437657657657",
        "groomParentsAddress": {
            "buildingName": "64",
            "streetName": "54",
            "landmark": "653",
            "area": "54645",
            "state": "GUJARAT",
            "district": null,
            "city": "Morbi",
            "country": "INDIA",
            "pincode": "645643",
            "buildingNameGuj": "૬૪",
            "streetNameGuj": "૫૪",
            "landmarkGuj": "૬૫૩",
            "areaGuj": "૫૪૬૪૫",
            "stateGuj": null,
            "districtGuj": null,
            "cityGuj": null,
            "countryGuj": null
        },
        "groomParentsAddressResidence": {
            "buildingName": "64",
            "streetName": "54",
            "landmark": "653",
            "area": "54645",
            "state": "GUJARAT",
            "district": null,
            "city": "Morbi",
            "country": "INDIA",
            "pincode": "645643",
            "buildingNameGuj": "૬૪",
            "streetNameGuj": "૫૪",
            "landmarkGuj": "૬૫૩",
            "areaGuj": "૫૪૬૪૫",
            "stateGuj": null,
            "districtGuj": null,
            "cityGuj": null,
            "countryGuj": null
        },
        "isGroomParResAddressSame": {
            "code": "YES"
        },
        "brideParentsFirstName": "Johnhfg",
        "brideParentsMiddleName": "Domnic",
        "brideParentsLastName": "chawl",
        "brideParentsBirthDate": "2000-11-06",
        "brideParentsAadharNumber": "457645756546",
        "brideParentsAddress": {
            "buildingName": "7445",
            "streetName": "474",
            "landmark": "47544747647647",
            "area": "4747hddfshdg",
            "state": "Balochistan",
            "district": null,
            "city": "Chagai",
            "country": "PAKISTAN",
            "pincode": "457645",
            "buildingNameGuj": "૭૪૪૫",
            "streetNameGuj": "૪૭૪",
            "landmarkGuj": "૪૭૫૪૪૭૪૭૬૪૭૬૪૭",
            "areaGuj": "૪૭૪૭હ્દ્દ્ફ્શ્દ્ગ",
            "stateGuj": null,
            "districtGuj": null,
            "cityGuj": null,
            "countryGuj": null
        },
        "brideParentsAddressResidence": {
            "buildingName": "7445",
            "streetName": "474",
            "landmark": "47544747647647",
            "area": "4747hddfshdg",
            "state": "Balochistan",
            "district": null,
            "city": "Chagai",
            "country": "PAKISTAN",
            "pincode": "457645",
            "buildingNameGuj": "૭૪૪૫",
            "streetNameGuj": "૪૭૪",
            "landmarkGuj": "૪૭૫૪૪૭૪૭૬૪૭૬૪૭",
            "areaGuj": "૪૭૪૭હ્દ્દ્ફ્શ્દ્ગ",
            "stateGuj": null,
            "districtGuj": null,
            "cityGuj": null,
            "countryGuj": null
        },
        "isBrideParResAddressSame": {
            "code": "YES"
        },
        "priestFirstName": "hbd",
        "priestMiddleName": "fghdgd",
        "priestLastName": "fdjf",
        "priestBirthDate": "2000-11-13",
        "priestAddressAadharNumber": "",
        "priestAddress": {
            "buildingName": "54trhy",
            "streetName": "dghshj",
            "landmark": "jsdfg",
            "area": "dfhnjfdh",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "400457",
            "buildingNameGuj": "૫૪ત્ર્હ્ય",
            "streetNameGuj": "દ્ઘ્શ્જ",
            "landmarkGuj": "જ્સ્દ્ફ્ગ",
            "areaGuj": "દ્ફ્હ્ન્જ્ફ્ધ",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "priestAddressResidence": {
            "buildingName": "54trhy",
            "streetName": "dghshj",
            "landmark": "jsdfg",
            "area": "dfhnjfdh",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "400457",
            "buildingNameGuj": "૫૪ત્ર્હ્ય",
            "streetNameGuj": "દ્ઘ્શ્જ",
            "landmarkGuj": "જ્સ્દ્ફ્ગ",
            "areaGuj": "દ્ફ્હ્ન્જ્ફ્ધ",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "isPriestParResAddressSame": {
            "code": "YES"
        },
        "firstWitnessFirstName": "ghbdg",
        "firstWitnessMiddleName": "gh",
        "firstWitnessLastName": "fgs",
        "firstWitnessBirthDate": "2000-11-13",
        "firstWitnessAadharNumber": "547664563634",
        "firstWitnessAddress": {
            "buildingName": "4365346",
            "streetName": "346346",
            "landmark": "3636",
            "area": "36536",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "111114",
            "buildingNameGuj": "૪૩૬૫૩૪૬",
            "streetNameGuj": "૩૪૬૩૪૬",
            "landmarkGuj": "૩૬૩૬",
            "areaGuj": "૩૬૫૩૬",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "secondWitnessFirstName": "trghgdfg",
        "secondWitnessMiddleName": "fghfd",
        "secondWitnessLastName": "ghsdgh",
        "secondWitnessBirthDate": "2000-11-06",
        "secondWitnessAadharNumber": "542523453245",
        "secondWitnessAddress": {
            "buildingName": "dhf",
            "streetName": "hdssd",
            "landmark": "dshdsh",
            "area": "dsh",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "245252",
            "buildingNameGuj": "ધ્ફ",
            "streetNameGuj": "હ્દ્સ્સ્દ",
            "landmarkGuj": "દ્શ્દ્શ",
            "areaGuj": "દ્શ",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "applicantRelation": {
            "code": "SELF"
        },
        "applicantRelationOther": null,
        "uniqueIdProofLable": {
            "code": "ELECTION_CARD_NUMBER"
        },
        "uniqueIdProof": "765rthdgdfy7547y65476454774574575474",
        "groomFirstNameGuj": "ગ્ફ્દ્સ્ગ",
        "groomMiddleNameGuj": null,
        "groomLastNameGuj": "ફ્ગ્ફ્દ્સ્ગ્સ્દ્ફ્ગ",
        "brideFirstNameGuj": "ત્ઘ",
        "brideMiddleNameGuj": "ગ્ફ",
        "brideLastNameGuj": "ફ્હ્ગ",
        "groomParentsFirstNameGuj": "ગ્ફ્ન્ધ",
        "groomParentsMiddleNameGuj": "વ્ચ્બ્દ્ગ",
        "groomParentsLastNameGuj": "જ્ફ્દ",
        "brideParentsFirstNameGuj": "ઓહ્ન્હ્ફ્ગ",
        "brideParentsMiddleNameGuj": "ડોમ્નિ",
        "brideParentsLastNameGuj": "ચવ્લ",
        "priestFirstNameGuj": "હ્બ્દ",
        "priestMiddleNameGuj": "ફ્ઘ્દ્ગ્દ",
        "priestLastNameGuj": "ફ્દ્જ્ફ",
        "firstWitnessFirstNameGuj": "ઘ્બ્દ્ગ",
        "firstWitnessMiddleNameGuj": "ઘ",
        "firstWitnessLastNameGuj": "ફ્ગ્સફ્હ્જ",
        "secondWitnessFirstNameGuj": "ત્ર્ઘ્ગ્દ્ફ્ગ",
        "secondWitnessMiddleNameGuj": "ફ્ઘ્ફ્દ",
        "secondWitnessLastNameGuj": "ઘ્સ્દ્ઘદ્સ્ઘ્હ",
        "isGroomVisa": false,
        "groomPassportNumber": null,
        "groomCountry": "",
        "groomVisaNumber": null,
        "groomVisaFrom": null,
        "groomVisaTo": null,
        "groomSocialSecurityNumber": null,
        "groomEligibility": null,
        "groomDesignation": null,
        "groomPhoneNumber": null,
        "groomEmail": null,
        "nriGroomAddress": null,
        "groomCompanyName": null,
        "groomCompanyPhoneNumber": null,
        "groomCompanyAddress": null,
        "isBrideVisa": false,
        "bridePassportNumber": null,
        "brideCountry": "",
        "brideVisaNumber": null,
        "brideVisaFrom": null,
        "brideVisaTo": null,
        "brideSocialSecurityNumber": null,
        "brideEligibility": null,
        "brideDesignation": null,
        "brideEmail": null,
        "bridePhoneNumber": null,
        "nriBrideAddress": null,
        "brideCompanyName": null,
        "brideCompanyPhoneNumber": null,
        "brideCompanyAddress": null,
        "nriGroomParentsAddress": null,
        "nriBrideParentsAddress": null,
        "firstName": null,
        "middleName": null,
        "lastName": null,
        "aadhaarNo": null,
        "contactNo": null,
        "email": null,
    } ;

    translateKey: string = 'marriageRegScreen';
    marriageFormGroup: FormGroup;

    // Select id for edit marriage form
    formId: number;
    apiCode: string;
    tabIndex: number = 0;

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
        private CD : ChangeDetectorRef
    ) {}

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
            serviceCode: null,
            applicantAadharNumber: [''],
            applicantEmail: [''],

            // first step**
            marriageDate: [null, Validators.required],
            // marriageRegistrationDate: [''],
            marriagePlace: this.fb.group(this.addrComponent.addressControls()),
            // for NRI marriage
            isNriMarriage: [false, Validators.required],
            groomFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
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
            brideMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
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
            groomParentsMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
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
            brideParentsMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
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
            priestMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
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
            firstWitnessMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessBirthDate: [null, Validators.required],
            firstWitnessAadharNumber: ['', Validators.maxLength(12)],
            firstWitnessAddress: this.fb.group(this.addrComponent.addressControls()),

            //seventh step
            secondWitnessFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
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
            isGroomVisa: null,

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

    ngOnChanges(){
        this.CD.detectChanges();
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

    patchValue(){
        this.marriageFormGroup.patchValue(this.dummyJSON);
    }

    /**
     * This method is calculate groom and bride age.
     */
    CalculateAge() {
        let marriagedate = this.marriageFormGroup.get("marriageDate").value;

        if (!this.marriageFormGroup.get("marriageDate").valid && marriagedate != null) {
            this.commonService.openAlert("Warning", "Please select Date of Marriage", "warning");
        }
    
            //display days and years
            let mday = moment(this.marriageFormGroup.get("marriageDate").value, "YYYY-MM-DD");

            if (this.marriageFormGroup.get("groomBirthDate").value && marriagedate) {
                let bday = moment(this.marriageFormGroup.get("groomBirthDate").value, "YYYY-MM-DD");
                this.groomage = mday.diff(bday, 'years', false);
                this.groomdays = mday.diff(bday.add(this.groomage, 'years'), 'days', false);

                this.marriageFormGroup.get("groomAge").setValue(this.groomage);
            }

            if (this.marriageFormGroup.get("brideBirthDate").value && marriagedate) {
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
     */
    parentAge(date: string) {
        let days = 0;
        let year = 0;
        if (this.marriageFormGroup.get(date).value != null) {
            let bday = moment(this.marriageFormGroup.get(date).value, "YYYY-MM-DD");
            year = moment().diff(bday, 'years', false);
            days = moment().diff(bday.add(year, 'years'), 'days', false);

            return [year + " Year " + days + " Days"]
        }
        else {
            return null
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
        debugger;

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

        this.CD.detectChanges();
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
                this.tabIndex = 0;
                return false;
            } else if (count <= step2) {
                this.tabIndex = 1;
                return false;
            } else if (count <= step3) {
                this.tabIndex = 2;
                return false;
            } else if (count <= step4) {
                this.tabIndex = 3;
                return false;
            } else if (count <= step5) {
                this.tabIndex = 4;
                return false;
            } else if (count <= step6) {
                this.tabIndex = 5;
                return false;
            } else if (count <= step7) {
                this.tabIndex = 6;
                return false;
            }
            else if (count <= step8) {
                this.tabIndex = 7;
                return false;
            }
            else if (count == 67) {
                this.checkReligion();
                return false;
            }
            // for NIR marriage
            else if (count >= 90 && count <= 103) {
                this.tabIndex = 0;
                return false;
            } else if (count >= 103 && count <= 118) {
                this.tabIndex = 1;
                return false;
            } else if (count == 119) {
                this.tabIndex = 2;
                return false;
            } else if (count == 120) {
                this.tabIndex = 3;
                return false;
            }

            else {
                console.log("else condition");
            }

        }
    }

    /**
	 * This method use to get output event of tab change
	 * @param evt - Tab index
	 */
    onTabChange(evt) {
        this.tabIndex = evt;
    }

    /**
     * Method is used to reset form its a output event from action bar.
     */
    // stepReset() {
    //     this.stepper.reset();
    //     this.addObject['checkedPar1'] = false;
    //     this.addObject['checkedPar2'] = false;
    //     this.addObject['checkedPar3'] = false;
    //     this.marriageFormGroup.get('isGroomParResAddressSame').get('code').setValue('NO');
    //     this.marriageFormGroup.get('isBrideParResAddressSame').get('code').setValue('NO');
    //     this.marriageFormGroup.get('isPriestParResAddressSame').get('code').setValue('NO');
    //     this.marriageFormGroup.get('groomAddress').get('addressType').setValue('GROOM_ADDRESS');
    //     this.marriageFormGroup.get('brideAddress').get('addressType').setValue('BRIDE_ADDRESS');
    //     this.marriageFormGroup.get('groomParentsAddress').get('addressType').setValue('GROOM_PARENTS_ADDRESS');
    //     this.marriageFormGroup.get('groomParentsAddressResidence').get('addressType').setValue('GROOM_PARENTS_ADDRESS_RESIDENCE');
    //     this.marriageFormGroup.get('brideParentsAddress').get('addressType').setValue('BRIDE_PARENTS_ADDRESS');
    //     this.marriageFormGroup.get('brideParentsAddressResidence').get('addressType').setValue('GROOM_PARENTS_ADDRESS_RESIDENCE');
    //     this.marriageFormGroup.get('priestAddress').get('addressType').setValue('PRIEST_ADDRESS');
    //     this.marriageFormGroup.get('priestAddressResidence').get('addressType').setValue('PRIEST_ADDRESS_RESIDENCE');
    //     this.marriageFormGroup.get('firstWitnessAddress').get('addressType').setValue('FIRST_WITNESS_ADDRESS');
    //     this.marriageFormGroup.get('secondWitnessAddress').get('addressType').setValue('SECOND_WITNESS_ADDRESS');
    // }


}
