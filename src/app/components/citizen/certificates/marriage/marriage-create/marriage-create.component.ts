import { Component, OnInit, ViewChild, OnChanges, ChangeDetectorRef, TemplateRef } from '@angular/core';
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
import { Console } from 'console';
import { AppointmentServices } from '../../../appointment/appointment.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SlotDetails } from '../../../appointment/schedule-appointment/slot-booking/slot-booking.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FireFacilityConfig } from '../../../fire-facilities/config/FireFacilityConfig';
import { LicenseConfiguration } from '../../../licences/license-configuration';


@Component({
    selector: 'app-marriage-create',
    templateUrl: './marriage-create.component.html',
    styleUrls: ['./marriage-create.component.scss']
})

export class MarriageCreateComponent implements OnInit, OnChanges {

    @ViewChild('address') addrComponent: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('templateMyAppointmentModel') templateMyAppointmentModel: TemplateRef<any>;
    @ViewChild(MatSort) sort: MatSort;
    slotDataSource = new MatTableDataSource<SlotDetails>([]);
    fireFacilityConfig: FireFacilityConfig = new FireFacilityConfig();

    //Mandatory attachments Array
    public uploadFilesArray: Array<any> = [];
    public accordingStatusUploadFileArray: Array<any> = [];
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
        "groomNriStatus": null,
        "groomDesignation": null,
        "groomPhoneNumber": null,
        "groomEmail": null,
        "nriGroomAddress": null,
        "groomCompanyName": null,
        "groomCompanyPhoneNumber": null,
        "groomCompanyAddress": null,
        "isBrideVisa": false,
        "bridePassportNumber": null,
        "brideNriStatus": null,
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

    isSearch = false;
    translateKey: string = 'marriageRegScreen';
    marriageFormGroup: FormGroup;
    bridegroomDetails : FormGroup;
    brideDetails : FormGroup;
    fatherOfBridegroom : FormGroup;
    fatherOfBride : FormGroup;
    marriageSolemnizerDetails : FormGroup;
    firstWitnessDetails : FormGroup;
    secondWitnessDetails : FormGroup;
    detailsOfBridegroomNRIWitness : FormGroup;
    detailsOfBrideNRIWitness : FormGroup;
    applicantDetails : FormGroup;
    attachmentDetail : FormGroup;
    appointmentForm: FormGroup;
    formSlotId: string;

    resources: any = [];
    isLoadingResults: boolean = true;
    modalRef: BsModalRef;
    apiType: string;
    /**
    * Minimum start date.
    */
    minDate = moment(new Date()).add(1, 'day').toISOString();

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

    // Map for the formcontrol to tabIndex id;
    public formControlNameToTabIndex = new Map();

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
    isViewMode: boolean;
    gujName: any;
    licenseConfiguration: LicenseConfiguration = new LicenseConfiguration();

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
        private toster: ToastrService,
        private appointmentService: AppointmentServices,
        private modalService: BsModalService
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
            this.controlName();

            //Get form data
            this.getFormData(this.formId);
            //Get lookup array 
            this.getLookupsData();
        }

        this.setFormControlToTabIndexMap();
        this.appointmentService.apiType = 'marriageReg';
        this.getResources();

    }

    /**
    * This method is listed form controls.
    */
    marriageFormControls() {
       
        // first step**
        this.bridegroomDetails = this.fb.group({
            marriageDate: [null, Validators.required],
            marriagePlace: this.fb.group(this.addrComponent.addressControls()),
            groomFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
            groomLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomFirstNameGuj: ['', [Validators.maxLength(150)]],
            groomMiddleNameGuj: ['', [Validators.maxLength(150)]],
            groomLastNameGuj: ['', [Validators.maxLength(150)]],
            groomBirthDate: ['', Validators.required],
            groomAge: [null, Validators.max(120)],//ValidationService.groomAgeValidator
            groomReligion: this.fb.group({
                code: [null, [Validators.required]],
                gujName: [null],
                name: [null]
            }),
            marriageTimeGroomStatus: this.fb.group({
                code: [null, Validators.required]
            }),
            aliveWives: ['', [Validators.maxLength(1), Validators.minLength(0)]],
            groomAadharNumber: ['', Validators.maxLength(12)],
            // for NRI marriage
            isNriMarriage: [false, Validators.required],
            // for NRI groom
            isGroomVisa: null,
            groomNriStatus: ['', [Validators.maxLength(50)]],
            groomPassportNumber: [null, [Validators.maxLength(9)]],
            groomCountryName: [''],
            groomVisaNumber: ['', [Validators.maxLength(9)]],
            groomVisaFrom: [''],
            groomVisaTo: [''],
            groomSocialSecurityNumber: ['', [Validators.maxLength(9)]],
            groomEligibility: ['', [Validators.maxLength(50)]],
            groomDesignation: ['', [Validators.maxLength(50)]],
            groomCompanyName: ['', [Validators.maxLength(100)]],
            groomCompanyPhoneNumber: ['', [Validators.maxLength(10)]],
            groomPhoneNumber: ['', [Validators.maxLength(10)]],
            groomEmail: [''],
            nriGroomAddress: ['', [Validators.maxLength(500)]],
            groomCompanyAddress: ['', [Validators.maxLength(500)]],
            groomAddress: this.fb.group(this.addrComponent.addressControls()),
            groomDays: [null, Validators.max(365)],
        })
        // first end**


        // second step**
        this.brideDetails = this.fb.group({
            brideFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
            brideLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideFirstNameGuj: ['', [Validators.maxLength(150)]],
            brideMiddleNameGuj: ['', [Validators.maxLength(150)]],
            brideLastNameGuj: ['', [Validators.maxLength(150)]],
            brideBirthDate: ['', Validators.required],
            brideAge: [null],// ValidationService.brideAgeValidator
            brideReligion: this.fb.group({
                code: [null, [Validators.required]],
                gujName: [null],
                name: [null]
            }),
            marriageTimeBrideStatus: this.fb.group({
                code: [null, Validators.required]
            }),
            brideAadharNumber: ['', Validators.maxLength(12)],
            // for NRI bride
            isBrideVisa: [false],
            brideNriStatus: ['', [Validators.maxLength(50)]],
            bridePassportNumber: ['', [Validators.maxLength(9)]],
            brideCountryName: [''],
            brideVisaNumber: ['', [Validators.maxLength(9)]],
            brideVisaFrom: [''],
            brideVisaTo: [''],
            brideSocialSecurityNumber: ['', [Validators.maxLength(9)]],
            brideEligibility: ['', [Validators.maxLength(50)]],
            brideDesignation: ['', [Validators.maxLength(50)]],
            bridePhoneNumber: ['', [Validators.maxLength(10)]],
            brideEmail: ['', [Validators.maxLength(50), ValidationService.emailValidator]],
            nriBrideAddress: ['', [Validators.maxLength(500)]],
            brideCompanyName: ['', [Validators.maxLength(100)]],
            brideCompanyPhoneNumber: ['', [Validators.maxLength(10)]],
            brideCompanyAddress: ['', [Validators.maxLength(500)]],
            brideAddress: this.fb.group(this.addrComponent.addressControls()),
            brideDays: [null, Validators.max(365)],
        })
        // second end**

        //third step**
        this.fatherOfBridegroom = this.fb.group({
            groomParentsFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            groomParentsFirstNameGuj: ['', [Validators.maxLength(150)]],
            groomParentsMiddleNameGuj: ['', [Validators.maxLength(150)]],
            groomParentsLastNameGuj: ['', [Validators.maxLength(150)]],
            groomParentsBirthDate: [null],
            groomParentsAge: [null, [Validators.required, Validators.min(18)]],
            groomParentsAadharNumber: ['', Validators.maxLength(12)],
            isParentsAddressSameAsGroomAddress: this.fb.group({
                code: [null]
            }),
            nriGroomParentsAddress: ['', [Validators.maxLength(500)]],
            groomParentsAddress: this.fb.group(this.addrComponent.addressControls()),
            groomParentsAddressResidence: this.fb.group(this.addrComponent.addressControls()),
            isGroomParResAddressSame: this.fb.group({
                code: [null]
            }),
        })
        //third end**

        //forth step **
        this.fatherOfBride = this.fb.group({
            brideParentsFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            brideParentsFirstNameGuj: ['', [Validators.maxLength(150)]],
            brideParentsMiddleNameGuj: ['', [Validators.maxLength(150)]],
            brideParentsLastNameGuj: ['', [Validators.maxLength(150)]],
            brideParentsBirthDate: [null],
            brideParentsAge: [null, [Validators.required, Validators.min(18)]],
            brideParentsAadharNumber: ['', Validators.maxLength(12)],
            isParentsAddressSameAsBrideAddress: this.fb.group({
                code: [null]
            }),
            nriBrideParentsAddress: ['', [Validators.maxLength(500)]],
            brideParentsAddress: this.fb.group(this.addrComponent.addressControls()),
            brideParentsAddressResidence: this.fb.group(this.addrComponent.addressControls()),
            isBrideParResAddressSame: this.fb.group({
                code: [null]
            }),
        })
        //forth end**

        //Fifth step**
        this.marriageSolemnizerDetails = this.fb.group({
            priestFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            priestMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
            priestLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            // gujarati field
            priestFirstNameGuj: ['', [Validators.maxLength(150)]],
            priestMiddleNameGuj: ['', [Validators.maxLength(150)]],
            priestLastNameGuj: ['', [Validators.maxLength(150)]],
            priestBirthDate: [null],
            priestAge: [null, [Validators.required, Validators.min(18)]],
            priestAadharNumber: ['', Validators.maxLength(12)],
            priestAddress: this.fb.group(this.addrComponent.addressControls()),
            priestAddressResidence: this.fb.group(this.addrComponent.addressControls()),
            isPriestParResAddressSame: this.fb.group({
                code: [null]
            }),
        })
        //Fifth end**

        //sixth step**
        this.firstWitnessDetails = this.fb.group({
            firstWitnessFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            firstWitnessFirstNameGuj: ['', [Validators.maxLength(150)]],
            firstWitnessMiddleNameGuj: ['', [Validators.maxLength(150)]],
            firstWitnessLastNameGuj: ['', [Validators.maxLength(150)]],
            firstWitnessBirthDate: [null],
            firstWitnessAge: [null, [Validators.required, Validators.min(18)]],
            firstWitnessAadharNumber: ['', Validators.maxLength(12)],
            firstWitnessAddress: this.fb.group(this.addrComponent.addressControls()),
        })
        //sixth end**

        //seventh step**
        this.secondWitnessDetails = this.fb.group({
            secondWitnessFirstName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessMiddleName: ['', [ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessLastName: ['', [Validators.required, ValidationService.nameValidator, Validators.maxLength(50)]],
            secondWitnessFirstNameGuj: ['', [Validators.maxLength(150)]],
            secondWitnessMiddleNameGuj: ['', [Validators.maxLength(150)]],
            secondWitnessLastNameGuj: ['', [Validators.maxLength(150)]],
            secondWitnessBirthDate: [null],
            secondWitnessAge: [null, [Validators.required, Validators.min(18)]],
            secondWitnessAadharNumber: ['', Validators.maxLength(12)],
            secondWitnessAddress: this.fb.group(this.addrComponent.addressControls()),
        })
        //seventh end**

        //eighth start**
        this.detailsOfBridegroomNRIWitness = this.fb.group({
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
            groomNriSecondWitnessAge: [null],
            groomNriFirstWitnessAge: [null],
        })
        //eighth end**


        this.detailsOfBrideNRIWitness = this.fb.group({
            brideNriFirstWitnessFirstName: [null, Validators.maxLength(50)],
            brideNriFirstWitnessMiddlName: [null, Validators.maxLength(50)],
            brideNriFirstWitnessLastName: [null, Validators.maxLength(50)],
            brideNriFirstWitnessFirstNameGuj: [null, Validators.maxLength(50)],
            brideNriFirstWitnessMiddlNameGuj: [null, Validators.maxLength(50)],
            brideNriFirstWitnessLastNameGuj: [null, Validators.maxLength(50)],
            brideNriFirstWitnessAddress: [null, Validators.maxLength(500)],
            brideNriFirstWitnessAddressGuj: [null, Validators.maxLength(1500)],
            brideNriFirstWitnessBirthDate: [null],
            brideNriFirstWitnessAge: [null],
            brideNriSecondWitnessFirstName: [null, Validators.maxLength(50)],
            brideNriSecondWitnessMiddlName: [null, Validators.maxLength(50)],
            brideNriSecondWitnessLastName: [null, Validators.maxLength(50)],
            brideNriSecondWitnessFirstNameGuj: [null, Validators.maxLength(150)],
            brideNriSecondWitnessMiddlNameGuj: [null, Validators.maxLength(150)],
            brideNriSecondWitnessLastNameGuj: [null, Validators.maxLength(150)],
            brideNriSecondWitnessAddress: [null, Validators.maxLength(500)],
            brideNriSecondWitnessAddressGuj: [null, Validators.maxLength(1500)],
            brideNriSecondWitnessBirthDate: [null],
            brideNriSecondWitnessAge: [null],
        })

        //ten start**
        this.applicantDetails = this.fb.group({
            applicantRelation: this.fb.group({
                code: [null, Validators.required]
            }),
            applicantRelationOther: [''],
        })
        //ten end**

        this.attachmentDetail = this.fb.group({
            attachments: []
        })


        this.marriageFormGroup = this.fb.group({
            // extra's important controls 
            apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
            serviceCode: null,
            applicantAadharNumber: [''],
            applicantEmail: [''],
            // marriageRegistrationDate: [''],
            //eighth step 63 count
            uniqueIdProofLable: this.fb.group({
                code: [null]
            }),
            uniqueIdProof: [''],
            attachments: [''],
        });

        this.commonService.createCloneAbstractControl(this.bridegroomDetails, this.marriageFormGroup)
        this.commonService.createCloneAbstractControl(this.brideDetails, this.marriageFormGroup)
        this.commonService.createCloneAbstractControl(this.fatherOfBridegroom, this.marriageFormGroup)
        this.commonService.createCloneAbstractControl(this.fatherOfBride, this.marriageFormGroup)
        this.commonService.createCloneAbstractControl(this.marriageSolemnizerDetails, this.marriageFormGroup)
        this.commonService.createCloneAbstractControl(this.firstWitnessDetails, this.marriageFormGroup)
        this.commonService.createCloneAbstractControl(this.secondWitnessDetails, this.marriageFormGroup)
        this.commonService.createCloneAbstractControl(this.detailsOfBridegroomNRIWitness, this.marriageFormGroup)
        this.commonService.createCloneAbstractControl(this.detailsOfBrideNRIWitness, this.marriageFormGroup) 
        this.commonService.createCloneAbstractControl(this.applicantDetails, this.marriageFormGroup)
        this.commonService.createCloneAbstractControl(this.attachmentDetail, this.marriageFormGroup)
    }

    controlName() {
        this.appointmentForm = this.fb.group({
            resources: this.fb.group({
                code: [null, Validators.required],
                id: null,
                name: null
            }),
            appointmentdate: [null, Validators.required]
        })
    }

    setFormControlToTabIndexMap() {
        //step one tab index
        this.formControlNameToTabIndex.set('marriageDate', 0);
        this.formControlNameToTabIndex.set('isNriMarriage', 0);
        this.formControlNameToTabIndex.set('groomFirstName', 0);
        this.formControlNameToTabIndex.set('groomMiddleName', 0);
        this.formControlNameToTabIndex.set('groomLastName', 0);
        this.formControlNameToTabIndex.set('groomBirthDate', 0);
        this.formControlNameToTabIndex.set('groomAge', 0);
        this.formControlNameToTabIndex.set('groomReligion', 0);
        this.formControlNameToTabIndex.set('groomAadharNumber', 0);
        this.formControlNameToTabIndex.set('marriageTimeGroomStatus', 0);
        this.formControlNameToTabIndex.set('groomFirstNameGuj', 0);
        this.formControlNameToTabIndex.set('groomMiddleNameGuj', 0);
        this.formControlNameToTabIndex.set('groomLastNameGuj', 0);
        // for NRI groom
        this.formControlNameToTabIndex.set('groomNriStatus', 0);
        this.formControlNameToTabIndex.set('groomPassportNumber', 0);
        this.formControlNameToTabIndex.set('groomVisaNumber', 0);
        this.formControlNameToTabIndex.set('groomSocialSecurityNumber', 0);
        this.formControlNameToTabIndex.set('groomEligibility', 0);
        this.formControlNameToTabIndex.set('groomDesignation', 0);
        this.formControlNameToTabIndex.set('groomPhoneNumber', 0);
        this.formControlNameToTabIndex.set('groomEmail', 0);
        this.formControlNameToTabIndex.set('nriGroomAddress', 0);
        this.formControlNameToTabIndex.set('groomCompanyName', 0);
        this.formControlNameToTabIndex.set('groomCompanyPhoneNumber', 0);
        this.formControlNameToTabIndex.set('groomCompanyAddress', 0);
        this.formControlNameToTabIndex.set('marriagePlace', 0);
        this.formControlNameToTabIndex.set('aliveWives', 0);
        this.formControlNameToTabIndex.set('groomCountryName', 0);
        this.formControlNameToTabIndex.set('groomVisaFrom', 0);
        this.formControlNameToTabIndex.set('groomVisaTo', 0);



        //step two tab index
        this.formControlNameToTabIndex.set('brideFirstName', 1);
        this.formControlNameToTabIndex.set('brideMiddleName', 1);
        this.formControlNameToTabIndex.set('brideLastName', 1);
        this.formControlNameToTabIndex.set('brideBirthDate', 1);
        this.formControlNameToTabIndex.set('brideReligion', 1);
        this.formControlNameToTabIndex.set('brideAadharNumber', 1);
        this.formControlNameToTabIndex.set('marriageTimeBrideStatus', 1);
        this.formControlNameToTabIndex.set('brideFirstNameGuj', 1);
        this.formControlNameToTabIndex.set('brideMiddleNameGuj', 1);
        this.formControlNameToTabIndex.set('brideLastNameGuj', 1);
        // for NRI bride
        this.formControlNameToTabIndex.set('brideNriStatus', 1);
        this.formControlNameToTabIndex.set('bridePassportNumber', 1);
        this.formControlNameToTabIndex.set('brideSocialSecurityNumber', 1);
        this.formControlNameToTabIndex.set('brideEligibility', 1);
        this.formControlNameToTabIndex.set('brideEmail', 1);
        this.formControlNameToTabIndex.set('bridePhoneNumber', 1);
        this.formControlNameToTabIndex.set('nriBrideAddress', 1);
        this.formControlNameToTabIndex.set('brideCompanyName', 1);
        this.formControlNameToTabIndex.set('brideCompanyPhoneNumber', 1);
        this.formControlNameToTabIndex.set('brideCompanyAddress', 1);
        this.formControlNameToTabIndex.set('brideVisaNumber', 1);
        this.formControlNameToTabIndex.set('brideCountryName', 1);
        this.formControlNameToTabIndex.set('brideVisaFrom', 1);
        this.formControlNameToTabIndex.set('brideVisaTo', 1);
        this.formControlNameToTabIndex.set('brideDesignation', 1);
        this.formControlNameToTabIndex.set('brideAddress', 1);


        //step three tab index
        this.formControlNameToTabIndex.set('groomParentsFirstName', 2);
        this.formControlNameToTabIndex.set('groomParentsMiddleName', 2);
        this.formControlNameToTabIndex.set('groomParentsLastName', 2);
        this.formControlNameToTabIndex.set('groomParentsBirthDate', 2);
        this.formControlNameToTabIndex.set('groomParentsAge', 2);
        this.formControlNameToTabIndex.set('groomParentsAadharNumber', 2);
        this.formControlNameToTabIndex.set('groomParentsFirstNameGuj', 2);
        this.formControlNameToTabIndex.set('groomParentsMiddleNameGuj', 2);
        this.formControlNameToTabIndex.set('groomParentsLastNameGuj', 2);
        this.formControlNameToTabIndex.set('nriGroomParentsAddress', 2);
        this.formControlNameToTabIndex.set('groomParentsAddress', 2);
        this.formControlNameToTabIndex.set('groomParentsAddressResidence', 2);

        //step four tab index
        this.formControlNameToTabIndex.set('brideParentsFirstName', 3);
        this.formControlNameToTabIndex.set('brideParentsMiddleName', 3);
        this.formControlNameToTabIndex.set('brideParentsLastName', 3);
        this.formControlNameToTabIndex.set('brideParentsBirthDate', 3);
        this.formControlNameToTabIndex.set('brideParentsAge', 3);
        this.formControlNameToTabIndex.set('brideParentsAadharNumber', 3);
        this.formControlNameToTabIndex.set('brideParentsFirstNameGuj', 3);
        this.formControlNameToTabIndex.set('brideParentsMiddleNameGuj', 3);
        this.formControlNameToTabIndex.set('brideParentsLastNameGuj', 3);
        this.formControlNameToTabIndex.set('nriBrideParentsAddress', 3);
        this.formControlNameToTabIndex.set('brideParentsAddress', 3);
        this.formControlNameToTabIndex.set('brideParentsAddressResidence', 3);


        //step five tab index 
        this.formControlNameToTabIndex.set('priestFirstName', 4);
        this.formControlNameToTabIndex.set('priestMiddleName', 4);
        this.formControlNameToTabIndex.set('priestLastName', 4);
        this.formControlNameToTabIndex.set('priestBirthDate', 4);
        this.formControlNameToTabIndex.set('priestAge', 4);
        this.formControlNameToTabIndex.set('priestAadharNumber', 4);
        this.formControlNameToTabIndex.set('priestFirstNameGuj', 4);
        this.formControlNameToTabIndex.set('priestMiddleNameGuj', 4);
        this.formControlNameToTabIndex.set('priestLastNameGuj', 4);
        this.formControlNameToTabIndex.set('priestAddress', 4);
        this.formControlNameToTabIndex.set('priestAddressResidence', 4);
        // nri witness  

        //step six tab index 
        this.formControlNameToTabIndex.set('firstWitnessFirstName', 5);
        this.formControlNameToTabIndex.set('firstWitnessMiddleName', 5);
        this.formControlNameToTabIndex.set('firstWitnessLastName', 5);
        this.formControlNameToTabIndex.set('firstWitnessBirthDate', 5);
        this.formControlNameToTabIndex.set('firstWitnessBirthDate', 5);
        this.formControlNameToTabIndex.set('firstWitnessAge', 5);
        this.formControlNameToTabIndex.set('firstWitnessFirstNameGuj', 5);
        this.formControlNameToTabIndex.set('firstWitnessMiddleNameGuj', 5);
        this.formControlNameToTabIndex.set('firstWitnessLastNameGuj', 5);
        this.formControlNameToTabIndex.set('firstWitnessAddress', 5);

        //step seven tab index 
        this.formControlNameToTabIndex.set('secondWitnessFirstName', 6);
        this.formControlNameToTabIndex.set('secondWitnessMiddleName', 6);
        this.formControlNameToTabIndex.set('secondWitnessLastName', 6);
        this.formControlNameToTabIndex.set('secondWitnessBirthDate', 6);
        this.formControlNameToTabIndex.set('secondWitnessAge', 6);
        this.formControlNameToTabIndex.set('secondWitnessAadharNumber', 6);
        this.formControlNameToTabIndex.set('secondWitnessFirstNameGuj', 6);
        this.formControlNameToTabIndex.set('secondWitnessMiddleNameGuj', 6);
        this.formControlNameToTabIndex.set('secondWitnessLastNameGuj', 6);
        this.formControlNameToTabIndex.set('secondWitnessAddress', 6);

        //step eight tab index 
        this.formControlNameToTabIndex.set('groomNriFirstWitnessFirstName', 7);
        this.formControlNameToTabIndex.set('groomNriFirstWitnessMiddlName', 7);
        this.formControlNameToTabIndex.set('groomNriFirstWitnessLastName', 7);
        this.formControlNameToTabIndex.set('groomNriFirstWitnessFirstNameGuj', 7);
        this.formControlNameToTabIndex.set('groomNriFirstWitnessMiddlNameGuj', 7);
        this.formControlNameToTabIndex.set('groomNriFirstWitnessLastNameGuj', 7);
        this.formControlNameToTabIndex.set('groomNriFirstWitnessAddress', 7);
        this.formControlNameToTabIndex.set('groomNriFirstWitnessAddressGuj', 7);
        this.formControlNameToTabIndex.set('groomNriFirstWitnessBirthDate', 7);

        this.formControlNameToTabIndex.set('groomNriSecondWitnessFirstName', 7);
        this.formControlNameToTabIndex.set('groomNriSecondWitnessMiddlName', 7);
        this.formControlNameToTabIndex.set('groomNriSecondWitnessLastName', 7);
        this.formControlNameToTabIndex.set('groomNriSecondWitnessFirstNameGuj', 7);
        this.formControlNameToTabIndex.set('groomNriSecondWitnessMiddlNameGuj', 7);
        this.formControlNameToTabIndex.set('groomNriSecondWitnessLastNameGuj', 7);
        this.formControlNameToTabIndex.set('groomNriSecondWitnessAddress', 7);
        this.formControlNameToTabIndex.set('groomNriSecondWitnessAddressGuj', 7);
        this.formControlNameToTabIndex.set('groomNriSecondWitnessBirthDate', 7);

        this.formControlNameToTabIndex.set('brideNriFirstWitnessFirstName', 8);
        this.formControlNameToTabIndex.set('brideNriFirstWitnessMiddlName', 8);
        this.formControlNameToTabIndex.set('brideNriFirstWitnessLastName', 8);
        this.formControlNameToTabIndex.set('brideNriFirstWitnessFirstNameGuj', 8);
        this.formControlNameToTabIndex.set('brideNriFirstWitnessMiddlNameGuj', 8);
        this.formControlNameToTabIndex.set('brideNriFirstWitnessLastNameGuj', 8);
        this.formControlNameToTabIndex.set('brideNriFirstWitnessAddress', 8);
        this.formControlNameToTabIndex.set('brideNriFirstWitnessAddressGuj', 8);
        this.formControlNameToTabIndex.set('brideNriFirstWitnessBirthDate', 8);

        this.formControlNameToTabIndex.set('brideNriSecondWitnessFirstName', 8);
        this.formControlNameToTabIndex.set('brideNriSecondWitnessMiddlName', 8);
        this.formControlNameToTabIndex.set('brideNriSecondWitnessLastName', 8);
        this.formControlNameToTabIndex.set('brideNriSecondWitnessFirstNameGuj', 8);
        this.formControlNameToTabIndex.set('brideNriSecondWitnessMiddlNameGuj', 8);
        this.formControlNameToTabIndex.set('brideNriSecondWitnessLastNameGuj', 8);
        this.formControlNameToTabIndex.set('brideNriSecondWitnessAddress', 8);
        this.formControlNameToTabIndex.set('brideNriSecondWitnessAddressGuj', 8);
        this.formControlNameToTabIndex.set('brideNriSecondWitnessBirthDate', 8);

        this.formControlNameToTabIndex.set('groomDays', 8);
        this.formControlNameToTabIndex.set('brideDays', 8);

        if ((this.marriageFormGroup.get('isNriMarriage').value && this.bridegroomDetails.get('isGroomVisa').value) || (this.marriageFormGroup.get('isNriMarriage').value && this.brideDetails.get('isBrideVisa').value)) {
            this.formControlNameToTabIndex.set('applicantRelation', 8);
            this.formControlNameToTabIndex.set('applicantRelationOther', 8);
        }

        else if (this.marriageFormGroup.get('isNriMarriage').value && (this.bridegroomDetails.get('isGroomVisa').value && this.brideDetails.get('isBrideVisa').value)) {
            this.formControlNameToTabIndex.set('applicantRelation', 9);
            this.formControlNameToTabIndex.set('applicantRelationOther', 9);
        }

        else {
            this.formControlNameToTabIndex.set('applicantRelation', 7);
            this.formControlNameToTabIndex.set('applicantRelationOther', 7);
        }
    }

    handleErrorsOnSubmit(key) {
        const index = this.formControlNameToTabIndex.get(key)
        this.tabIndex = index;
    }

    handleOnSaveAndNext(res) {

        this.changeDocument();
        this.setBrideReligion(res);
    }

    /**
     * This method is use to patch Value in marriage form
     * @param id : Form Id.
     */
    getFormData(id: number) {
        this.formService.getFormData(id).subscribe(
            res => {

                this.isViewMode = !res.canEdit;

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
                    //this.changeDisable('groomParentsAddressResidence');
                }
                else {
                    this.addObject['checkedPar1'] = false;
                    this.setValue('isGroomParResAddressSame', 'NO', this.fatherOfBridegroom);
                }
                if (res.isBrideParResAddressSame.code == "YES") {
                    this.addObject['checkedPar2'] = true;
                    //this.changeDisable('brideParentsAddressResidence');
                }
                else {
                    this.addObject['checkedPar2'] = false;
                    this.setValue('isBrideParResAddressSame', 'NO', this.fatherOfBride);
                }
                if (res.isPriestParResAddressSame.code == "YES") {
                    this.addObject['checkedPar3'] = true;
                    //this.changeDisable('priestAddressResidence');
                }
                else {
                    this.addObject['checkedPar3'] = false;
                    this.setValue('isPriestParResAddressSame', 'NO', this.marriageSolemnizerDetails);
                }
                if (res.isParentsAddressSameAsGroomAddress.code == "YES") {
                    this.addObject['checkedPar4'] = true;
                }
                else {
                    this.addObject['checkedPar4'] = false;
                    this.setValue('isParentsAddressSameAsGroomAddress', 'NO', this.fatherOfBridegroom);
                }
                if (res.isParentsAddressSameAsBrideAddress.code == "YES") {
                    this.addObject['checkedPar5'] = true;
                }
                else {
                    this.addObject['checkedPar5'] = false;
                    this.setValue('isParentsAddressSameAsBrideAddress', 'NO', this.fatherOfBride);
                }

                this.marriageFormGroup.patchValue(res);
                this.bridegroomDetails.patchValue(res);
                this.brideDetails.patchValue(res);
                this.marriageSolemnizerDetails.patchValue(res)
                this.applicantDetails.patchValue(res);
                this.detailsOfBrideNRIWitness.patchValue(res);
                this.detailsOfBridegroomNRIWitness.patchValue(res);
                this.secondWitnessDetails.patchValue(res);
                this.fatherOfBridegroom.patchValue(res);
                this.firstWitnessDetails.patchValue(res);
                this.fatherOfBride.patchValue(res)
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
                    this.religionGujgroom = res.groomReligion.gujName;
                }

                if (!_.isUndefined(res.brideReligion.code)) {
                    this.onChange(res.brideReligion.code, this.religionArray, 'religionGujbride')
                    this.religionGujbride = res.brideReligion.gujName;
                }

                if (!_.isUndefined(res.marriageTimeGroomStatus.code)) {
                    this.onChange(res.marriageTimeGroomStatus.code, this.maritalStatusArray, 'maritalstatusGujgroom')
                    this.maritalstatusGujgroom = res.marriageTimeGroomStatus.gujName
                }

                if (!_.isUndefined(res.marriageTimeBrideStatus.code)) {
                    this.onChange(res.marriageTimeBrideStatus.code, this.maritalStatusArray, 'maritalstatusGujbride')
                    this.maritalstatusGujbride = res.marriageTimeBrideStatus.gujName;
                }

                if (!_.isUndefined(res.applicantRelation.code)) {
                    this.onChange(res.applicantRelation.code, this.applicantrelationArray, 'applicantrelationGuj')
                    this.applicantrelationGuj = res.applicantRelation.gujName;
                }
                if (!_.isUndefined(res.uniqueIdProofLable.code)) {
                    this.onChange(res.uniqueIdProofLable.code, this.identityproofArray, 'identityproofGuj')
                }

                if (!this.marriageFormGroup.controls.canEdit.value) {
                    this.marriageFormGroup.disable();
                    this.bridegroomDetails.disable();
                    this.brideDetails.disable();
                    this.marriageSolemnizerDetails.disable(res)
                    this.applicantDetails.disable(res);
                    this.detailsOfBrideNRIWitness.disable(res);
                    this.detailsOfBridegroomNRIWitness.disable(res);
                    this.secondWitnessDetails.disable(res);
                    this.fatherOfBridegroom.disable(res);
                    this.firstWitnessDetails.disable(res);
                    this.fatherOfBride.disable(res)
                }

                let groomVisa = this.bridegroomDetails.get("isGroomVisa").value;
                if (groomVisa == null) {
                    this.bridegroomDetails.get("isGroomVisa").setValue(false);
                }

                this.changeDocument();

                this.disableAddress();

            },
            err => {
                this.toster.error(err.error.error_description);
                // console.log("get fail" + err);
            }
        );


    }

    disableAddress() {

        this.bridegroomDetails.get('marriagePlace').get('country').setValue('INDIA');
        this.bridegroomDetails.get('marriagePlace').get('state').setValue('GUJARAT');
        this.bridegroomDetails.get('marriagePlace').get('city').setValue('Vadodara');
        // this.bridegroomDetails.get('marriagePlace').get('country').disable();
        // this.bridegroomDetails.get('marriagePlace').get('state').disable();
        // this.bridegroomDetails.get('marriagePlace').get('city').disable();
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
    dateFormate(date, controlType: string, controllerName) {
        if (date) {
            controllerName.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
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

            let marriagedate = this.bridegroomDetails.get("marriageDate").value;

            if (marriagedate) {
                // if (marriagedate == null) {
                //     this.commonService.openAlert("Warning", "Please select Date of Marriage", "warning");
                // }

                //display days and years
                let mday = moment(this.bridegroomDetails.get("marriageDate").value, "YYYY-MM-DD");

                if (this.bridegroomDetails.get("groomBirthDate").value) {
                    let bday = moment(this.bridegroomDetails.get("groomBirthDate").value, "YYYY-MM-DD");
                    this.groomage = mday.diff(bday, 'years', false);
                    this.groomdays = mday.diff(bday.add(this.groomage, 'years'), 'days', false);

                    this.bridegroomDetails.get("groomAge").setValue(this.groomage);
                    this.bridegroomDetails.get("groomDays").setValue(this.groomdays);
                }

                if (this.brideDetails.get("brideBirthDate").value) {
                    let bday = moment(this.brideDetails.get("brideBirthDate").value, "YYYY-MM-DD");
                    this.brideage = mday.diff(bday, 'years', false);
                    this.bridedays = mday.diff(bday.add(this.brideage, 'years'), 'days', false);

                    this.brideDetails.get("brideAge").setValue(this.brideage);
                    this.brideDetails.get("brideDays").setValue(this.bridedays);
                }
            } else {
                this.touchedField('marriageDate');
                this.commonService.openAlert("Warning", "Please select Date of Marriage", "warning");
                this.bridegroomDetails.get("groomAge").setValue(null);
                this.brideDetails.get("brideAge").setValue(null);
                this.bridegroomDetails.get("groomDays").setValue(null);
                this.brideDetails.get("brideDays").setValue(null);
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
        console.log(this.bridegroomDetails);
        
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

    parentAgeBride(date: string, filed: string) {
        let days = 0;
        let year = 0;
        if (this.marriageFormGroup.get(date).value != null) {
            let bday = moment(this.marriageFormGroup.get(date).value, "YYYY-MM-DD");
            year = moment().diff(bday, 'years', false);
            days = moment().diff(bday.add(year, 'years'), 'days', false);
            if (filed != '') {
                this.marriageFormGroup.get(filed).setValue(year + " Year " + days + " Days");
            }
            return [year + " Year " + days + " Days"]
        }
        else {
            return null
        }

    }
    /**
     * This method is calculate age.
     * @param date : parents birth date
     */
    parentAge(date: string, filed: string, controllerName) {
        let days = 0;
        let year = 0;
        if (controllerName.get(date).value != null) {
            let bday = moment(controllerName.get(date).value, "YYYY-MM-DD");
            year = moment().diff(bday, 'years', false);
            days = moment().diff(bday.add(year, 'years'), 'days', false);
            if (filed != '') {
                controllerName.get(filed).setValue(year + " Year " + days + " Days");
            }
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
        if (this.bridegroomDetails.get('isGroomVisa').value) {
            this.nriWitenessFields('groom', this.detailsOfBridegroomNRIWitness);
            this.changeReflection('groom', this.bridegroomDetails);
        }
        if (this.brideDetails.get('isBrideVisa').value) {
            this.nriWitenessFields('bride', this.detailsOfBrideNRIWitness);
            this.changeReflection('bride', this.brideDetails);
        }

        this.bridegroomDetails.get('isGroomVisa').setValue(false);
        this.brideDetails.get('isBrideVisa').setValue(false);

        this.bridegroomDetails.get('groomAddress').reset();
        this.brideDetails.get('brideAddress').reset();

        this.fatherOfBridegroom.get('groomParentsAddress').reset();
        this.fatherOfBridegroom.get('groomParentsAddressResidence').reset();

        this.fatherOfBride.get('brideParentsAddress').reset();
        this.fatherOfBride.get('brideParentsAddressResidence').reset();

        this.addObject['checkedPar1'] = false;
        this.addObject['checkedPar2'] = false;
        this.addObject['checkedPar3'] = false;
        this.addObject['checkedPar4'] = false;
        this.addObject['checkedPar5'] = false;
        this.fatherOfBridegroom.get('isGroomParResAddressSame').get('code').setValue('NO');
        this.fatherOfBride.get('isBrideParResAddressSame').get('code').setValue('NO');
        this.fatherOfBridegroom.get('isParentsAddressSameAsGroomAddress').get('code').setValue('NO');
        this.fatherOfBride.get('isParentsAddressSameAsBrideAddress').get('code').setValue('NO');

        this.bridegroomDetails.get('groomAddress').get('addressType').setValue('GROOM_ADDRESS');
        this.brideDetails.get('brideAddress').get('addressType').setValue('BRIDE_ADDRESS');

        this.fatherOfBridegroom.get('groomParentsAddress').get('addressType').setValue('GROOM_PARENTS_ADDRESS');
        this.fatherOfBridegroom.get('groomParentsAddressResidence').get('addressType').setValue('GROOM_PARENTS_ADDRESS_RESIDENCE');
        this.fatherOfBride.get('brideParentsAddress').get('addressType').setValue('BRIDE_PARENTS_ADDRESS');
        this.fatherOfBride.get('brideParentsAddressResidence').get('addressType').setValue('GROOM_PARENTS_ADDRESS_RESIDENCE');
        this.requiredDocumentList()
    }

    /**
     * This method is Reset Visa related field.
     * @param person : Groom or Bride (Change Event).
     */
    changeReflection(person: string, controllerName) {
        controllerName.get(`${person}PassportNumber`).reset();
        controllerName.get(`${person}NriStatus`).reset();
        controllerName.get(`${person}CountryName`).reset();
        controllerName.get(`${person}VisaNumber`).reset();
        controllerName.get(`${person}VisaFrom`).reset();
        controllerName.get(`${person}VisaTo`).reset();
        controllerName.get(`${person}SocialSecurityNumber`).reset();
        controllerName.get(`${person}Eligibility`).reset();
        controllerName.get(`${person}Designation`).reset();
        controllerName.get(`${person}PhoneNumber`).reset();
        controllerName.get(`${person}Email`).reset();
        controllerName.get(`${person}CompanyName`).reset();
        controllerName.get(`${person}CompanyAddress`).reset();
        controllerName.get(`${person}CompanyPhoneNumber`).reset();

        // convert uppercase
        let getName = this.capitalizeFirstLetter(person);
        controllerName.get(`nri${getName}Address`).reset();
        person == 'bride' ? this.fatherOfBride.get(`nri${getName}ParentsAddress`).reset() :this.fatherOfBridegroom.get(`nri${getName}ParentsAddress`).reset();

        if(person == 'bride'){
            this.getValidationOnBride(person , this.detailsOfBrideNRIWitness , getName)
            this.removeValidationOnBride(person , this.brideDetails, getName)
        }else{
            this.getValidationOnGroom(person , this.detailsOfBridegroomNRIWitness, getName)
            this.removeValidationOnBride(person , this.bridegroomDetails, getName)
        }
        
        controllerName.get(`${person}CountryName`).updateValueAndValidity();
        this.CD.detectChanges();
        this.changeInMainController(person)
    }

    capitalizeFirstLetter(s: string) {
        return s && s[0].toUpperCase() + s.slice(1);
    }
    /**
     * This method is Reset Visa related field.
     * @param person : Groom or Bride (Change Event).
     */
    nriWitenessFields(person: string, controllerName) {

        controllerName.get(`${person}NriFirstWitnessFirstName`).reset();
        controllerName.get(`${person}NriFirstWitnessMiddlName`).reset();
        controllerName.get(`${person}NriFirstWitnessLastName`).reset();
        controllerName.get(`${person}NriFirstWitnessFirstNameGuj`).reset();
        controllerName.get(`${person}NriFirstWitnessMiddlNameGuj`).reset();
        controllerName.get(`${person}NriFirstWitnessLastNameGuj`).reset();
        controllerName.get(`${person}NriFirstWitnessAddress`).reset();
        controllerName.get(`${person}NriFirstWitnessAddressGuj`).reset();
        controllerName.get(`${person}NriFirstWitnessBirthDate`).setValue('');

        controllerName.get(`${person}NriSecondWitnessFirstName`).reset();
        controllerName.get(`${person}NriSecondWitnessMiddlName`).reset();
        controllerName.get(`${person}NriSecondWitnessLastName`).reset();
        controllerName.get(`${person}NriSecondWitnessFirstNameGuj`).reset();
        controllerName.get(`${person}NriSecondWitnessMiddlNameGuj`).reset();
        controllerName.get(`${person}NriSecondWitnessLastNameGuj`).reset();
        controllerName.get(`${person}NriSecondWitnessAddress`).reset();
        controllerName.get(`${person}NriSecondWitnessAddressGuj`).reset();
        controllerName.get(`${person}NriSecondWitnessBirthDate`).reset();

        // convert uppercase
        let getName = this.capitalizeFirstLetter(person);
        person == 'bride' ? this.brideDetails.get(`nri${getName}Address`).reset() :   this.bridegroomDetails.get(`nri${getName}Address`).reset();
        
        if(person == 'bride'){
            this.getValidationOnBride(person , this.detailsOfBrideNRIWitness, getName)
        }else{
            this.getValidationOnGroom(person , this.detailsOfBridegroomNRIWitness, getName)
        }
        
        // this.marriageFormGroup.get(`${person}Country`).updateValueAndValidity();
        this.CD.detectChanges();
    }

    /**
     * This method is use when change selection of visa filed . 
     * @param person : Groom or Bride(Change Event).
     * @param type : Addrerss Type.
     */
    resetAddress(person: string, type: string, controllerName) {
        controllerName.get(person).reset();
        controllerName.get(person).get('addressType').setValue(type);
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

    changeDocument() {


        let marriageTimeGroomStatus = this.bridegroomDetails.get('marriageTimeGroomStatus').get('code').value;
        let marriageTimeBrideStatus = this.brideDetails.get('marriageTimeBrideStatus').get('code').value;

        _.forEach(this.marriageFormGroup.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
            if (value['documentIdentifier'] === 'VALID_DIVORCE_PAPER' || value['documentIdentifier'] == "DEATH_CERTIFICATE") {
                value['mandatory'] = false;
            }
            if (marriageTimeGroomStatus == "DIVORCED" || marriageTimeBrideStatus == 'DIVORCED') {
                //  devorce certi true
                if (value['documentIdentifier'] === 'VALID_DIVORCE_PAPER') {
                    value['mandatory'] = true;
                    this.uploadFilesArray.push({
                        'labelName': value.documentLabelEn,
                        'fieldIdentifier': value.fieldIdentifier,
                        'documentIdentifier': value.documentIdentifier
                    });
                }
            }
            if (marriageTimeBrideStatus == "WIDOW" || marriageTimeGroomStatus == 'WIDOWER') {
                // both true
                if (value['documentIdentifier'] == "DEATH_CERTIFICATE") {
                    value['mandatory'] = true;
                    this.uploadFilesArray.push({
                        'labelName': value.documentLabelEn,
                        'fieldIdentifier': value.fieldIdentifier,
                        'documentIdentifier': value.documentIdentifier
                    });
                }

            }

            //this.marriageFormGroup.get('serviceDetail').patchValue({'serviceUploadDocuments': this.uploadFilesArray});
            //this.requiredDocumentList();

        });
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

        let organizationCategory = this.bridegroomDetails.get('groomReligion').value.code;
        let groomVisa = this.bridegroomDetails.get("isGroomVisa").value;
        let brideVisa = this.brideDetails.get('isBrideVisa').value;
        this.listOfDependentAtt = [];
        this.listOfDependentAtt.push(organizationCategory);
        this.listOfDependentAtt.push(groomVisa);
        this.listOfDependentAtt.push(brideVisa);

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
                if (this.listOfDependentAtt[0] == 'HINDU') {
                    if (listofFields.includes('HINDU')) {
                        this.uploadFilesArray.push({
                            'labelName': value.documentLabelEn,
                            'fieldIdentifier': value.fieldIdentifier,
                            'documentIdentifier': value.documentIdentifier
                        })
                    }
                }
                if (this.listOfDependentAtt[2] == true && listofFields.includes('isBrideVisa')) {
                    this.uploadFilesArray.push({
                        'labelName': value.documentLabelEn,
                        'fieldIdentifier': value.fieldIdentifier,
                        'documentIdentifier': value.documentIdentifier
                    })
                }
                if (this.listOfDependentAtt[1] == true && listofFields.includes('isGroomVisa')) {
                    this.uploadFilesArray.push({
                        'labelName': value.documentLabelEn,
                        'fieldIdentifier': value.fieldIdentifier,
                        'documentIdentifier': value.documentIdentifier
                    })
                }

            }

        });

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
        // ;
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
        //             //     ;
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
        this.setFormControlToTabIndexMap();
    }

    onChangeWitnessNameValidation(event, firstNameWitness) {
        if (event.target.value === "" || this.firstWitnessDetails.get(firstNameWitness).invalid) {
            this.firstWitnessDetails.get(firstNameWitness).setValue(null);
            this.commonService.openAlert("Warning", "Please fill all the field correctly", "warning");
        }
    }

    /**
     * This method is check religion is same or not.
     */
    checkReligion() {
        //check religion is same or not    
        let groomreligionChange = this.bridegroomDetails.controls.groomReligion.get("code").value;
        let bridereligionChange = this.brideDetails.controls.brideReligion.get("code").value;
        this.requiredDocumentList();

        if (!_.isEmpty(groomreligionChange) && !_.isEmpty(bridereligionChange)) {
            if (bridereligionChange != groomreligionChange) {
                this.brideDetails.get('brideReligion').reset();
                this.religionGujbride = "";
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
    changeReset(controlName: string, controllerName) {

        this.fatherOfBridegroom.get('nriGroomParentsAddress').clearValidators();
        this.fatherOfBride.get('nriBrideParentsAddress').clearValidators();
        controllerName.get(controlName).reset();

        if (this.applicantDetails.get('applicantRelation').get('code').valid) {
            if (this.applicantDetails.get('applicantRelation').get('code').value == 'MR_OTHER_APPLICANT_RELATION') {
                this.applicantDetails.get('applicantRelationOther').setValidators([Validators.required]);
            } else {
                this.applicantDetails.get('applicantRelationOther').clearValidators();
            }
            this.applicantDetails.get('applicantRelationOther').updateValueAndValidity();
            this.CD.detectChanges();
        }
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
    setValue(controlName: string, value: string, controllerName) {
        controllerName.get(controlName).get('code').setValue(value);
    }

    /**
     * This method is use for auto fill address . 
     * @param event : check box event(boolean).
     * @param ischeck : set 'Yes' or 'NO' value when check or uncheck.
     * @param controlfirst : Address control.
     * @param controlsecond : for copy address.
     * @param add : Static variable index.
     */
    checkBox(event, ischeck: string, controlfirst: string, controlsecond: string, add: string, controllerName, secondControllerName) {

        let firstControl = controllerName.get(controlfirst);
        let secondControl = secondControllerName.get(controlsecond);
        let addressType = secondControllerName.get(controlsecond).get('addressType').value;
        let resAddressType = controllerName.get(controlfirst).get('addressType').value;

        if (event.checked) {
            this.addObject[`checkedPar${add}`] = true;
            // this.marriageFormGroup.get(ischeck).get('code').setValue("YES");
            this.setValue(ischeck, 'YES', controllerName);
            firstControl.setValue(secondControl.value);
            firstControl.disable();
            secondControllerName.get(controlsecond).get('addressType').setValue(addressType);
            controllerName.get(controlfirst).get('addressType').setValue(resAddressType);
        }
        else {
            this.addObject[`checkedPar${add}`] = false;
            firstControl.reset();
            firstControl.enable();
            secondControllerName.get(controlsecond).get('addressType').setValue(addressType);
            controllerName.get(controlfirst).get('addressType').setValue(resAddressType);
            // this.marriageFormGroup.get(ischeck).get('code').setValue("NO");
            this.setValue(ischeck, 'NO', controllerName);
        }
        this.fatherOfBridegroom.controls.groomParentsAddress.valueChanges.subscribe(data => {
            if (this.fatherOfBridegroom.get('isGroomParResAddressSame').get('code').value == "YES") {
                this.addressPatchValue({ checked: true });
            }
        });
        this.fatherOfBride.controls.brideParentsAddress.valueChanges.subscribe(data => {
            if (this.fatherOfBride.get('isBrideParResAddressSame').get('code').value == "YES") {
                this.addressPatchValue({ checked: true });
            }
        });
        this.marriageSolemnizerDetails.controls.priestAddress.valueChanges.subscribe(data => {
            if (this.marriageSolemnizerDetails.get('isPriestParResAddressSame').get('code').value == "YES") {
                this.addressPatchValue({ checked: true });
            }
        });
    }


    touchedField(formControlName: string) {
        this.bridegroomDetails.get(formControlName).markAsTouched();
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

    liglePrint() {
        let service = 'legalprint';
        this.formService.getCertificatOrLiglePrint(service, this.formId).subscribe(res => {

            var winPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write(res);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
            winPrint.close();
            // let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
            // sectionToPrintReceipt.innerHTML = res;
            // setTimeout(() => {
            //     window.print();
            // }, 300);
        },
            err => {
                this.commonService.openAlert('Error!', err.error[0].message, 'error');
            }
        )
    }

    getCertificate() {
        let certificate = 'certificate';
        this.formService.getCertificatOrLiglePrint(certificate, this.formId).subscribe(res => {
            let sectionToPrintReceipt: any = document.getElementById('sectionToPrint');
            sectionToPrintReceipt.innerHTML = res;
            setTimeout(() => {
                window.print();
            }, 300);
        },
            err => {
                this.commonService.openAlert('Error!', err.error[0].message, 'error');
            }
        )
    }

    setBrideReligion(evt) {
        console.log(this.bridegroomDetails.get('groomReligion').value);
        this.brideDetails.get('brideReligion').setValue(this.bridegroomDetails.get('groomReligion').value);
        this.religionGujbride = this.bridegroomDetails.get('groomReligion').get('gujName').value

    }

    /**
    * This method use for get available slot 
    */
    onSubmit() {
        if (this.appointmentForm.invalid) {
            this.config.getAllErrors(this.appointmentForm);
            return false
            //this.commonService.openAlert("Error", this.config.ALL_FEILD_REQUIRED_MESSAGE, "warning");
        } else {
            this.getSlot();
        }
    }

    /**
     * This method is get available slots 
     */

    resetFormValue(){
        this.isSearch = false;    
    }

    getSlot() {
        this.isSearch = true;
    }

    /**
     * This method is use for open modal.
     */
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, Object.assign({ ignoreBackdropClick: true }, { class: 'gray modal-lg customWidth' }));
    }

    /**
    * This method is get available resource list 
    */
    getResources() {
        this.appointmentService.getResources().subscribe((resp) => {
            this.resources = resp.data;
        }, (err) => {
            if (err.error[0])
                this.commonService.openAlert("Error", err.error[0].message, "warning");
        })
    }

    disableSunday(d: Date) {
        if (d.getDay() != 0) {
            return d;
        }
    }

    /**
    * This method is change date format 
    */
    dateFormateOne(date, controlType, ) {
        this.appointmentForm.get(controlType).setValue(moment(date).format("YYYY-MM-DD"));
        this.resetFormValue();
    }

    addressPatchValue(event) {
        this.fatherOfBridegroom.get('groomParentsAddressResidence').setValue(this.fatherOfBridegroom.get('groomParentsAddress').value);
        this.fatherOfBride.get('brideParentsAddressResidence').setValue(this.fatherOfBride.get('brideParentsAddress').value);
        this.marriageSolemnizerDetails.get('priestAddressResidence').setValue(this.marriageSolemnizerDetails.get('priestAddress').value);
    }

    changeInMainController(person: string) {
        this.marriageFormGroup.get(`${person}PassportNumber`).reset();
        this.marriageFormGroup.get(`${person}NriStatus`).reset();
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
            this.marriageFormGroup.get(`${person}NriStatus`).setValidators([Validators.required, Validators.maxLength(50)]);
            this.marriageFormGroup.get(`${person}CountryName`).setValidators(Validators.required);
            this.marriageFormGroup.get(`${person}VisaNumber`).setValidators([Validators.required, Validators.maxLength(9)]);
            this.marriageFormGroup.get(`${person}VisaFrom`).setValidators(Validators.required);
            this.marriageFormGroup.get(`${person}VisaTo`).setValidators(Validators.required);
            this.marriageFormGroup.get(`${person}SocialSecurityNumber`).setValidators([Validators.required, Validators.maxLength(9)]);
            this.marriageFormGroup.get(`${person}Eligibility`).setValidators([Validators.required, Validators.maxLength(50)]);
            this.marriageFormGroup.get(`${person}Designation`).setValidators([Validators.required, Validators.maxLength(50)]);
            this.marriageFormGroup.get(`${person}PhoneNumber`).setValidators([Validators.required, Validators.maxLength(10), Validators.minLength(10)]);
            this.marriageFormGroup.get(`${person}Email`).setValidators([Validators.required, Validators.maxLength(50), Validators.email, ValidationService.emailValidator]);
            this.marriageFormGroup.get(`${person}CompanyName`).setValidators([Validators.maxLength(100)]);
            this.marriageFormGroup.get(`${person}CompanyAddress`).setValidators([Validators.maxLength(500)]);
            this.marriageFormGroup.get(`${person}CompanyPhoneNumber`).setValidators([Validators.maxLength(10), Validators.minLength(10)]);

            this.marriageFormGroup.get(`nri${getName}Address`).setValidators(Validators.required);
            this.marriageFormGroup.get(`nri${getName}ParentsAddress`).setValidators(Validators.required);
        }
        else {

            this.marriageFormGroup.get(`${person}PassportNumber`).clearValidators();
            this.marriageFormGroup.get(`${person}NriStatus`).clearValidators();
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

    nriWitenessFieldsChangeMainController(person: string) {

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

    getValidationOnBride(person , controllerName, getName){
        if (this.brideDetails.get(`is${getName}Visa`).value) {

            controllerName.get(`${person}NriFirstWitnessFirstName`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}NriFirstWitnessLastName`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}NriFirstWitnessAddress`).setValidators([Validators.required, Validators.maxLength(500)]);
            controllerName.get(`${person}NriFirstWitnessBirthDate`).setValidators(Validators.required);

            controllerName.get(`${person}NriSecondWitnessFirstName`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}NriSecondWitnessLastName`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}NriSecondWitnessAddress`).setValidators([Validators.required, Validators.maxLength(500)]);
            controllerName.get(`${person}NriSecondWitnessBirthDate`).setValidators(Validators.required);

        }
        else {

            controllerName.get(`${person}NriFirstWitnessFirstName`).clearValidators();
            controllerName.get(`${person}NriFirstWitnessLastName`).clearValidators();
            controllerName.get(`${person}NriFirstWitnessAddress`).clearValidators();
            controllerName.get(`${person}NriFirstWitnessBirthDate`).clearValidators();

            controllerName.get(`${person}NriSecondWitnessFirstName`).clearValidators();
            controllerName.get(`${person}NriSecondWitnessLastName`).clearValidators();
            controllerName.get(`${person}NriSecondWitnessAddress`).clearValidators();
            controllerName.get(`${person}NriSecondWitnessBirthDate`).clearValidators();

        }
            controllerName.get(`${person}NriFirstWitnessFirstName`).updateValueAndValidity()
            controllerName.get(`${person}NriFirstWitnessLastName`).updateValueAndValidity()
            controllerName.get(`${person}NriFirstWitnessAddress`).updateValueAndValidity();
            controllerName.get(`${person}NriFirstWitnessBirthDate`).updateValueAndValidity();

            controllerName.get(`${person}NriSecondWitnessFirstName`).updateValueAndValidity();
            controllerName.get(`${person}NriSecondWitnessLastName`).updateValueAndValidity();
            controllerName.get(`${person}NriSecondWitnessAddress`).updateValueAndValidity();
            controllerName.get(`${person}NriSecondWitnessBirthDate`).updateValueAndValidity();
    }

    getValidationOnGroom(person, controllerName, getName){
        if ( this.bridegroomDetails.get(`is${getName}Visa`).value) {

            controllerName.get(`${person}NriFirstWitnessFirstName`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}NriFirstWitnessLastName`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}NriFirstWitnessAddress`).setValidators([Validators.required, Validators.maxLength(500)]);
            controllerName.get(`${person}NriFirstWitnessBirthDate`).setValidators(Validators.required);

            controllerName.get(`${person}NriSecondWitnessFirstName`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}NriSecondWitnessLastName`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}NriSecondWitnessAddress`).setValidators([Validators.required, Validators.maxLength(500)]);
            controllerName.get(`${person}NriSecondWitnessBirthDate`).setValidators(Validators.required);

        }
        else {

            controllerName.get(`${person}NriFirstWitnessFirstName`).clearValidators();
            controllerName.get(`${person}NriFirstWitnessLastName`).clearValidators();
            controllerName.get(`${person}NriFirstWitnessAddress`).clearValidators();
            controllerName.get(`${person}NriFirstWitnessBirthDate`).clearValidators();

            controllerName.get(`${person}NriSecondWitnessFirstName`).clearValidators();
            controllerName.get(`${person}NriSecondWitnessLastName`).clearValidators();
            controllerName.get(`${person}NriSecondWitnessAddress`).clearValidators();
            controllerName.get(`${person}NriSecondWitnessBirthDate`).clearValidators();

        }
        controllerName.get(`${person}NriFirstWitnessFirstName`).updateValueAndValidity()
            controllerName.get(`${person}NriFirstWitnessLastName`).updateValueAndValidity()
            controllerName.get(`${person}NriFirstWitnessAddress`).updateValueAndValidity();
            controllerName.get(`${person}NriFirstWitnessBirthDate`).updateValueAndValidity();

            controllerName.get(`${person}NriSecondWitnessFirstName`).updateValueAndValidity();
            controllerName.get(`${person}NriSecondWitnessLastName`).updateValueAndValidity();
            controllerName.get(`${person}NriSecondWitnessAddress`).updateValueAndValidity();
            controllerName.get(`${person}NriSecondWitnessBirthDate`).updateValueAndValidity();
    }

    removeValidationOnBride(person , controllerName, getName){
        if (controllerName.get(`is${getName}Visa`).value) {

            controllerName.get(`${person}PassportNumber`).setValidators([Validators.required, Validators.maxLength(9)]);
            controllerName.get(`${person}NriStatus`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}CountryName`).setValidators(Validators.required);
            controllerName.get(`${person}VisaNumber`).setValidators([Validators.required, Validators.maxLength(9)]);
            controllerName.get(`${person}VisaFrom`).setValidators(Validators.required);
            controllerName.get(`${person}VisaTo`).setValidators(Validators.required);
            controllerName.get(`${person}SocialSecurityNumber`).setValidators([Validators.required, Validators.maxLength(9)]);
            controllerName.get(`${person}Eligibility`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}Designation`).setValidators([Validators.required, Validators.maxLength(50)]);
            controllerName.get(`${person}PhoneNumber`).setValidators([Validators.required, Validators.maxLength(10), Validators.minLength(10)]);
            controllerName.get(`${person}Email`).setValidators([Validators.required, Validators.maxLength(50), Validators.email, ValidationService.emailValidator]);
            controllerName.get(`${person}CompanyName`).setValidators([Validators.maxLength(100)]);
            controllerName.get(`${person}CompanyAddress`).setValidators([Validators.maxLength(500)]);
            controllerName.get(`${person}CompanyPhoneNumber`).setValidators([Validators.maxLength(10), Validators.minLength(10)]);
            controllerName.get(`${person}Address`).setValidators(Validators.required);
            controllerName.get(`nri${getName}Address`).setValidators(Validators.required);
        }
        else {

            controllerName.get(`${person}PassportNumber`).clearValidators();
            controllerName.get(`${person}NriStatus`).clearValidators();
            controllerName.get(`${person}CountryName`).clearValidators();
            controllerName.get(`${person}VisaNumber`).clearValidators();
            controllerName.get(`${person}VisaFrom`).clearValidators();
            controllerName.get(`${person}VisaTo`).clearValidators();
            controllerName.get(`${person}SocialSecurityNumber`).clearValidators();
            controllerName.get(`${person}Eligibility`).clearValidators();
            controllerName.get(`${person}Designation`).clearValidators();
            controllerName.get(`${person}PhoneNumber`).clearValidators();
            controllerName.get(`${person}Email`).clearValidators();
            controllerName.get(`${person}CompanyName`).clearValidators();
            controllerName.get(`${person}CompanyAddress`).clearValidators();
            controllerName.get(`${person}CompanyPhoneNumber`).clearValidators();
            controllerName.get(`${person}Address`).clearValidators();
            controllerName.get(`nri${getName}Address`).clearValidators();
        }
        controllerName.get(`${person}PassportNumber`).updateValueAndValidity();
        controllerName.get(`${person}NriStatus`).updateValueAndValidity();
        controllerName.get(`${person}CountryName`).updateValueAndValidity();
        controllerName.get(`${person}VisaNumber`).updateValueAndValidity();
        controllerName.get(`${person}VisaFrom`).updateValueAndValidity();
        controllerName.get(`${person}VisaTo`).updateValueAndValidity();
        controllerName.get(`${person}SocialSecurityNumber`).updateValueAndValidity();
        controllerName.get(`${person}Eligibility`).updateValueAndValidity();
        controllerName.get(`${person}Designation`).updateValueAndValidity();
        controllerName.get(`${person}PhoneNumber`).updateValueAndValidity();
        controllerName.get(`${person}Email`).updateValueAndValidity();
        controllerName.get(`${person}CompanyName`).updateValueAndValidity();
        controllerName.get(`${person}CompanyAddress`).updateValueAndValidity();
        controllerName.get(`${person}CompanyPhoneNumber`).updateValueAndValidity();
        controllerName.get(`${person}Address`).updateValueAndValidity();
        controllerName.get(`nri${getName}Address`).updateValueAndValidity();
    }

}
