import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLicNewComponent } from './shop-lic-new.component';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddressComponent } from '../../../../../shared/components/address/address.component';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FilterAttachmentPipe } from '../common/pipes/filter-attachment.pipe';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../../../../shared/services/http.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ShopAndEstablishmentService } from '../common/services/shop-and-establishment.service';

describe('ShopLicNewComponent', () => {
  let component: ShopLicNewComponent;
  let fixture: ComponentFixture<ShopLicNewComponent>;
  let activatedRoute: MockActivatedRoute;

  beforeEach(() => {
    activatedRoute = new MockActivatedRoute();
  })

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShopLicNewComponent,
        TitleBarComponent,
        ControlMessagesComponent,
        GujInputSourceDirective,
        GujInputTargetDirective,
        AddressComponent,
        ActionBarComponent,
        ValidationFieldsDirective,
        FileUploadComponent,
        FilterAttachmentPipe
      ],
      imports: [
        BrowserAnimationsModule,
        TranslateModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterTestingModule,
        NgSelectModule,
        HttpClientTestingModule,
        ToastrModule.forRoot({
          timeOut: 5000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
          progressBar: true,
          closeButton: true
        })
      ],
      providers: [
        CommonService,
        ValidationService,
        FormsActionsService,
        SessionStorageService,
        HttpService,
        ShopAndEstablishmentService,
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLicNewComponent);
    component = fixture.componentInstance;
    activatedRoute.testParams = convertToParamMap({ id: 10, apiCode: "HEL-DUPMR" })
    fixture.detectChanges();
  });


  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('establishmentName field is required', async () => {
    let email = component.shopLicNewForm.get('establishmentName');
    let errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
  });

  it('Shop new licence should be valid', async () => {
    component.shopLicNewForm.patchValue({
      apiType: "shopLicense",
      serviceCode: "SHOP-LIC",
      establishmentName: "krishna",
      establishmentNameGuj: "ક્રિશ્ન",
      postalAddress: {
        id: 95,
        uniqueId: null,
        version: 0,
        addressType: "SHOP_LIC_POSTAL_ADDRESS",
        buildingName: "shapath 4 ",
        streetName: "Street",
        landmark: "Landmark",
        area: "area",
        state: "GUJARAT",
        district: null,
        city: "Vadodara",
        country: "INDIA",
        pincode: "380015",
        buildingNameGuj: "શપથ ૪ ",
        streetNameGuj: "શ્ત્રીત",
        landmarkGuj: "ળંદ્મર્ક",
        areaGuj: "અરેઅ",
        stateGuj: "ગુજરાત",
        districtGuj: null,
        cityGuj: "વડોદરા",
        countryGuj: "ભારત"
      },
      noOfHumanWorking: {
        code: "YES",
        name: "Yes"
      },
      assessmentDoneByVMC: {
        code: "YES",
        name: "Yes"
      },
      propertyTaxNo: "4156231212312",
      wardNo: {
        code: "SHIYABAG",
        name: "Shiyabag"
      },
      aadharNumber: "554561456456",
      professionalTaxPECNo: "ddd46564dc5456454545",
      prcNo: "dsss4454564654545645",
      applicantVimaAmountPaid: {
        code: "YES",
        name: "Yes"
      },
      number: "ABC5454ddmdjkkd55551",
      situationOfOffice: "Situation of establishment",
      nameOfEmployer: "Nascent",
      nameOfEmployerGuj: "ણસએંત",
      residentialAddressOfEmployer: "SG Highway shapath 4 Ahmedabad",
      residentialAddressOfEmployerGuj: "શ ઃઇઘ્વય શપથ ૪ આહ્મેદબદ",
      nameOfManager: "Name of manager",
      residentialAddressOfManager: "SG Highway shapath 4 Ahmedabad",
      categoryOfBusiness: {
        code: "COMMERCIAL_ESTABLISHMENT_MORE_THEN_TEN",
        name: "Commercial Establishment employing Ten or More Employees"
      },
      subCategoryOfBusiness: {
        code: "SHOP_LIC_B_DOCTORS_NURSING_HOME",
        name: "Doctors Layers Nursing home"
      },
      nameOfBusiness: "business name",
      nameOfBusinessGuj: "બુસિનેસ્સ નમે",
      commencementOfBusinessDate: "2018-11-02",
      enterHoliday: {
        code: "SHOP_LIC_SATURDAY"
      },
      periodFrom: null,
      periodTo: null,
      newRegistration: null,
      renewal: null,
      adminCharges: null,
      netAmount: null,
      employerFamilyList: [{
        serviceFormId: 83,
        id: 158,
        name: "employee",
        address: "address",
        serviceCode: "SHOP-LIC",
        relationship: {
          code: "SHOP_LIC_PARTNER"
        },
        gender: {
          code: "MALE"
        },
        age: 25,
        personType: "EMPLOYER_FAMILY"
      }],
      totalAdultEmployerFamily: 1,
      totalYoungEmployerFamily: 0,
      totalManEmployerFamily: 1,
      totalWomenEmployerFamily: 1,
      totalUnidentifiedEmployerFamily: 0,
      totalFamilyMembers: 1,
      occupancyList: [{
        serviceFormId: 83,
        id: 157,
        name: "person occupying name",
        address: "address",
        serviceCode: "SHOP-LIC",
        relationship: {
          code: "SHOP_LIC_EMPLOYEES_RESIDENT"
        },
        gender: {
          code: "MALE"
        },
        age: 56,
        personType: "OCCUPANCY"
      }],
      totalAdultOccupancy: 1,
      totalYoungOccupancy: 0,
      totalManOccupancy: 1,
      totalWomenOccupancy: 0,
      totalUnidentifiedOccupancy: 0,
      totalOccupancy: 1,
      typeOfOrganisation: {
        code: "SHOP_LIC_PARTNERSHIP"
      },
      partnerList: [{
        serviceFormId: 83,
        id: 156,
        name: "partner",
        address: "partner address",
        serviceCode: "SHOP-LIC",
        relationship: {
          code: "SHO_LIC_CEO"
        },
        gender: {
          code: "FEMALE"
        },
        age: 42,
        personType: "PARTNER"
      }],
      totalAdultPartner: 1,
      totalYoungPartner: 0,
      totalManPartner: 0,
      totalWomenPartner: null,
      totalUnidentifiedPartner: 0,
      totalPartner: 1,
      totalAdultEmployee: 2,
      totalYoungEmployee: 5,
      totalManEmployee: 7,
      totalWomenEmployee: 9,
      totalUnidentified: 4,
      totalEmployee: 27,
      attachments: [],
      id: 40,
      uniqueId: "2018-11-02-SHOP-LIC-BRU6ZVHR",
      version: 6,
      serviceFormId: 83,
      createdDate: null,
      updatedDate: "2018-11-02 11:57:51",
      serviceType: "SHOP_LIC",
      fileStatus: "DRAFT",
      serviceName: null,
      fileNumber: null,
      pid: null,
      outwardNo: null,
      agree: false,
      paymentStatus: null,
      canEdit: true,
      canDelete: true,
      canSubmit: true,
      firstName: null,
      middleName: null,
      lastName: null,
      aadhaarNo: null,
      contactNo: null,
      email: null,
      serviceDetail: {
        code: "SHOP-LIC",
        name: "Issue of New License",
        gujName: "નવા લાયસન્સનો ઇશ્યૂ",
        feesOnScrutiny: true
      }
    });
    expect(component.shopLicNewForm.valid).toBeTruthy();
  });


});


export class MockActivatedRoute {
  private paramsSubject = new BehaviorSubject(this.testParams);
  private _testParams: {};

  paramMap = this.paramsSubject.asObservable();

  get testParams() {
    return this._testParams;
  }

  set testParams(newParams) {
    this._testParams = newParams;
    this.paramsSubject.next(newParams);
  }
}