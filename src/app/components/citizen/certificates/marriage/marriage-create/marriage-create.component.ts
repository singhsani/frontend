import { Component, OnInit, ViewChild, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../.././../../shared/services/common.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ManageRoutes } from '../../../../../config/routes-conf';
import { CertificateConfig } from '../../certificate-config';
import { TranslateService } from '../../../../../shared/modules/translate/translate.service';

@Component({
    selector: 'app-marriage-create',
    templateUrl: './marriage-create.component.html',
    styleUrls: ['./marriage-create.component.scss']
})
export class MarriageCreateComponent implements OnInit, OnChanges {

    @ViewChild('address') addrComponent: any;

    //Mandatory attachments Array
    public uploadFilesArray: Array<any> = [];

    isGuideLineActive: boolean = false;

    public dummyJSON = {
        "apiType": "marriageReg",
        "serviceCode": "HEL-MR",
        "applicantAadharNumber": "",
        "applicantEmail": "",
        "marriageDate": "2018-11-27",
        "marriagePlace": {
            "addressType": "MARRIAGE_PLACE",
            "buildingName": "quwat-e-islam masjid",
            "streetName": "",
            "landmark": "",
            "area": "ladwada",
            "state": "GUJARAT",
            "district": null,
            "city": "VADODARA",
            "country": "INDIA",
            "pincode": "390006",
            "buildingNameGuj": "ક્વાત-એ-ઇસ્લામ મસ્જિદ",
            "streetNameGuj": "",
            "landmarkGuj": "",
            "areaGuj": "લાડવાડા",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "isNriMarriage": false,
        "groomFirstName": "mohammad fahad",
        "groomMiddleName": "latafat husein",
        "groomLastName": "memon",
        "groomBirthDate": "1993-11-27",
        "groomAge": 25,
        "groomReligion": {
            "code": "MUSLIM",
            "gujName": "મુસ્લિમ",
            "name": "Muslim"
        },
        "groomAadharNumber": null,
        "marriageTimeGroomStatus": {
            "code": "UNMARRIED"
        },
        "aliveWives": null,
        "groomAddress": {
            "addressType": "GROOM_ADDRESS",
            "buildingName": "rajpura pole",
            "streetName": "",
            "landmark": "opp nazar baug",
            "area": "mandvi",
            "state": "GUJARAT",
            "district": null,
            "city": "VADODARA",
            "country": "INDIA",
            "pincode": "390001",
            "buildingNameGuj": "રાજપુરા પોલ",
            "streetNameGuj": "",
            "landmarkGuj": "સામે નઝર બાગ",
            "areaGuj": "માંડવી",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "brideFirstName": "aashiyanabanu",
        "brideMiddleName": "abdulrashid",
        "brideLastName": "shaikh",
        "brideBirthDate": "1993-11-27",
        "brideAge": 25,
        "brideReligion": {
            "code": "MUSLIM",
            "gujName": "મુસ્લિમ",
            "name": "Muslim"
        },
        "brideAadharNumber": null,
        "marriageTimeBrideStatus": {
            "code": "UNMARRIED"
        },
        "brideAddress": {
            "addressType": "BRIDE_ADDRESS",
            "buildingName": "alkasva apartment patel faliya no-2",
            "streetName": "",
            "landmark": "",
            "area": "yakutpura",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "390001",
            "buildingNameGuj": "અલ્કસ્વ અપર્ત્મેંત પતેલ ફલિય નો૨",
            "streetNameGuj": "",
            "landmarkGuj": "",
            "areaGuj": "",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "groomParentsFirstName": "latafat husein",
        "groomParentsMiddleName": "gulam mohammad",
        "groomParentsLastName": "memon",
        "groomParentsBirthDate": "1968-01-13",
        "groomParentsAadharNumber": '111111111111',
        "groomParentsAddress": {
            "addressType": "GROOM_PARENTS_ADDRESS",
            "buildingName": "rajpura pole",
            "streetName": "",
            "landmark": "opp nazar baug",
            "area": "mandvi",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "390001",
            "buildingNameGuj": "રજ્પુર પોલે",
            "streetNameGuj": "",
            "landmarkGuj": "ઓપ્પ નઝર બૌગ",
            "areaGuj": "મંદ્વિ",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "groomParentsAddressResidence": {
            "addressType": "GROOM_PARENTS_ADDRESS_RESIDENCE",
            "buildingName": "rajpura pole",
            "streetName": "",
            "landmark": "opp nazar baug",
            "area": "mandvi",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "390001",
            "buildingNameGuj": "રજ્પુર પોલે",
            "streetNameGuj": "",
            "landmarkGuj": "ઓપ્પ નઝર બૌગ",
            "areaGuj": "મંદ્વિ",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "isGroomParResAddressSame": {
            "code": "YES"
        },
        "brideParentsFirstName": "abdulrashid",
        "brideParentsMiddleName": "abdulsatta",
        "brideParentsLastName": "shaikh",
        "brideParentsBirthDate": "1967-01-13",
        "brideParentsAadharNumber": null,
        "brideParentsAddress": {
            "addressType": "BRIDE_PARENTS_ADDRESS",
            "buildingName": "alkasva apartment patel faliya no-2",
            "streetName": "",
            "landmark": "",
            "area": "yakutpura",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "390001",
            "buildingNameGuj": "",
            "streetNameGuj": "",
            "landmarkGuj": "",
            "areaGuj": "",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "brideParentsAddressResidence": {
            "addressType": "BRIDE_PARENTS_ADDRESS_RESIDENCE",
            "buildingName": "alkasva apartment patel faliya no-2",
            "streetName": "",
            "landmark": "",
            "area": "yakutpura",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "390001",
            "buildingNameGuj": "",
            "streetNameGuj": "",
            "landmarkGuj": "",
            "areaGuj": "",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "isBrideParResAddressSame": {
            "code": "YES"
        },
        "priestFirstName": "sethwala mohammad",
        "priestMiddleName": "",
        "priestLastName": "salman",
        "priestBirthDate": "1972-01-13",
        "priestAadharNumber": '098765432112',
        "priestAddress": {
            "addressType": "PRIEST_ADDRESS",
            "buildingName": "khatri pole",
            "streetName": "",
            "landmark": "",
            "area": "wadi",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "400457",
            "buildingNameGuj": "ખત્રી ધ્રુવ",
            "streetNameGuj": "",
            "landmarkGuj": "",
            "areaGuj": "વાડી",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "priestAddressResidence": {
            "addressType": "PRIEST_ADDRESS_RESIDENCE",
            "buildingName": "khatri pole",
            "streetName": "",
            "landmark": "",
            "area": "wadi",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "400457",
            "buildingNameGuj": "ખત્રી ધ્રુવ",
            "streetNameGuj": "",
            "landmarkGuj": "",
            "areaGuj": "વાડી",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "isPriestParResAddressSame": {
            "code": "YES"
        },
        "firstWitnessFirstName": "mohamadfesal",
        "firstWitnessMiddleName": "mohamadhanif",
        "firstWitnessLastName": "memon",
        "firstWitnessBirthDate": "1988-01-13",
        "firstWitnessAadharNumber": '123456789012',
        "firstWitnessAddress": {
            "addressType": "FIRST_WITNESS_ADDRESS",
            "buildingName": "badshah manzil",
            "streetName": "",
            "landmark": "",
            "area": "mogalwada",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "390017",
            "buildingNameGuj": "બાદશાહ મંઝીલ",
            "streetNameGuj": "",
            "landmarkGuj": "",
            "areaGuj": "મોગલવાડા",
            "stateGuj": "ગુજરાત",
            "districtGuj": null,
            "cityGuj": "વડોદરા",
            "countryGuj": "ભારત"
        },
        "secondWitnessFirstName": "munirbanu",
        "secondWitnessMiddleName": "latafathusein",
        "secondWitnessLastName": "memon",
        "secondWitnessBirthDate": "1971-01-13",
        "secondWitnessAadharNumber": null,
        "secondWitnessAddress": {
            "addressType": "SECOND_WITNESS_ADDRESS",
            "buildingName": "rajpura pole",
            "streetName": "",
            "landmark": "opp nazar baug",
            "area": "mandvi",
            "state": "GUJARAT",
            "district": null,
            "city": "Vadodara",
            "country": "INDIA",
            "pincode": "390001",
            "buildingNameGuj": "રાજપુરા પોલ",
            "streetNameGuj": "",
            "landmarkGuj": "સામે નઝર બાગ",
            "areaGuj": "માંડવી",
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
        "uniqueIdProof": "765rthdgdfy7547y6",
        "attachments": [],
        "groomFirstNameGuj": "મોહમ્મદ ફહદ",
        "groomMiddleNameGuj": "લતફત હુસેઇન",
        "groomLastNameGuj": "મેમોન",
        "brideFirstNameGuj": "આશિયનબનુ",
        "brideMiddleNameGuj": "અબ્દુલ્રશિદ",
        "brideLastNameGuj": "શૈખ",
        "groomParentsFirstNameGuj": "લતફત હુસેઇન",
        "groomParentsMiddleNameGuj": "ગુલમ મોહમ્મદ",
        "groomParentsLastNameGuj": "મેમોન",
        "brideParentsFirstNameGuj": "અબ્દુલ્રશિદ",
        "brideParentsMiddleNameGuj": "અબ્દુલ્સત્ત",
        "brideParentsLastNameGuj": "શૈખ",
        "priestFirstNameGuj": "સેથ્વલ મોહમ્મદ",
        "priestMiddleNameGuj": "",
        "priestLastNameGuj": "સલ્મન",
        "firstWitnessFirstNameGuj": "મોહમદ્ફેસલ",
        "firstWitnessMiddleNameGuj": "મોહમધનિફ",
        "firstWitnessLastNameGuj": "મેમોન",
        "secondWitnessFirstNameGuj": "મુનિર્બનુ",
        "secondWitnessMiddleNameGuj": "લતફથુસેઇન",
        "secondWitnessLastNameGuj": "મેમોન",
        "isGroomVisa": false,
        "groomPassportNumber": null,
        "groomCountryName": null,
        "groomVisaNumber": null,
        "groomVisaFrom": null,
        "groomVisaTo": null,
        "groomSocialSecurityNumber": null,
        "groomEligibility": null,
        "groomNriStatus":null,
        "groomDesignation": null,
        "groomPhoneNumber": null,
        "groomEmail": null,
        "nriGroomAddress": null,
        "groomCompanyName": null,
        "groomCompanyPhoneNumber": null,
        "groomCompanyAddress": null,
        "isBrideVisa": false,
        "bridePassportNumber": null,
        "brideNriStatus":null,
        "brideCountryName": "",
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
        "groomNriFirstWitnessFirstName": null,
        "groomNriFirstWitnessMiddlName": null,
        "groomNriFirstWitnessLastName": null,
        "groomNriFirstWitnessFirstNameGuj": null,
        "groomNriFirstWitnessMiddlNameGuj": null,
        "groomNriFirstWitnessLastNameGuj": null,
        "groomNriFirstWitnessAddress": null,
        "groomNriFirstWitnessAddressGuj": null,
        "groomNriFirstWitnessBirthDate": null,
        "groomNriSecondWitnessFirstName": null,
        "groomNriSecondWitnessMiddlName": null,
        "groomNriSecondWitnessLastName": null,
        "groomNriSecondWitnessFirstNameGuj": null,
        "groomNriSecondWitnessMiddlNameGuj": null,
        "groomNriSecondWitnessLastNameGuj": null,
        "groomNriSecondWitnessAddress": null,
        "groomNriSecondWitnessAddressGuj": null,
        "groomNriSecondWitnessBirthDate": null,
        "brideNriFirstWitnessFirstName": null,
        "brideNriFirstWitnessMiddlName": null,
        "brideNriFirstWitnessLastName": null,
        "brideNriFirstWitnessFirstNameGuj": null,
        "brideNriFirstWitnessMiddlNameGuj": null,
        "brideNriFirstWitnessLastNameGuj": null,
        "brideNriFirstWitnessAddress": null,
        "brideNriFirstWitnessAddressGuj": null,
        "brideNriFirstWitnessBirthDate": null,
        "brideNriSecondWitnessFirstName": null,
        "brideNriSecondWitnessMiddlName": null,
        "brideNriSecondWitnessLastName": null,
        "brideNriSecondWitnessFirstNameGuj": null,
        "brideNriSecondWitnessMiddlNameGuj": null,
        "brideNriSecondWitnessLastNameGuj": null,
        "brideNriSecondWitnessAddress": null,
        "brideNriSecondWitnessAddressGuj": null,
        "brideNriSecondWitnessBirthDate": null,
        "serviceType": "MARRIAGE_REGISTRATION",
        "serviceName": null,
        "fileNumber": null,
        "outwardNo": null,
        "agree": false,
        "paymentStatus": null,
        "canEdit": true,
        "canDelete": true,
        "canSubmit": true,
        "firstName": "SHAN",
        "middleName": null,
        "lastName": "SANGEWAR",
        "aadhaarNo": null,
        "contactNo": "9673475273",
        "email": "shantanu.sangewar@nascentinfo.com",
    };

    translateKey: string = 'marriageRegScreen';
    marriageFormGroup: FormGroup;

    // Select id for edit marriage form
    formId: number;
    apiCode: string;
    tabIndex: number = 0;

    // Lookups array list
    religionArray: any = [];
    // maritalstatusArray: any = [];
    maritalStatusArray: any = [];
    applicantrelationArray: any = [];
    identityproofArray: any = [];

    // Marriage date 
    disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
    adultPerson = moment().subtract(18, 'year').format("YYYY-MM-DD");
    groomagecalendar = moment().subtract(21, 'year').format("YYYY-MM-DD");
    brideagecalender = moment().subtract(18, 'year').format("YYYY-MM-DD");

    //Groom age
    groomage: number = 0;
    groomdays: number = 0;

    // Bride age
    brideage: number = null;
    bridedays: number = null;

    public showButtons: boolean = false;

    //for same address
    addObject: any = {
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
     * Using Common Configuration
     */
    config: CertificateConfig = new CertificateConfig();

    listMessage: Array<string> = [
        "BIRTH CERTIFICATE OR SCHOOL LEAVING CERTIFICATE OF BRIDEGROOM AND BRIDE.",
        "RESIDENT PROOF OF BRIDEGROOM AND BRIDE i.e VALID DRIVING LICENCE/ADHAR CARD/VALID PASSPORT/RATION CARD/ELECTION CARD.",
        "RESIDENT PROOF OF PRIEST i.e VALID DRIVING LICENCE/ADHAR CARD/VALID PASSPORT/RATION CARD/ELECTION CARD.",
        "RESIDENT PROOF OF TWO LOCAL WITNESSES i.e VALID DRIVING LICENCE/ADHAR CARD/VALID PASSPORT/RATION CARD/ELECTION CARD",
        "INVITATION CARD/ AFFIDAVIT (MARRIAGE PLACE AND DATE MUST BE MENTIONED ) AND WEDDING PHOTO",
        "FORM TO BE FILLED IN DUPLICATE WITH BLACK PEN OR TYPE ONLY",
        "AGREEMENT STAMPS OF RS.200/- (100+100 EACH)",
        "VALID DIVORCE PAPER / DEATH CERTIFICATE IF APPLICABLE",
        "BRIDEGROOM , BRIDE AND TWO LOCAL WITNESSES MUST BE PRESENT IN PERSON AT MARRIAGE REGISTRATION OFFICE DURING WORKING HOURS I.E 10.30 AM TO 3.00 P.M (2.00 P.M TO 2.30 P.M LUNCH HOURS )",
        "TIME TO COLLECT CERTIFICATES : 11.00 AM TO 4.00 P.M (2.00 P.M TO 2.30 PM LUNCH HOURS )",
        "ALL DOCUMENTS MUST BE ATTESTED BY GAZETTED OFFICE OR BY NOTARY PUBLIC.",
        "PL. NOTE THAT MARRIAGE MUST BE SOLEMNISED IN VADODARA CITY LIMIT."
    ];

    moreListMsg: Array<string> = [
        "VALID PASSPORT",
        "VALID DRIVING LICENCE OR ADDRESS PROOF",
        "SOCIAL SECURITY CARD/ NATIONAL INSURANCE CARD/ NATIONAL HEALTH CARD OR AS THE CASE MAY BE",
        "EMPLOYERS I.D. PROOF / SALARY SLIP OR ANY OTHER DOCUMENT FOR EMPLOYMENT.",
        "RESIDENT PROOF OF TWO NRI WITNESSES .( PL.NOTE THAT ONLY PROOF IS REQUIRED)",
        "RESIDENT PROOF OF TWO LOCAL WITNESSES."
    ];

    message: string = `Welcome to Vadodara Municipal Corporation's Virtual Civic Center, which is simple and convenient way for citizens to access various services from anywhere at anytime.
    The services of Virtual Civic Center can be accessed without paying any additional charge.`;

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
        private CD: ChangeDetectorRef,
        public translateService: TranslateService,
        private toster: ToastrService
    ) { }

    /**
    * This method is use for perform initialize time actions.
    */
    ngOnInit() {

        this.route.paramMap.subscribe(param => {
            this.formId = Number(param.get('id'));
            this.apiCode = param.get('apiCode');
            this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
        },
            err => {
                this.toster.error(err.error.error_description);
            });

        if (!this.formId) {
            this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
        }
        else {
            this.isGuideLineActive = true;
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
            groomAge: [null, Validators.max(120)],//ValidationService.groomAgeValidator
            groomReligion: this.fb.group({
                code: [null, [Validators.required]],
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
            brideAge: [null],// ValidationService.brideAgeValidator
            brideReligion: this.fb.group({
                code: [null, [Validators.required]],
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
            priestAadharNumber: ['', Validators.maxLength(12)],
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

            //eighth step 63 count
            applicantRelation: this.fb.group({
                code: [null, Validators.required]
            }),
            applicantRelationOther: [''],
            uniqueIdProofLable: this.fb.group({
                code: [null]
            }),
            uniqueIdProof: [''],

            attachments: [''],

            // gujarati field
            groomFirstNameGuj: ['', [Validators.maxLength(150)]],
            groomMiddleNameGuj: ['', [Validators.maxLength(150)]],
            groomLastNameGuj: ['', [Validators.maxLength(150)]],

            brideFirstNameGuj: ['', [Validators.maxLength(150)]],
            brideMiddleNameGuj: ['', [Validators.maxLength(150)]],
            brideLastNameGuj: ['', [Validators.maxLength(150)]],

            groomParentsFirstNameGuj: ['', [Validators.maxLength(150)]],
            groomParentsMiddleNameGuj: ['', [Validators.maxLength(150)]],
            groomParentsLastNameGuj: ['', [Validators.maxLength(150)]],

            brideParentsFirstNameGuj: ['', [Validators.maxLength(150)]],
            brideParentsMiddleNameGuj: ['', [Validators.maxLength(150)]],
            brideParentsLastNameGuj: ['', [Validators.maxLength(150)]],

            priestFirstNameGuj: ['', [Validators.maxLength(150)]],
            priestMiddleNameGuj: ['', [Validators.maxLength(150)]],
            priestLastNameGuj: ['', [Validators.maxLength(150)]],

            firstWitnessFirstNameGuj: ['', [Validators.maxLength(150)]],
            firstWitnessMiddleNameGuj: ['', [Validators.maxLength(150)]],
            firstWitnessLastNameGuj: ['', [Validators.maxLength(150)]],

            secondWitnessFirstNameGuj: ['', [Validators.maxLength(150)]],
            secondWitnessMiddleNameGuj: ['', [Validators.maxLength(150)]],
            secondWitnessLastNameGuj: ['', [Validators.maxLength(150)]],

            // for NRI groom
            isGroomVisa: null,
            groomNriStatus : ['', [Validators.maxLength(50)]],
            groomPassportNumber: [null, [Validators.maxLength(9)]],
            groomCountryName: [''],
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
            brideNriStatus : ['', [Validators.maxLength(50)]],
            bridePassportNumber: ['', [Validators.maxLength(9)]],
            brideCountryName: [''],
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
            nriBrideParentsAddress: ['', [Validators.maxLength(500)]],

            // nri witness
            groomNriFirstWitnessFirstName: [null, Validators.maxLength(50)],
            groomNriFirstWitnessMiddlName: [null, Validators.maxLength(50)],
            groomNriFirstWitnessLastName: [null, Validators.maxLength(50)],
            groomNriFirstWitnessFirstNameGuj: [null, Validators.maxLength(150)],
            groomNriFirstWitnessMiddlNameGuj: [null, Validators.maxLength(150)],
            groomNriFirstWitnessLastNameGuj: [null, Validators.maxLength(150)],
            groomNriFirstWitnessAddress: [null, Validators.maxLength(500)],
            groomNriFirstWitnessAddressGuj: [null, Validators.maxLength(1500)],
            groomNriFirstWitnessBirthDate: [null],

            groomNriSecondWitnessFirstName: [null, Validators.maxLength(50)],
            groomNriSecondWitnessMiddlName: [null, Validators.maxLength(50)],
            groomNriSecondWitnessLastName: [null, Validators.maxLength(50)],
            groomNriSecondWitnessFirstNameGuj: [null, Validators.maxLength(150)],
            groomNriSecondWitnessMiddlNameGuj: [null, Validators.maxLength(150)],
            groomNriSecondWitnessLastNameGuj: [null, Validators.maxLength(150)],
            groomNriSecondWitnessAddress: [null, Validators.maxLength(500)],
            groomNriSecondWitnessAddressGuj: [null, Validators.maxLength(1500)],
            groomNriSecondWitnessBirthDate: [null],

            brideNriFirstWitnessFirstName: [null, Validators.maxLength(50)],
            brideNriFirstWitnessMiddlName: [null, Validators.maxLength(50)],
            brideNriFirstWitnessLastName: [null, Validators.maxLength(50)],
            brideNriFirstWitnessFirstNameGuj: [null, Validators.maxLength(50)],
            brideNriFirstWitnessMiddlNameGuj: [null, Validators.maxLength(50)],
            brideNriFirstWitnessLastNameGuj: [null, Validators.maxLength(50)],
            brideNriFirstWitnessAddress: [null, Validators.maxLength(500)],
            brideNriFirstWitnessAddressGuj: [null, Validators.maxLength(1500)],
            brideNriFirstWitnessBirthDate: [null],

            brideNriSecondWitnessFirstName: [null, Validators.maxLength(50)],
            brideNriSecondWitnessMiddlName: [null, Validators.maxLength(50)],
            brideNriSecondWitnessLastName: [null, Validators.maxLength(50)],
            brideNriSecondWitnessFirstNameGuj: [null, Validators.maxLength(150)],
            brideNriSecondWitnessMiddlNameGuj: [null, Validators.maxLength(150)],
            brideNriSecondWitnessLastNameGuj: [null, Validators.maxLength(150)],
            brideNriSecondWitnessAddress: [null, Validators.maxLength(500)],
            brideNriSecondWitnessAddressGuj: [null, Validators.maxLength(1500)],
            brideNriSecondWitnessBirthDate: [null],

        });

    }

    /**
     * This method is use to patch Value in marriage form
     * @param id : Form Id.
     */
    getFormData(id: number) {

        this.formService.getFormData(id).subscribe(
            res => {

                // res.serviceDetail.serviceUploadDocuments = res.serviceDetail.serviceUploadDocuments.sort((a, b) => {
                //     return Number(a.fieldIdentifier) - Number(b.fieldIdentifier);
                //   });

                res.serviceDetail.serviceUploadDocuments.forEach(app => {
                    (<FormArray>this.marriageFormGroup.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
                });

                this.requiredDocumentList();

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
                this.checkReligion();
                this.showButtons = true;

                //set default value
                // this.marriageFormGroup.get('marriageRegistrationDate').setValue(moment().format('YYYY-MM-DD'));

                //for display static days
                if (res.groomBirthDate != null && res.marriageDate != null) {
                    this.CalculateAge('groomBirthDate');
                }

                //display static gujarati var
                if (!_.isUndefined(res.groomReligion.code)) {
                    this.onChange(res.groomReligion.code, this.religionArray, 'religionGujgroom')
                }

                if (!_.isUndefined(res.brideReligion.code)) {
                    this.onChange(res.brideReligion.code, this.religionArray, 'religionGujbride')
                }

                if (!_.isUndefined(res.marriageTimeGroomStatus.code)) {
                    this.onChange(res.marriageTimeGroomStatus.code, this.maritalStatusArray, 'maritalstatusGujgroom')
                }

                if (!_.isUndefined(res.marriageTimeGroomStatus.code)) {
                    this.onChange(res.marriageTimeGroomStatus.code, this.maritalStatusArray, 'maritalstatusGujbride')
                }

                if (!_.isUndefined(res.applicantRelation.code)) {
                    this.onChange(res.applicantRelation.code, this.applicantrelationArray, 'applicantrelationGuj')
                }
                if (!_.isUndefined(res.uniqueIdProofLable.code)) {
                    this.onChange(res.uniqueIdProofLable.code, this.identityproofArray, 'identityproofGuj')
                }

                if (!this.marriageFormGroup.controls.canEdit.value) {
                    this.marriageFormGroup.disable();
                }

                let groomVisa = this.marriageFormGroup.get("isGroomVisa").value;
                if (groomVisa == null) {
                    this.marriageFormGroup.get("isGroomVisa").setValue(false);
                }

            },
            err => {
                this.toster.error(err.error.error_description);
                // console.log("get fail" + err);
            }
        );


    }

    ngOnChanges() {
        this.CD.detectChanges();
    }

    /**
     * This method is loaded lookups array.
     */
    getLookupsData() {
        this.formService.getDataFromLookups().subscribe(res => {
            this.religionArray = res.RELIGION;
            this.maritalStatusArray = res.MARITAL_STATUS;
            this.applicantrelationArray = res.MARRIAGE_APPLICANT_RELATION;
            this.identityproofArray = res.MARRIAGE_ID_PROOFS;

        },
            err => {
                this.toster.error(err.error.error_description);
            });
    }

    // findValueoflookup(lookupArray: Array<any>, resCode: string) {
    //     return _.result(_.find(lookupArray, function (obj) {
    //         return obj.code === resCode;
    //     }), 'code');
    // }
    /**
     * This method is change date formate.
     * @param date : Input date(any format).
     * @param controlType : Input From Control.
     */
    dateFormate(date, controlType: string) {
        if (date) {
            this.marriageFormGroup.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
        }
    }

    /**
     * Method is used for testing only
     */
    patchValue() {
        this.marriageFormGroup.patchValue(this.dummyJSON);
    }

    /**
     * This method is calculate groom and bride age.
     */
    CalculateAge(controType: string) {
        if (controType) {

            let marriagedate = this.marriageFormGroup.get("marriageDate").value;

            if (marriagedate) {
                // if (marriagedate == null) {
                //     this.commonService.openAlert("Warning", "Please select Date of Marriage", "warning");
                // }

                //display days and years
                let mday = moment(this.marriageFormGroup.get("marriageDate").value, "YYYY-MM-DD");

                if (this.marriageFormGroup.get("groomBirthDate").value) {
                    let bday = moment(this.marriageFormGroup.get("groomBirthDate").value, "YYYY-MM-DD");
                    this.groomage = mday.diff(bday, 'years', false);
                    this.groomdays = mday.diff(bday.add(this.groomage, 'years'), 'days', false);

                    this.marriageFormGroup.get("groomAge").setValue(this.groomage);
                }

                if (this.marriageFormGroup.get("brideBirthDate").value) {
                    let bday = moment(this.marriageFormGroup.get("brideBirthDate").value, "YYYY-MM-DD");
                    this.brideage = mday.diff(bday, 'years', false);
                    this.bridedays = mday.diff(bday.add(this.brideage, 'years'), 'days', false);

                    this.marriageFormGroup.get("brideAge").setValue(this.brideage);
                }
            } else {
                this.touchedField('marriageDate');
                this.commonService.openAlert("Warning", "Please select Date of Marriage", "warning");
                this.marriageFormGroup.get("groomAge").setValue(null);
                this.marriageFormGroup.get("brideAge").setValue(null);
                this.groomage = null;
                this.groomdays = null;
                this.brideage = null;
                this.bridedays = null;
            }
        }
    }


    /**
     * This Method is set Datepicker when marriage date selected.
     */
    birthCalendar() {
        let marriagedate = this.marriageFormGroup.get("marriageDate").value;

        // this is year of Child marriage prevent
        let yearOfBalVivah = moment(new Date(1978, 9, 1)).format('YYYY-MM-DD');

        if (marriagedate <= yearOfBalVivah) {
            this.groomagecalendar = moment(marriagedate).subtract(18, 'year').format("YYYY-MM-DD");
            this.brideagecalender = moment(marriagedate).subtract(15, 'year').format("YYYY-MM-DD");
        }
        else {
            this.groomagecalendar = moment(marriagedate).subtract(21, 'year').format("YYYY-MM-DD");
            this.brideagecalender = moment(marriagedate).subtract(18, 'year').format("YYYY-MM-DD");
        }
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
        // nri witness fields
        if (this.marriageFormGroup.get('isGroomVisa').value) {
            this.nriWitenessFields('groom');
            this.changeReflection('groom');
        }
        if (this.marriageFormGroup.get('isBrideVisa').value) {
            this.nriWitenessFields('bride');
            this.changeReflection('bride');
        }

        this.marriageFormGroup.get('isGroomVisa').setValue(false);
        this.marriageFormGroup.get('isBrideVisa').setValue(false);

        this.marriageFormGroup.get('groomParentsAddress').reset();
        this.marriageFormGroup.get('groomParentsAddressResidence').reset();

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
        this.marriageFormGroup.get(`${person}CountryName`).reset();
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

        // convert uppercase
        let getName = this.capitalizeFirstLetter(person);
        this.marriageFormGroup.get(`nri${getName}Address`).reset();
        this.marriageFormGroup.get(`nri${getName}ParentsAddress`).reset();

        if (this.marriageFormGroup.get(`is${getName}Visa`).value) {

            this.marriageFormGroup.get(`${person}PassportNumber`).setValidators([Validators.required, Validators.maxLength(9)]);
            this.marriageFormGroup.get(`${person}CountryName`).setValidators(Validators.required);
            this.marriageFormGroup.get(`${person}VisaNumber`).setValidators([Validators.required, Validators.maxLength(9)]);
            this.marriageFormGroup.get(`${person}VisaFrom`).setValidators(Validators.required);
            this.marriageFormGroup.get(`${person}VisaTo`).setValidators(Validators.required);
            this.marriageFormGroup.get(`${person}SocialSecurityNumber`).setValidators([Validators.required, Validators.maxLength(9)]);
            this.marriageFormGroup.get(`${person}Eligibility`).setValidators([Validators.required, Validators.maxLength(50)]);
            this.marriageFormGroup.get(`${person}Designation`).setValidators([Validators.required, Validators.maxLength(50)]);
            this.marriageFormGroup.get(`${person}PhoneNumber`).setValidators([Validators.required, Validators.maxLength(10)]);
            this.marriageFormGroup.get(`${person}Email`).setValidators([Validators.required, Validators.maxLength(50), ValidationService.emailValidator]);
            this.marriageFormGroup.get(`${person}CompanyName`).setValidators([Validators.maxLength(100)]);
            this.marriageFormGroup.get(`${person}CompanyAddress`).setValidators([Validators.maxLength(500)]);
            this.marriageFormGroup.get(`${person}CompanyPhoneNumber`).setValidators([Validators.maxLength(10)]);

            this.marriageFormGroup.get(`nri${getName}Address`).setValidators(Validators.required);
            this.marriageFormGroup.get(`nri${getName}ParentsAddress`).setValidators(Validators.required);
        }
        else {

            this.marriageFormGroup.get(`${person}PassportNumber`).clearValidators();
            this.marriageFormGroup.get(`${person}CountryName`).clearValidators();
            this.marriageFormGroup.get(`${person}VisaNumber`).clearValidators();
            this.marriageFormGroup.get(`${person}VisaFrom`).clearValidators();
            this.marriageFormGroup.get(`${person}VisaTo`).clearValidators();
            this.marriageFormGroup.get(`${person}SocialSecurityNumber`).clearValidators();
            this.marriageFormGroup.get(`${person}Eligibility`).clearValidators();
            this.marriageFormGroup.get(`${person}Designation`).clearValidators();
            this.marriageFormGroup.get(`${person}PhoneNumber`).clearValidators();
            this.marriageFormGroup.get(`${person}Email`).clearValidators();
            this.marriageFormGroup.get(`${person}CompanyName`).clearValidators();
            this.marriageFormGroup.get(`${person}CompanyAddress`).clearValidators();
            this.marriageFormGroup.get(`${person}CompanyPhoneNumber`).clearValidators();

            this.marriageFormGroup.get(`nri${getName}Address`).clearValidators();
            this.marriageFormGroup.get(`nri${getName}ParentsAddress`).clearValidators();
        }
        this.marriageFormGroup.get(`${person}CountryName`).updateValueAndValidity();
        this.CD.detectChanges();

    }

    capitalizeFirstLetter(s: string) {
        return s && s[0].toUpperCase() + s.slice(1);
    }
    /**
     * This method is Reset Visa related field.
     * @param person : Groom or Bride (Change Event).
     */
    nriWitenessFields(person: string) {

        this.marriageFormGroup.get(`${person}NriFirstWitnessFirstName`).reset();
        this.marriageFormGroup.get(`${person}NriFirstWitnessMiddlName`).reset();
        this.marriageFormGroup.get(`${person}NriFirstWitnessLastName`).reset();
        this.marriageFormGroup.get(`${person}NriFirstWitnessFirstNameGuj`).reset();
        this.marriageFormGroup.get(`${person}NriFirstWitnessMiddlNameGuj`).reset();
        this.marriageFormGroup.get(`${person}NriFirstWitnessLastNameGuj`).reset();
        this.marriageFormGroup.get(`${person}NriFirstWitnessAddress`).reset();
        this.marriageFormGroup.get(`${person}NriFirstWitnessAddressGuj`).reset();
        this.marriageFormGroup.get(`${person}NriFirstWitnessBirthDate`).setValue('');

        this.marriageFormGroup.get(`${person}NriSecondWitnessFirstName`).reset();
        this.marriageFormGroup.get(`${person}NriSecondWitnessMiddlName`).reset();
        this.marriageFormGroup.get(`${person}NriSecondWitnessLastName`).reset();
        this.marriageFormGroup.get(`${person}NriSecondWitnessFirstNameGuj`).reset();
        this.marriageFormGroup.get(`${person}NriSecondWitnessMiddlNameGuj`).reset();
        this.marriageFormGroup.get(`${person}NriSecondWitnessLastNameGuj`).reset();
        this.marriageFormGroup.get(`${person}NriSecondWitnessAddress`).reset();
        this.marriageFormGroup.get(`${person}NriSecondWitnessAddressGuj`).reset();
        this.marriageFormGroup.get(`${person}NriSecondWitnessBirthDate`).reset();

        // convert uppercase
        let getName = this.capitalizeFirstLetter(person);
        this.marriageFormGroup.get(`nri${getName}Address`).reset();

        if (this.marriageFormGroup.get(`is${getName}Visa`).value) {

            this.marriageFormGroup.get(`${person}NriFirstWitnessFirstName`).setValidators([Validators.required, Validators.maxLength(50)]);
            this.marriageFormGroup.get(`${person}NriFirstWitnessLastName`).setValidators([Validators.required, Validators.maxLength(50)]);
            this.marriageFormGroup.get(`${person}NriFirstWitnessAddress`).setValidators([Validators.required, Validators.maxLength(500)]);
            this.marriageFormGroup.get(`${person}NriFirstWitnessBirthDate`).setValidators(Validators.required);

            this.marriageFormGroup.get(`${person}NriSecondWitnessFirstName`).setValidators([Validators.required, Validators.maxLength(50)]);
            this.marriageFormGroup.get(`${person}NriSecondWitnessLastName`).setValidators([Validators.required, Validators.maxLength(50)]);
            this.marriageFormGroup.get(`${person}NriSecondWitnessAddress`).setValidators([Validators.required, Validators.maxLength(500)]);
            this.marriageFormGroup.get(`${person}NriSecondWitnessBirthDate`).setValidators(Validators.required);

        }
        else {

            this.marriageFormGroup.get(`${person}NriFirstWitnessFirstName`).clearValidators();
            this.marriageFormGroup.get(`${person}NriFirstWitnessLastName`).clearValidators();
            this.marriageFormGroup.get(`${person}NriFirstWitnessAddress`).clearValidators();
            this.marriageFormGroup.get(`${person}NriFirstWitnessBirthDate`).clearValidators();

            this.marriageFormGroup.get(`${person}NriSecondWitnessFirstName`).clearValidators();
            this.marriageFormGroup.get(`${person}NriSecondWitnessLastName`).clearValidators();
            this.marriageFormGroup.get(`${person}NriSecondWitnessAddress`).clearValidators();
            this.marriageFormGroup.get(`${person}NriSecondWitnessBirthDate`).clearValidators();

        }
        // this.marriageFormGroup.get(`${person}Country`).updateValueAndValidity();
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
        if (!_.isUndefined(this.getGujValue(lookupArray, event))) {
            this[varName] = this.getGujValue(lookupArray, event);
        } else {
            this[varName] = null;
        }
    }

    /**
     * This method is remove gujarati static variable. 
     * @param varName : Static Variable.
     */
    removeGuj(varName: string) {
        this[varName] = '';
    }

    listOfDependentAtt: any = [];
	/**
	 * Method is create required document array
	 */
    requiredDocumentList() {

        this.uploadFilesArray = [];

        let organizationCategory = this.marriageFormGroup.get('groomReligion').value.code;
        let groomVisa = this.marriageFormGroup.get("isGroomVisa").value;
        let brideVisa = this.marriageFormGroup.get('isBrideVisa').value;
        this.listOfDependentAtt = [];
        this.listOfDependentAtt.push(organizationCategory);
        this.listOfDependentAtt.push(groomVisa);
        this.listOfDependentAtt.push(brideVisa);
        // let sortedArray:any = this.marriageFormGroup.get('serviceDetail').get('serviceUploadDocuments').value;
        // this.marriageFormGroup.get('serviceDetail').get('serviceUploadDocuments'). = sortedArray;
        if (organizationCategory && groomVisa && brideVisa) {
            _.forEach(this.marriageFormGroup.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {

                if (value.dependentFieldName == null && value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
                    this.uploadFilesArray.push({
                        'labelName': value.documentLabelEn,
                        'fieldIdentifier': value.fieldIdentifier,
                        'documentIdentifier': value.documentIdentifier
                    })
                }
                if (value.dependentFieldName) {
                    let listofFields = value.dependentFieldName;
                    if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
                        this.uploadFilesArray.push({
                            'labelName': value.documentLabelEn,
                            'fieldIdentifier': value.fieldIdentifier,
                            'documentIdentifier': value.documentIdentifier
                        })
                    }
                }

            });
        }
        // let groomreligionChange = this.marriageFormGroup.controls.groomReligion.get("code").value;
        // let bridereligionChange = this.marriageFormGroup.controls.brideReligion.get("code").value;

        // let groomVisa = this.marriageFormGroup.get("isGroomVisa").value;
        // if (groomVisa == null) {
        //     this.marriageFormGroup.get("isGroomVisa").setValue(false);
        // }
        // let brideVisa = this.marriageFormGroup.get('isBrideVisa').value;
        // if (brideVisa == null) {
        //     this.marriageFormGroup.get("isBrideVisa").setValue(false);
        // }
        // debugger;
        // if (!_.isEmpty(groomreligionChange) && !_.isEmpty(bridereligionChange)) {

        //     _.forEach(this.marriageFormGroup.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {

        //         if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
        //             this.uploadFilesArray.push({
        //                 'labelName': value.documentLabelEn,
        //                 'fieldIdentifier': value.fieldIdentifier,
        //                 'documentIdentifier': value.documentIdentifier
        //             })
        //             if (value.dependentFieldName == 'HINDU') {
        //                 let indexone = _.findIndex(this.uploadFilesArray, function (indexfind) { return indexfind.dependentFieldName == 'HINDU'; });
        //                 console.log(indexone);
        //                 this.uploadFilesArray.splice(indexone, 1);
        //                 console.log(this.uploadFilesArray);
        //             }

        //             // if (bridereligionChange != 'HINDU' && groomreligionChange != 'HINDU') {
        //             //     if (value.dependentFieldName != null) {
        //             //         this.uploadFilesArray.push({
        //             //             'labelName': value.documentLabelEn,
        //             //             'fieldIdentifier': value.fieldIdentifier,
        //             //             'documentIdentifier': value.documentIdentifier
        //             //         })
        //             //     }
        //             // } else if (bridereligionChange == 'HINDU' && groomreligionChange == 'HINDU') {

        //             //     if (value.dependentFieldName == null) {
        //             //         this.uploadFilesArray.push({
        //             //             'labelName': value.documentLabelEn,
        //             //             'fieldIdentifier': value.fieldIdentifier,
        //             //             'documentIdentifier': value.documentIdentifier
        //             //         })
        //             //     }
        //             // }

        //             // if (groomVisa && value.dependentFieldName == 'isGroomVisa') {
        //             //     debugger;
        //             //     if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
        //             //         this.uploadFilesArray.push({
        //             //             'labelName': value.documentLabelEn,
        //             //             'fieldIdentifier': value.fieldIdentifier,
        //             //             'documentIdentifier': value.documentIdentifier
        //             //         })
        //             //     }
        //             // }

        //         }

        //     });
        // }
        // else {
        //     this.config.requiredDocumentList(this.marriageFormGroup, this.uploadFilesArray);
        // }
    }


    onChangeVisaStatus() {
        this.requiredDocumentList();
    }

    /**
     * This method is check religion is same or not.
     */
    checkReligion() {
        //check religion is same or not    
        let groomreligionChange = this.marriageFormGroup.controls.groomReligion.get("code").value;
        let bridereligionChange = this.marriageFormGroup.controls.brideReligion.get("code").value;
        this.requiredDocumentList();

        if (!_.isEmpty(groomreligionChange) && !_.isEmpty(bridereligionChange)) {
            if (bridereligionChange != groomreligionChange) {
                this.commonService.openAlert("Warning", "Bride Groom and Bride religion must be same. Your Marriage has to be Registered under Special Marriage Act. Kindly contact office of Special Marriage Registration at Kuber Bhavan, Kothi char Rasta, Vadodara", "warning");
            }
            else {
                // if (bridereligionChange != 'HINDU' && bridereligionChange == groomreligionChange) {

                //     _.forEach(this.marriageFormGroup.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
                //         if (value.documentIdentifier == 'PRIEST_PROOF' && value.isActive && value.requiredOnCitizenPortal) {
                //             this.uploadFilesArray.push({
                //                 'labelName': value.documentLabelEn,
                //                 'fieldIdentifier': value.fieldIdentifier,
                //                 'documentIdentifier': value.documentIdentifier
                //             })
                //         }
                //     });
                // }
                // else {
                //     _.forEach(this.marriageFormGroup.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
                //         if (value.documentIdentifier == 'PRIEST_PROOF' && value.isActive && value.requiredOnCitizenPortal) {
                //             this.uploadFilesArray.splice(10);
                //         }
                //     });
                // }
            }
        }

        // this.config.requiredDocumentList(this.marriageFormGroup, this.uploadFilesArray);
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
        let step8 = 65;
        let step11 = 140;
        debugger;
        if (flag != null) {
            //Check validation for step by step
            let count = flag;
            //second condition for NIR marriage
            if ((count <= step1) || (count >= 90 && count <= 103)) {
                this.tabIndex = 0;
                return false;
            } else if ((count <= step2) || (count >= 103 && count <= 118)) {
                this.tabIndex = 1;
                return false;
            } else if ((count <= step3) || (count == 119)) {
                this.tabIndex = 2;
                return false;
            } else if ((count <= step4) || (count == 120)) {
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
            else if ((count >= 121 && count <= 138) && (this.marriageFormGroup.get('isGroomVisa').value)) {
                this.tabIndex = 7;
                return false;
            }
            else if ((count >= 139 && count <= 156) && (this.marriageFormGroup.get('isBrideVisa').value)) {
                if (!this.marriageFormGroup.get('isGroomVisa').value) {
                    this.tabIndex = 7;
                }
                else {
                    this.tabIndex = 8;
                }
                return false;
            }
            else if (count <= step8) {

                if (this.marriageFormGroup.get('isGroomVisa').value && (this.marriageFormGroup.get('isBrideVisa').value)) {
                    this.tabIndex = 9;
                }
                else if (this.marriageFormGroup.get('isGroomVisa').value || (this.marriageFormGroup.get('isBrideVisa').value)) {
                    this.tabIndex = 8;
                }
                else {
                    this.tabIndex = 7;
                }
                return false;
            }
            else if (count == 67 || count <= step11) {

                this.checkReligion();

                if (this.marriageFormGroup.get('isGroomVisa').value && (this.marriageFormGroup.get('isBrideVisa').value)) {
                    this.tabIndex = 10;
                }
                else if (this.marriageFormGroup.get('isGroomVisa').value || (this.marriageFormGroup.get('isBrideVisa').value)) {
                    this.tabIndex = 9;
                }
                else {
                    this.tabIndex = 8;
                }
            }
            else {

                if (this.marriageFormGroup.get('isGroomVisa').value && (this.marriageFormGroup.get('isBrideVisa').value)) {
                    this.tabIndex = 10;
                }
                else if (this.marriageFormGroup.get('isGroomVisa').value || (this.marriageFormGroup.get('isBrideVisa').value)) {
                    this.tabIndex = 9;
                }
                else {
                    this.tabIndex = 8;
                }
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

    touchedField(formControlName: string) {
        this.marriageFormGroup.get(formControlName).markAsTouched();
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
