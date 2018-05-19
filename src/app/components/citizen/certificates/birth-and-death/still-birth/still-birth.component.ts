
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper'

import { CommonService } from '../../.././../../shared/services/common.service'
import { UploadFileService } from '../../../../../shared/upload-file.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ManageRoutes } from '../../../../../config/routes-conf';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-still-birth',
  templateUrl: './still-birth.component.html',
  styleUrls: ['./still-birth.component.scss']
})

export class StillBirthComponent implements OnInit {


  @ViewChild('stepper') stepper: MatStepper;
  translateKey: string = 'stillBirthScreen';

	/**
	 * file upload related declaration
	 */
  uploadModel: any = {};
  private attachments: any[] = [];
  prevMode: boolean = false;

	/**
	 * form related helping data.
	 */
  appId: number;
  public stillBirthCertificateForm: FormGroup;
  private minBirthDate: any;
  private maxBirthDate = new Date();
  private showButtons: boolean = false;
  private submit: boolean = false;
  apiCode: string;

  /**
   * Still Birth Data LookUps.
   */
  private BirthPlaces: object[];
  private Gender: Object[];
  private FatherEducations: object[];
  private FatherOccupation: object[];
  private MotherEducations: object[];
  private MotherOccupation: object[];
  private DeliveryTreatmentOptions: object[];
  private TypeOfDelivery: object[];
  private Religion: object[];
  private ChildWeights: object[];
  private ISYESNO: object[];
  private checked: boolean;

  /**
   * Address Look Ups.
   */
  private States: Object[] = [
    {
      id: 1,
      name: 'Andhra Pradesh'
    },
    {
      id: 2,
      name: 'Assam'
    },
    {
      id: 3,
      name: 'Gujarat'
    },
    {
      id: 4,
      name: 'Chhattisgarh'
    },
    {
      id: 5,
      name: 'Kerala'
    },
    {
      id: 6,
      name: 'Rajasthan'
    }
  ];
  private District: Object[] = [
    {
      id: 1,
      name: 'Surat'
    },
    {
      id: 2,
      name: 'Vadodara'
    },
    {
      id: 3,
      name: 'Gandhinagar'
    },
    {
      id: 4,
      name: 'Ahmedabad'
    },
    {
      id: 5,
      name: 'Anand'
    },
    {
      id: 6,
      name: 'Jamnagar'
    }
  ];
  private City: Object[] = [
    {
      id: 1,
      name: 'Surat'
    },
    {
      id: 2,
      name: 'Vadodara'
    },
    {
      id: 3,
      name: 'Gandhinagar'
    },
    {
      id: 4,
      name: 'Ahmedabad'
    },
    {
      id: 5,
      name: 'Anand'
    },
    {
      id: 6,
      name: 'Jamnagar'
    }

  ];
  private Country: Object[] = [
    {
      id: 1,
      name: 'UK',
      code: 'uk'
    },
    {
      id: 2,
      name: 'US',
      code: 'us'
    },
    {
      id: 3,
      name: 'India',
      code: 'in'
    },
    {
      id: 4,
      name: 'France',
      code: 'fr'
    },
    {
      id: 5,
      name: 'Brazil',
      code: 'br'
    },
    {
      id: 6,
      name: 'China',
      code: 'ch'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormsActionsService,
    private uploadFileService: UploadFileService,
    private commonService: CommonService,
    private validationService: ValidationService,
    private fb: FormBuilder) {
  }

  /**
   * Method initialized First.
   */
  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.appId = Number(param.get('id'));
      this.apiCode = param.get('apiCode');
      this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    });
    this.createStillBirthForm();
    this.getStillBirthFormData();
    this.getLookUpData();
  }

  /**
   * Method is used to create still birth certificate form.
   */
  createStillBirthForm() {
    this.stillBirthCertificateForm = this.fb.group({

      //step 1 controls
      birthDate: [null, [Validators.required]],
      birthTime: [null, [Validators.required]],
      childName: [null, [ValidationService.nameValidator]],
      birthPlace: this.fb.group({
        id: null,
        code: [null, [Validators.required]],
        name: null
      }),
      weightKg: this.fb.group({
        id: null,
        code: [null, Validators.required],
        name: null
      }),
      weightGram: [null, [Validators.pattern('[0-9]+')]],
      gender: this.fb.group({
        id: null,
        code: [null, [Validators.required]],
        name: null
      }),
      isOrphan: this.fb.group({
        id: null,
        code: [null, Validators.required],
        name: null
      }),
      isTwins: this.fb.group({
        id: null,
        code: [null, Validators.required],
        name: null
      }),

      //step 2
      fatherFirstName: [null, [ValidationService.nameValidator,Validators.required]],
      fatherMiddleName: [null,[Validators.nullValidator]],
      fatherLastName: [null, [ValidationService.nameValidator,Validators.required]],
      fatherEducation: this.fb.group({
        id: null,
        code: [null, [Validators.required]],
        name: null
      }),
      fatherOccupations: this.fb.group({
        id: null,
        code: [null, [Validators.required]],
        name: null
      }),
      fatherAadharNumber: [null, [ValidationService.aadharValidation]],

      //step 3
      motherFirstName: [null, [ValidationService.nameValidator, Validators.required]],
      motherMiddleName: [null, ValidationService.nameValidator],
      motherLastName: [null, [ValidationService.nameValidator, Validators.required]],
      motherEducation: this.fb.group({
        id: null,
        code: [null, Validators.required],
        name: null
      }),
      motherOccupations: this.fb.group({
        id: null,
        code: [null, Validators.required],
        name: null
      }),
      motherAadharNumber: [null, [ValidationService.aadharValidation]],
      motherPrevRegNumber: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      petaKendraNumber: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      motherMarriageAge: [null, [Validators.minLength(2), Validators.maxLength(2), Validators.required]],
      motherDeliveryAge: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],

      deliveryTreatment: this.fb.group({
        id: null,
        code: [null,[Validators.required]],
        name: null
      }),
      deliveryType: this.fb.group({
        id: null,
        code: [null, Validators.required],
        name: null
      }),
      pregnancyDuration: ['', [Validators.required]],
      prematureInfantReason: ['', [Validators.required]],

      //step 4
      parentDeliveryAddress: this.fb.group({
        id: null,
        uniqueId: null,
        version: 0,
        addressType: null,
        houseNo: null,
        tenamentNo: null,
        buildingName: null,
        state: "GUJARAT",
        district: "Vadodara",
        talukaName: null,
        pincode: null,
        addressLine1: null,
        addressLine2: null,
        addressLine3: null,
        village: null
      }),
      isPermanentPresentAddressSame: this.fb.group({
        id: null,
        code: null,
        name: null
      }),
      parentPermanentAddress: this.fb.group({
        id: null,
        uniqueId: null,
        version: 0,
        addressType: null,
        houseNo: null,
        tenamentNo: null,
        buildingName: null,
        state: "GUJARAT",
        district: "Ahmedabad",
        talukaName: null,
        pincode: null,
        addressLine1: null,
        addressLine2: null,
        addressLine3: null,
        village: null
      }),
      familyReligion: this.fb.group({
        id: null,
        code: null,
        name: null
      }),

      relationWithApplicant: this.fb.group({
        id: null,
        code: null,
        name: null
      }),

      //applicant details
      applicantHospitalName: [null, [ValidationService.nameValidator]],
      applicantAddress: this.fb.group({
        id: null,
        uniqueId: null,
        version: 0,
        addressType: null,
        houseNo: null,
        tenamentNo: null,
        buildingName: null,
        state: "GUJARAT",
        district: "Ahmedabad",
        talukaName: null,
        pincode: null,
        addressLine1: null,
        addressLine2: null,
        addressLine3: null,
        village: null
      }),
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
    })
  }

  /**
   * Method is used to get saved still birth certificate form.
   */
  getStillBirthFormData() {
    this.formService.getFormData(this.appId).subscribe(res => {
      console.log(res);
      this.attachments = res.attachments;
      this.stillBirthCertificateForm.patchValue(res);
      this.showButtons = true;
      
      if (res.fileStatus == "SUBMITTED") {
        this.prevMode = true;
        this.stillBirthCertificateForm.disable();
      }
    });
  }

  /**
   * Method is used to get LookUps related to still birth certificate form.
   */
  getLookUpData() {
    this.formService.getDataFromLookups().subscribe(respData => {
      this.ChildWeights = respData.CHILD_WEIGHT;
      this.DeliveryTreatmentOptions = respData.DELIVERY_TREATMENT;
      this.TypeOfDelivery = respData.DELIVERY_TYPE;
      this.FatherEducations = respData.EDUCATION;
      this.MotherEducations = respData.EDUCATION;
      this.FatherOccupation = respData.OCCUPATIONS;
      this.MotherOccupation = respData.OCCUPATIONS;
      this.Gender = respData.GENDER;
      this.BirthPlaces = respData.PLACE;
      this.Religion = respData.RELIGION;
      this.ISYESNO = respData.YES_NO;
    })
  }

  /**
	 * Method is used to calculate the delay between current date and birth date.
	 * @param event - date event.
	 */
  delayCalculator(event) {
    let now = moment(new Date());
    let diff = moment.duration(now.diff(event.value));
    this.stillBirthCertificateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
  }

  /**
   * 
   */
  timepick() {
    if (String(this.stillBirthCertificateForm.get('birthTime').value).length == 5) {
      this.stillBirthCertificateForm.get('birthTime').
        setValue(String(this.stillBirthCertificateForm.get('birthTime').value).concat(":00"));
    }
  }

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
  handleErrorsOnSubmit(count) {
    this.submit = true;
    let step1 = 9;
    let step2 = 15;
    let step3 = 29;
    let step4 = 33;
    let step5 = 37;

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
    }
  }

  /** 
	 * Method to change birthdate into desired (YYYY-MM-DD) formet.
	 * @param event - date picker event.
	 */
  birthFormetChanger(event) {
    this.stillBirthCertificateForm.get('birthDate').setValue(moment(event.value).format("YYYY-MM-DD"));
  }

	/**
	 * Method is used to make permanent and delivery address similar if user check it.
	 * @param event - checkbox event.
	 */
  check(event) {

    let parentPermanentAddressType = this.stillBirthCertificateForm.get('parentPermanentAddress').get('addressType').value
    if (event.checked) {
      this.stillBirthCertificateForm.value.isPermanentPresentAddressSame.code = "YES";
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('houseNo').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('houseNo').value);
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('tenamentNo').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('tenamentNo').value);
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('buildingName').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('buildingName').value);
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('state').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('state').value);
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('district').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('district').value);
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('talukaName').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('talukaName').value);
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('pincode').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('pincode').value);
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('addressLine1').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('addressLine1').value);
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('addressLine2').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('addressLine2').value);
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('addressLine3').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('addressLine3').value);
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('village').setValue(this.stillBirthCertificateForm.get('parentDeliveryAddress').get('village').value);
    } else if (!event.checked) {
      this.stillBirthCertificateForm.value.isPermanentPresentAddressSame.code = "NO";
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('houseNo').reset();
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('tenamentNo').reset();
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('buildingName').reset();
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('state').reset();
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('district').reset();
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('talukaName').reset();
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('pincode').reset();
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('addressLine1').reset();
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('addressLine2').reset();
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('addressLine3').reset();
      this.stillBirthCertificateForm.get('parentPermanentAddress').get('village').reset();
    }
  }

	/**
	 * Method is used to reset form its a output event from action bar.
	 */
  stepReset() {
    this.stepper.reset();
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
      serviceFormId: this.appId,
    }
    return this.uploadModel;
  }
}
