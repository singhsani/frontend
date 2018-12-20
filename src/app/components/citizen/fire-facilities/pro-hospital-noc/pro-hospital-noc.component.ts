
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, Validator } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { ValidationService } from '../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import { TranslateService } from '../../../../shared/modules/translate/translate.service';
import { CommonService } from '../../../../shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { FireFacilitiesService } from '../common/services/fire-facilities.service';

@Component({
  selector: 'app-pro-hospital-noc',
  templateUrl: './pro-hospital-noc.component.html',
  styleUrls: ['./pro-hospital-noc.component.scss']
})
export class ProHospitalNocComponent implements OnInit {

  provisionalHospitalNocForm: FormGroup;
  translateKey: string = 'provisionalHospitalNocScreen';

  formId: number;
  apiCode: string;
  tabIndex: number = 0;

  // required attachment array
  private uploadFilesArray: Array<any> = [];
  private showButtons: boolean = false;
  private otherRiskNote:boolean = false;
  //Lookups Array
  FS_STAIR_CASE: Array<any> = [];
  FS_OTHER_RISKS: Array<any> = [];
  FS_FIRE_ALARM_ATTACHED_WTIH: Array<any> = [];

// ***************************************
public dummyJSON ={
  "id": 12,
  "uniqueId": "2018-12-19-FS-PROVI-HOSPITAL-KKDXJMT2",
  "version": 8,
  "serviceDetail": {
      "code": "FS-PROVI-HOSPITAL",
      "fieldView": "ALL",
      "name": "Provisional NOC For Hospital",
      "gujName": "હોસ્પિટલ માટે અનિવાર્ય એનઓસી",
      "feesOnScrutiny": false,
      "appointmentRequired": false,
      "serviceUploadDocuments": [
          {
              "id": 181,
              "code": null,
              "documentKey": "FS-PROVI-HOSPITAL_fc96a6d0fdb646718d7db81c422efd8b",
              "documentIdentifier": "COPY_OF_OC_CC",
              "documentLabelEn": "Copy of Occupation Certificate / Completion Certificate",
              "documentLabelGuj": "વ્યવસાય પ્રમાણપત્રની નકલ / સમાપ્તિ પ્રમાણપત્ર",
              "fieldIdentifier": "1",
              "formPart": "1",
              "dependentFieldName": null,
              "mandatory": false,
              "maxFileSizeInMB": 5,
              "requiredOnAdminPortal": true,
              "requiredOnCitizenPortal": true,
              "isActive": true
          },
          {
              "id": 182,
              "code": null,
              "documentKey": "FS-PROVI-HOSPITAL_b5111077dc6e44268c23d873db6b48b8",
              "documentIdentifier": "APPROVED_LAYOUT_PLAN",
              "documentLabelEn": "Approved Layout Plan Vuda / VMC",
              "documentLabelGuj": "માન્ય લેઆઉટ પ્લાન વુડા / વીએમસી",
              "fieldIdentifier": "2",
              "formPart": "1",
              "dependentFieldName": null,
              "mandatory": false,
              "maxFileSizeInMB": 5,
              "requiredOnAdminPortal": true,
              "requiredOnCitizenPortal": true,
              "isActive": true
          },
          {
              "id": 183,
              "code": null,
              "documentKey": "FS-PROVI-HOSPITAL_7f6fe6a8a3844f4c8f28c183569d6c17",
              "documentIdentifier": "APPROVED_APPROACHED ROAD",
              "documentLabelEn": "Approved Approached road Vuda / VMC",
              "documentLabelGuj": "મંજૂર થયેલ માર્ગ વુડા / વી.એમ.સી.",
              "fieldIdentifier": "3",
              "formPart": "1",
              "dependentFieldName": null,
              "mandatory": false,
              "maxFileSizeInMB": 5,
              "requiredOnAdminPortal": true,
              "requiredOnCitizenPortal": true,
              "isActive": true
          },
          {
              "id": 184,
              "code": null,
              "documentKey": "FS-PROVI-HOSPITAL_533a2ae9a6fe493380b401d8d684c366",
              "documentIdentifier": "TANK_MEASUREMENT_WITH_MAP",
              "documentLabelEn": "Measurement of Tank(Underground Overhead) with map",
              "documentLabelGuj": "નકશા સાથે ટેન્ક (ભૂગર્ભ ઓવરહેડ) નું માપન",
              "fieldIdentifier": "4",
              "formPart": "1",
              "dependentFieldName": null,
              "mandatory": false,
              "maxFileSizeInMB": 5,
              "requiredOnAdminPortal": true,
              "requiredOnCitizenPortal": true,
              "isActive": true
          },
          {
              "id": 185,
              "code": null,
              "documentKey": "FS-PROVI-HOSPITAL_ab2eb998665149cc9f5c756f5271f1b5",
              "documentIdentifier": "EXPLOSIVE_LICENSE",
              "documentLabelEn": "Explosive License for ( LPG / CNG / Petrol Pump / Gas Pump / Gas Station / Gas Storage",
              "documentLabelGuj": "વિસ્ફોટક લાયસન્સ (એલપીજી / સીએનજી / પેટ્રોલ પમ્પ / ગેસ પમ્પ / ગેસ સ્ટેશન / ગેસ સ્ટોરેજ",
              "fieldIdentifier": "5",
              "formPart": "1",
              "dependentFieldName": null,
              "mandatory": false,
              "maxFileSizeInMB": 5,
              "requiredOnAdminPortal": true,
              "requiredOnCitizenPortal": true,
              "isActive": true
          },
          {
              "id": 186,
              "code": null,
              "documentKey": "FS-PROVI-HOSPITAL_fa8764898e8a48f79af3aabc210466b4",
              "documentIdentifier": "RAJA_CHITTHI",
              "documentLabelEn": "Raja chitthi of VMC",
              "documentLabelGuj": "વીએમસી રજાચિઠ્ઠી",
              "fieldIdentifier": "6",
              "formPart": "1",
              "dependentFieldName": null,
              "mandatory": false,
              "maxFileSizeInMB": 5,
              "requiredOnAdminPortal": true,
              "requiredOnCitizenPortal": true,
              "isActive": true
          },
          {
              "id": 187,
              "code": null,
              "documentKey": "FS-PROVI-HOSPITAL_f0c37f2842d04268951338d1c15b7d65",
              "documentIdentifier": "STRUCTURAL_STABILITY_CERTIFICATE",
              "documentLabelEn": "Structural stability certificate",
              "documentLabelGuj": "માળખાકીય સ્થિરતા પ્રમાણપત્ર",
              "fieldIdentifier": "7",
              "formPart": "1",
              "dependentFieldName": null,
              "mandatory": true,
              "maxFileSizeInMB": 5,
              "requiredOnAdminPortal": true,
              "requiredOnCitizenPortal": true,
              "isActive": true
          },
          {
              "id": 188,
              "code": null,
              "documentKey": "FS-PROVI-HOSPITAL_ec3c336ceef544068c489ed6ec102657",
              "documentIdentifier": "TRAIN_FIRE_PERSON_LIST",
              "documentLabelEn": "Train Fire Person List with their name & Mobile No",
              "documentLabelGuj": "ટ્રેન ફાયર પર્સન લિસ્ટ તેમના નામ અને મોબાઇલ નંબર સાથે",
              "fieldIdentifier": "8",
              "formPart": "1",
              "dependentFieldName": null,
              "mandatory": false,
              "maxFileSizeInMB": 5,
              "requiredOnAdminPortal": true,
              "requiredOnCitizenPortal": true,
              "isActive": true
          },
          {
              "id": 189,
              "code": null,
              "documentKey": "FS-PROVI-HOSPITAL_e9b1d449434947a7b1ce0ee573185227",
              "documentIdentifier": "LIFT_APPROVAL_CERTIFICATE",
              "documentLabelEn": "Escalator / Lift approved by Govt. certificate",
              "documentLabelGuj": "સરકાર દ્વારા મંજૂર એસ્કેલેટર / લિફ્ટ. પ્રમાણપત્ર",
              "fieldIdentifier": "9",
              "formPart": "1",
              "dependentFieldName": null,
              "mandatory": false,
              "maxFileSizeInMB": 5,
              "requiredOnAdminPortal": true,
              "requiredOnCitizenPortal": true,
              "isActive": true
          },
          {
              "id": 190,
              "code": null,
              "documentKey": "FS-PROVI-HOSPITAL_bfb20acef73a4a73a54aae7858de6f01",
              "documentIdentifier": "FIRE_DRAWING_FLOOR_WISE",
              "documentLabelEn": "Fire Drawing floor wise i.e. also approved by competent Authority",
              "documentLabelGuj": "ફાયર ડ્રોઇંગ ફ્લોર મુજબની એટલે કે સક્ષમ અધિકારી દ્વારા મંજૂરી",
              "fieldIdentifier": "10",
              "formPart": "1",
              "dependentFieldName": null,
              "mandatory": false,
              "maxFileSizeInMB": 5,
              "requiredOnAdminPortal": true,
              "requiredOnCitizenPortal": true,
              "isActive": true
          }
      ]
  },
  "serviceFormId": 33,
  "createdDate": "2018-12-19 12:08:32",
  "updatedDate": "2018-12-19 18:32:16",
  "serviceType": "FS_PROVISIONAL_HOSPITAL_NOC",
  "fileStatus": "DRAFT",
  "deptFileStatus": null,
  "serviceName": null,
  "fileNumber": null,
  "pid": null,
  "outwardNo": null,
  "loiNumber": null,
  "firstName": "bhumika",
  "lastName": "barad",
  "middleName": null,
  "contactNo": "9558295586",
  "mobileNo": "9558295586",
  "email": "barad@gmail.com",
  "aadhaarNo": null,
  "agree": false,
  "paymentStatus": null,
  "canEdit": true,
  "canDelete": true,
  "canSubmit": true,
  "serviceCode": "FS-PROVI-HOSPITAL",
  "fieldView": "ALL",
  "fieldList": null,
  "applicantName": null,
  "applicantNameGuj": null,
  "hospitalNOCServiceType": "PROVISIONAL_HOSPITAL_NOC",
  "provisionalNocNumber": "6d2d4c1f933a4c8",
  "applicationDate": "2018-12-19",
  "oldReferenceNumber": null,
  "officeContactNo": "5788697568",
  "onsitePersonMobileNo": "7898965758",
  "workOfficeEmailId": "barad@gmail.com",
  "doctorName": "jbhj",
  "doctorNameGuj": "જ્ભ્જ",
  "medicalRegistrationNumber": "7878676897",
  "hospitalName": "hdjfkhdjk",
  "hospitalNameGuj": "હ્દ્જ્ફ્ખ્દ્જ્ક",
  "hospitalAddress": "hjfkgh\nnvdjgh\nvndfjkh",
  "hospitalAddressGuj": "હ્જ્ફ્ક્ઘ\nન્વ્દ્જ્ઘ\nવ્ન્દ્ફ્જ્ખ",
  "ownerName": "jfdghjhcbf",
  "ownerNameGuj": "જ્ફ્દ્ઘ્ઝબ્ફ",
  "ownerAddress": "cbvgf\nklmbfnjm\nnmkb",
  "ownerAddressGuj": "બ્વ્ગ્ફ\nક્લ્મ્બ્ફ્ન્જ્મ\nન્મ્ક્બ",
  "ownerMobileNo": "8797977897",
  "fpNo": "8787878787",
  "rsNo": "787878fgfd",
  "tikaNo": "bv786",
  "buildingLocation": "vyht7867867gvudyht587bgudyhtf786",
  "tpNo": null,
  "blockNo": "gyd67867",
  "opNo": "7678",
  "citySurveyNo": "df786587",
  "hospitalType": "daxgvd",
  "numberOfBed": 32,
  "numberOfOT": 0,
  "exerciseSection": 23,
  "drawingWithScale": false,
  "xraySection": 23,
  "laboratoryDepartment": "32",
  "otherInvestigation": "343",
  "storeDetails": "43",
  "kitchenDetails": "343",
  "buildingHeight": 343,
  "floorArea": 4,
  "gateDetailing": "34",
  "rampLiftStairDetails": "34",
  "liftDetails": "34",
  "noOfBasement": 343,
  "lowerBasement": 23,
  "upperBasement": 4,
  "totalBuildingFloor": 23,
  "basementArea": 23,
  "multipleTowers": false,
  "noOfTowers": 23,
  "noOfVentilation": 23,
  "ventilationProvision": null,
  "plotArea": 23,
  "constructedArea": 32,
  "noOfApproachedRoad": 23,
  "drawingProvided": false,
  "architectName": "xcvgdfxgfdh frgtrd rgtre",
  "architectNameGuj": "ક્ષવ્ગ્દ્ફ્ક્ષ્ગ્ફ્ધ ફ્ર્ગ્ત્ર્દ ર્ગ્ત્રેફબ્ગ",
  "architectFirmName": "fbv fgbbhyyygfv   ",
  "architectFirmNameGuj": "ફ્બ્વ ફ્ગ્બ્ભ્ય્ય્ય્ગ્ફ્વ   ",
  "architectRegistrationNumber": "dxfgvdcvbgf3454",
  "architectFirmNumber": "gvdfgh4564363",
  "architectContactNo": "4543543543",
  "noOfHospitalStaff": 3434,
  "noOfSecurityStaff": 433,
  "otherRisks": [
      "LPG",
      "Chemical Storage"
  ],
  "otherRiskDetail": null,
  "gasCylinderNOCDetail": "૩૪ફ્ગ્વ્દ્ગ્બ્વ્ફગ્બ",
  "anyStoreProvision": false,
  "stairCase": {
      "code": "EXTERNAL",
      "name": "External",
      "gujName": "બાહ્ય"
  },
  "trainedFiremanStaffKept": false,
  "exitGateDetail": "fght",
  "otherBusinessDetail": "gvbhfgbh",
  "riskSegregation": "fhfghgf",
  "anyEvacuationPlan": false,
  "evacuationDrillPerformed": false,
  "firefightingSystemAvailability": false,
  "yardHydrant": "fgbhdgh",
  "raiserAvailability": false,
  "noOfRaiser": 4343,
  "smokeDetector": false,
  "sprinkler": "3434",
  "fireAlarmAttachedWith": {
      "code": "RAISER",
      "name": "Raiser",
      "gujName": "રાઇઝર"
  },
  "autoExhaustSystem": "343fvgch",
  "electricalSafety": "3434fbgfg",
  "evacuationSignBoard": "dfvdsgfv",
  "refugeArea": "fgdhg",
  "travelDistance": 4334,
  "overHeadWaterTankCapacity": 343,
  "undergroundWaterTankCapacity": 3532,
  "alarmSystemTimeLimit": 343,
  "highestFloodLevel": 433,
  "riskAnalysisSurveyDetail": "434vb dgbgvgbhvgbhd",
  "parkingDetail": "3434",
  "nabhOwnership": "232vdfcgvdf",
  "lastThreeYearFireIncidents": "323fdgvfxcgv",
  "servingSince": "32cxvgbfdgb",
  "attachments": []
}
// **********

	  /**
     * @param fb - Declare FormBuilder property.
     * @param validationError - Declare validation service property
     * @param formService - Declare form service property 
     */
  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormsActionsService,
    private TranslateService: TranslateService,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private fireFacilitiesService:FireFacilitiesService
  ) { }

	/**
	 * This method call initially required methods.
	 */
  ngOnInit() {

    this.route.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.apiCode = param.get('apiCode');
      this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
      this.fireFacilitiesService.apiType =ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    });

    this.getLookupData();
    if (!this.formId) {
      this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
    }
    else {
      this.getprovisionaNocLicNewData();
      this.provisionalHospitalNocFormControls();

    }
  }

	/**
	 * Method is create required document array
	 */
  requiredDocumentList() {
    _.forEach(this.provisionalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
      if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
        this.uploadFilesArray.push({
          'labelName': value.documentLabelEn,
          'fieldIdentifier': value.fieldIdentifier,
          'documentIdentifier': value.documentIdentifier
        })
      }
    });
    //check for attachment is mandatory
    // this.dependentAttachment(this.provisionalHospitalNocForm.get('undergroundWatertankMapApproved').value, 'UNDERGROUND_WATER_TANK_MAP');
    // this.dependentAttachment(this.provisionalHospitalNocForm.get('overgroundWatertankMapApproved').value, 'OVERHEAD_WATER_TANK_MAP');
  }

	/**
	 * Method is handel depended documents (depended on form field value ).
	 * @param event 
	 * @param dependedKey 
	 */
  dependentAttachment(eventValue: any, dependedKey: string) {

    var control = (<FormArray>this.provisionalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments')).controls
    var fields = control.find((data) => data.get('documentIdentifier').value === dependedKey);

    if (eventValue && fields) {
      fields.get('mandatory').setValue(true);
      if (fields.get('isActive').value && fields.get('requiredOnCitizenPortal').value) {
        this.uploadFilesArray.push({
          'labelName': fields.get('documentLabelEn').value,
          'fieldIdentifier': fields.get('fieldIdentifier').value,
          'documentIdentifier': dependedKey
        })
      }
    } else {
      if (fields) {
        fields.get('mandatory').setValue(false);
        var indewx = this.uploadFilesArray.findIndex((data) => data.documentIdentifier === dependedKey)
        if (indewx != -1) {
          this.uploadFilesArray.splice(indewx, 1);
        }
      }
    }

  }

	/**
	 * Method is used to get form data
	 */
  getprovisionaNocLicNewData() {
    this.formService.getFormData(this.formId).subscribe(res => {

      try {
        this.provisionalHospitalNocForm.patchValue(res);
        this.showButtons = true;

        res.hospitalOTDetails.forEach(app => {
					(<FormArray>this.provisionalHospitalNocForm.get('hospitalOTDetails')).push(this.createOTDetailArray(app));
        });
        
        res.serviceDetail.serviceUploadDocuments.forEach(app => {
          (<FormArray>this.provisionalHospitalNocForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.createDocumentsGrp(app));
        });
        this.requiredDocumentList();

      } catch (error) {
        console.log(error.message)
      }
    });
  }

	/**
	* Method is used to get lookup data
	*/
  getLookupData() {
    this.formService.getDataFromLookups().subscribe(res => {
      this.FS_OTHER_RISKS = res.FS_OTHER_RISKS;
      this.FS_STAIR_CASE = res.FS_STAIR_CASE;
      this.FS_FIRE_ALARM_ATTACHED_WTIH = res.FS_FIRE_ALARM_ATTACHED_WTIH;
    });
  }

	/**
	 * Method is used to set form controls
	 * 'Guj' control is consider as a Gujarati fields
	 */
  provisionalHospitalNocFormControls() {
    this.provisionalHospitalNocForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      serviceCode: 'FS-PROVI-HOSPITAL',
      /* Step 1 controls start */
      provisionalNocNumber: [null],
      applicationDate: [null],
      oldReferenceNumber: [null],
      firstName: [null, [Validators.required, Validators.maxLength(100)]],
      lastName: [null, [Validators.required, Validators.maxLength(100)]],
      middleName: [null, Validators.maxLength(100)],
      contactNo: [null, [Validators.required, Validators.maxLength(10)]],
      officeContactNo: [null, [Validators.required, Validators.maxLength(10)]],
      onsitePersonMobileNo: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      workOfficeEmailId: [null, [Validators.required, Validators.maxLength(50)]],

      medicalRegistrationNumber: [null, [Validators.required, Validators.maxLength(15)]],
      doctorName: [null, [Validators.required, Validators.maxLength(100)]],
      doctorNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
      hospitalName: [null, [Validators.required, Validators.maxLength(50)]],
      hospitalNameGuj: [null, [Validators.required, Validators.maxLength(150)]],
      hospitalAddress: [null, [Validators.required, Validators.maxLength(300)]],
      hospitalAddressGuj: [null, [Validators.required, Validators.maxLength(900)]],
      ownerName: [null, [Validators.required, Validators.maxLength(100)]],
      ownerNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
      ownerAddress: [null, [Validators.required, Validators.maxLength(150)]],
      ownerAddressGuj: [null, [Validators.required, Validators.maxLength(300)]],
      ownerMobileNo: [null, [Validators.required, Validators.maxLength(10)]],

      fpNo: [null, [Validators.required, Validators.maxLength(10)]],
      rsNo: [null, [Validators.required, Validators.maxLength(10)]],
      tikaNo: [null, [Validators.required, Validators.maxLength(10)]],
      townPlanningNo: [null, [Validators.required, Validators.maxLength(10)]],
      buildingLocation: [null, [Validators.required, Validators.maxLength(50)]],
      blockNo: [null, [Validators.maxLength(10)]],
      opNo: [null, [Validators.required, Validators.maxLength(10)]],
      citySurveyNo: [null, [Validators.required, Validators.maxLength(10)]],

      hospitalType: [null, [Validators.maxLength(50)]],
      numberOfBed: [null, [Validators.required, Validators.maxLength(3)]],
      numberOfOT: [null, [Validators.required, Validators.maxLength(3)]],
      hospitalOTDetails: this.fb.array([]),
      exerciseSection: [null, [Validators.required, Validators.maxLength(3)]],
      xraySection: [null, [Validators.required, Validators.maxLength(3)]],
      laboratoryDepartment: [null, [Validators.required, Validators.maxLength(50)]],
      otherInvestigation: [null, [Validators.required, Validators.maxLength(200)]],
      storeDetails: [null, [Validators.required, Validators.maxLength(200)]],
      kitchenDetails: [null, [Validators.required, Validators.maxLength(50)]],
      drawingWithScale: [null, [Validators.required, Validators.maxLength(10)]],//true false
      buildingHeight: [null, [Validators.required, Validators.maxLength(50)]],
      floorArea: [null, [Validators.required, Validators.maxLength(3)]],
      gateDetailing: [null, [Validators.required, Validators.maxLength(50)]],
      rampLiftStairDetails: [null, [Validators.required, Validators.maxLength(50)]],
      liftDetails: [null, [Validators.required, Validators.maxLength(50)]],
      noOfBasement: [null, [Validators.required, Validators.maxLength(5)]],
      lowerBasement: [null, [Validators.required, Validators.maxLength(3)]],
      upperBasement: [null, [Validators.required, Validators.maxLength(3)]],
      totalBuildingFloor: [null, [Validators.required, Validators.maxLength(3)]],
      basementArea: [null, [Validators.required, Validators.maxLength(3)]],
      multipleTowers: [null, [Validators.required, Validators.maxLength(10)]],//true false
      noOfTowers: [null, [Validators.required, Validators.maxLength(3)]],
      noOfVentilation: [null, [Validators.required, Validators.maxLength(3)]],
      ventilationProvisionDetail: [null, [Validators.required, Validators.maxLength(20)]],
      plotArea: [null, [Validators.required, Validators.maxLength(5)]],
      constructedArea: [null, [Validators.required, Validators.maxLength(5)]],
      noOfApproachedRoad: [null, [Validators.required, Validators.maxLength(3)]],
      drawingProvided: [null, [Validators.required, Validators.maxLength(10)]],//true false

      architectRegistrationNumber: [null, [Validators.required, Validators.maxLength(15)]],
      architectName: [null, [Validators.required, Validators.maxLength(100)]],
      architectNameGuj: [null, [Validators.required, Validators.maxLength(300)]],
      architectFirmName: [null, [Validators.required, Validators.maxLength(50)]],
      architectFirmNameGuj: [null, [Validators.required, Validators.maxLength(150)]],
      architectFirmNumber: [null, [Validators.required, Validators.maxLength(20)]],
      architectContactNo: [null, [Validators.required, Validators.maxLength(10)]],
      noOfHospitalStaff: [null, [Validators.required, Validators.maxLength(4)]],
      noOfSecurityStaff: [null, [Validators.required, Validators.maxLength(4)]],
      otherRisks:[null],//array
      otherRiskDetail: [null, [Validators.maxLength(200)]],
      gasCylinderNOCDetail: [null, [Validators.required, Validators.maxLength(150)]],
      anyStoreProvision: [null, [Validators.required, Validators.maxLength(10)]],//true false
      stairCase: this.fb.group({
        code: [null, Validators.required]
      }),
      trainedFiremanStaffKept: [null, [Validators.required, Validators.maxLength(10)]],//true false
      exitGateDetail: [null, [Validators.required, Validators.maxLength(50)]],
      otherBusinessDetail: [null, [Validators.required, Validators.maxLength(50)]],
      riskSegregation: [null, [Validators.required, Validators.maxLength(50)]],
      anyEvacuationPlan: [null, [Validators.required, Validators.maxLength(10)]],//true false
      evacuationDrillPerformed: [null, [Validators.required, Validators.maxLength(10)]],//true false
      firefightingSystemAvailability: [null, [Validators.required, Validators.maxLength(10)]],//true false
      yardHydrant: [null, [Validators.maxLength(100)]],
      raiserAvailability: [null, [Validators.maxLength(10)]],//true false
      noOfRaiser: [null, [Validators.maxLength(5)]],
      smokeDetector: [null, [Validators.maxLength(10)]],//true false
      sprinkler: [null, [Validators.maxLength(50)]],
      fireAlarmAttachedWith: this.fb.group({
        code: [null]
      }),
      autoExhaustSystem: [null, [Validators.maxLength(50)]],
      electricalSafety: [null, [Validators.required, Validators.maxLength(50)]],
      evacuationSignBoard: [null, [Validators.required, Validators.maxLength(50)]],
      refugeArea: [null, [Validators.required, Validators.maxLength(50)]],
      travelDistance: [null, [Validators.required, Validators.maxLength(5)]],
      overHeadWaterTankCapacity: [null, [Validators.required, Validators.maxLength(10)]],
      undergroundWaterTankCapacity: [null, [Validators.required, Validators.maxLength(10)]],
      alarmSystemTimeLimit: [null, [Validators.required, Validators.maxLength(10)]],
      highestFloodLevel: [null, [Validators.required, Validators.maxLength(10)]],
      parkingDetail: [null, [Validators.required, Validators.maxLength(100)]],
      riskAnalysisSurveyDetail: [null, [Validators.required, Validators.maxLength(50)]],
      nabhOwnership: [null, [Validators.required, Validators.maxLength(50)]],
      lastThreeYearFireIncidents: [null, [Validators.required, Validators.maxLength(50)]],
      servingSince: [null, [Validators.required, Validators.maxLength(10)]],

      /* Step 6 controls start*/
      attachments: []
      /* Step 6 controls end */
    });
  }

	/**
	 * This Method for create attachment array in service detail
	 * @param data : value of array
	 */
  createDocumentsGrp(data?: any): FormGroup {
    return this.fb.group({
      // dependentFieldName: [data.dependentFieldName ? data.dependentFieldName : null],
      documentIdentifier: [data.documentIdentifier ? data.documentIdentifier : null],
      documentKey: [data.documentKey ? data.documentKey : null],
      documentLabelEn: [data.documentLabelEn ? data.documentLabelEn : null],
      documentLabelGuj: [data.documentLabelGuj ? data.documentLabelGuj : null],
      fieldIdentifier: [data.fieldIdentifier ? data.fieldIdentifier : null],
      formPart: [data.formPart ? data.formPart : null],
      id: [data.id ? data.id : null],
      isActive: [data.isActive],
      mandatory: [data.mandatory ? data.mandatory : false],
      maxFileSizeInMB: [data.maxFileSizeInMB ? data.maxFileSizeInMB : 5],
      requiredOnAdminPortal: [data.requiredOnAdminPortal],
      requiredOnCitizenPortal: [data.requiredOnCitizenPortal],
      // version: [data.version ? data.version : null]
    });
  }

  	/**
	 * Method is used to add more child in array.
   * @param length - number of row
	 */
	addOTDetail(length:number) {
   
   let returnArray = this.provisionalHospitalNocForm.get('hospitalOTDetails') as FormArray;
		if (returnArray.length >= length) {
			this.commonService.openAlert("Warning", "Maximum Limit "+length+" .", "warning");
		} else {
      returnArray.push(this.createOTDetailArray(returnArray));
		}
  }
    
  /**
	 * Method is used to return array
	 * @param data : person data array 
	 */
	createOTDetailArray(data?: any) {
		return this.fb.group({
			// serviceFormId: this.formId,
			id: data.id ? data.id : null,
			otFacilities: [data.otFacilities ? data.otFacilities : null, [Validators.maxLength(150)]],
			areaInSquareMeterLength: [data.areaInSquareMeterLength ? data.areaInSquareMeterLength : null, [Validators.maxLength(5)]],
      areaInSquareMeterBreadth: [data.areaInSquareMeterLength ? data.areaInSquareMeterLength : null, [Validators.maxLength(5)]],
      areaInSquareMeter: [data.areaInSquareMeterLength ? data.areaInSquareMeterLength : null, [Validators.maxLength(5)]],
		})

	}

	/**
	 * Method is used to delete OT information from hospitalOTDetails array.
	 * @param OTData - OT data.
	 * @param index - index of hospitalOTDetails array
	 */

	deleteOT(OTData: any, index: number) {
    let returnArray = this.provisionalHospitalNocForm.get('hospitalOTDetails') as FormArray;

		this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {
			if (this.provisionalHospitalNocForm.get('numberOfOT').value <= 0) {
				this.commonService.openAlert("Warning", "OT detail mandatory", "warning");
			} else {
				if (OTData.id == null) {
					returnArray.removeAt(index);
					this.provisionalHospitalNocForm.get('numberOfOT').setValue(this.provisionalHospitalNocForm.get('numberOfOT').value - 1);
					this.toastrService.success('OT details has been removed.')
				} else {
					//call api get response than delete
					this.fireFacilitiesService.deleteArrayData(this.provisionalHospitalNocForm.get('id').value, OTData.id).subscribe(respData => {
						if (respData.success) {
              returnArray.removeAt(index);
              this.provisionalHospitalNocForm.get('numberOfOT').setValue(returnArray.length);
							this.toastrService.success('OT details has been removed.')
						}
					})
				}

			}
		}
		);
	}

  /**
	 * add other risk detail in otherRisks array 
	 * @param event : on change event value
	 */
	otherRemark(event:Event){
		_.forEach(event,(value) => {
			if(value.code == 'OTHER'){
				this.otherRiskNote = true;
			}
			else{
				this.otherRiskNote = false
			}
		});
	}

	/**
     * This method required for final form submition.
     * @param flag - flag of invalid control.
     */
  handleErrorsOnSubmit(flag) {

    let step0 = 14;
    let step1 = 18;
    let step2 = 34;
    let step3 = 61;
    let step4 = 75;

    if (flag != null) {
      //Check validation for step by step
      let count = flag;
      // console.log(flag);
      if (count <= step0) {
        this.tabIndex = 0;
        return false;
      } else if (count <= step1) {
        this.tabIndex = 1;
        return false;
      } else if (count <= step2) {
        this.tabIndex = 2;
        return false;
      } else if (count <= step3) {
        this.tabIndex = 3;
        return false;
      } else if (count <= step4) {
        this.tabIndex = 4;
        return false;
      }
      // else if (count == 67) {
      // 	this.checkReligion();
      // 	return false;
      // }
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
	 * This method is handle depended documents on save event
	 * @param res - form response after save event
	 */
  handleOnSaveAndNext(res) {
    this.requiredDocumentList();
  }

  
    /**
     * temp methos
     */
    patchValue() {
      this.provisionalHospitalNocForm.patchValue(this.dummyJSON);
  }
}

