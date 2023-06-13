import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NewPropertyEntryAddService } from '../../Services/new-property-entry-add.service';
import { NewPropertyEntryAddDataSharingService } from '../../Services/new-property-entry-add-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { AddressModel, PropertyAddressDTO } from '../../Models/new-property-entry-add.model';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { PropertySearchSharingService } from 'src/app/vmcshared/component/property-search/property-search-sharing.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

@Component({
  selector: 'app-address-detail',
  templateUrl: './address-detail.component.html',
  styleUrls: ['./address-detail.component.scss']
})

export class AddressDetailComponent implements OnInit, OnDestroy {

  translateKey: string = 'newPropertyTaxScreen';
  addressModel: AddressModel;
  subReasonPropertyCreationList = [];
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];
  StateList = [{ itemId: "Gujarat", itemName: 'Gujarat' }];
  DistrictList = [{ itemId: "Vadodara", itemName: 'Vadodara' }];
  CityList = [{ itemId: "Vadodara", itemName: 'Vadodara' }];
  isValidForm: boolean = true;
  isPostalAddressEmpty: boolean = false;
  propertyModel: any = {};
  propertyModelSub: Subscription;
  modelProperty: any = {};
  subscription : Subscription;

  mask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/,  '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]; // ##-##-###-###-###
  maskedInputController;
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private newNewPropertyEntryAddDataSharingService: NewPropertyEntryAddDataSharingService,
    private propertySearchSharingService: PropertySearchSharingService,
    private newNewPropertyEntryAddService: NewPropertyEntryAddService,
    private commonService: CommonService,
    private alertService: AlertService,
    private element: ElementRef) {
    this.addressModel = new AddressModel();
    this.addressModel.propertyAddressDTO = new PropertyAddressDTO();
    this.addressModel.propertyAddressDTO.state = "Gujarat";
    this.addressModel.propertyAddressDTO.district = "Vadodara";
    this.addressModel.propertyAddressDTO.city = 'Vadodara'
    this.isValidForm = true;
    // use for censusNo Masking
    this.maskedInputController = textMask.maskInput({
      inputElement: this.element.nativeElement,
      mask: this.mask,
      guide: false,
      placeholderChar: '_',
      keepCharPositions: true,
      showMask:true
    });
  }

  ngOnInit() {
    this.getWardZoneLevel();
    this.propertyModelSub = this.propertySearchSharingService.getPropertyModel().subscribe(data => {
      if (data) {
        this.addressModel.serialNo = data.serialNo;
      }
    });

    let lookupcode = `lookup_codes=${Constants.LookupCodes.Property_sub_Reason_For_Creation}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.subReasonPropertyCreationList = Object.assign([], data).
                  filter(f => f.lookupCode.includes(Constants.LookupCodes.Property_sub_Reason_For_Creation))[0].items;
    });

    this.subscription = this.newNewPropertyEntryAddDataSharingService.getPropertyEditModel().subscribe(data => {
      if (data) {
        this.addressModel = data.propertyBasic;
        if (this.addressModel.level2Id) {
          this.getWardZone(this.addressModel.level1Id, 2)
        }
        if (this.addressModel.level3Id) {
          this.getWardZone(this.addressModel.level2Id, 3)
        }
        if (this.addressModel.level4Id) {
          this.getWardZone(this.addressModel.level3Id, 4)
        }
        this.addressModel.propertyAddressDTO.state = "Gujarat";
        this.addressModel.propertyAddressDTO.district = "Vadodara";
        this.addressModel.propertyAddressDTO.city = 'Vadodara'
        this.addressModel.propertyAddressDTO = data.propertyBasic.propertyAddressDTO
      }else{
        this.addressModel = new AddressModel();
        this.addressModel.propertyAddressDTO = new PropertyAddressDTO();
        this.addressModel.propertyAddressDTO.state = "Gujarat";
       this.addressModel.propertyAddressDTO.district = "Vadodara";
       this.addressModel.propertyAddressDTO.city = 'Vadodara'
      }
     
    });

  }

  ngOnDestroy() {
    this.propertyModelSub.unsubscribe();
    this.subscription.unsubscribe()
  }

  getWardZoneLevel() {
    this.newNewPropertyEntryAddService.getWardZoneLevel().subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel = data.body;
          this.wardZoneLevel.sort((a, b) => a.levelOrderSequence - b.levelOrderSequence);
          this.getWardZoneFirstLevel();
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      }
    )
  }

  onChangedWardZone(value, level) {
    if (level == 2) {
      this.wardZoneLevel2List = [];
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
      this.addressModel.level2Id = null;
      this.addressModel.level3Id = null;
      this.addressModel.level4Id = null;
    }
    else if (level == 3) {
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
      this.addressModel.level3Id = null;
      this.addressModel.level4Id = null;
    }
    else if (level == 4) {
      this.wardZoneLevel4List = [];
      this.addressModel.level4Id = null;
    }
    if (value)
      this.getWardZone(value, level)
  }

  getWardZoneFirstLevel() {
    this.newNewPropertyEntryAddService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel1List = data.body;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      })
  }

  getWardZone(parentId, level) {
    var postData = {};
    postData = { parentId: parentId };
    this.newNewPropertyEntryAddService.getWardZone(postData).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          if (level == 2) {
            this.wardZoneLevel2List = data.body;
          }
          else if (level == 3) {
            this.wardZoneLevel3List = data.body;
          }
          else if (level == 4) {
            this.wardZoneLevel4List = data.body;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      })
  }

  onChangeAddress() {
    var fullAddress = "";
    if (this.addressModel.propertyAddressDTO.houseNo) {
      fullAddress = fullAddress + `${this.addressModel.propertyAddressDTO.houseNo}, `;
    }
    if (this.addressModel.propertyAddressDTO.buildingName) {
      fullAddress = fullAddress + `${this.addressModel.propertyAddressDTO.buildingName}, `;
    }
    if (this.addressModel.propertyAddressDTO.societyName) {
      fullAddress = fullAddress + `${this.addressModel.propertyAddressDTO.societyName}, `;
    }
    if (this.addressModel.propertyAddressDTO.streetName) {
      fullAddress = fullAddress + `${this.addressModel.propertyAddressDTO.streetName}, `;
    }
    if (this.addressModel.propertyAddressDTO.landMark) {
      fullAddress = fullAddress + `${this.addressModel.propertyAddressDTO.landMark}, `;
    }
    if (this.addressModel.propertyAddressDTO.areaName) {
      fullAddress = fullAddress + `${this.addressModel.propertyAddressDTO.areaName}, `;
    }
    if (this.addressModel.propertyAddressDTO.pincode) {
      fullAddress = fullAddress + `Pin: ${this.addressModel.propertyAddressDTO.pincode}, `;
    }

    var address1 = "";
    if (this.addressModel.propertyAddressDTO.city) {
      address1 = address1 + `${this.addressModel.propertyAddressDTO.city}, `;
    }
    if (this.addressModel.propertyAddressDTO.district) {
      address1 = address1 + `${this.addressModel.propertyAddressDTO.district}, `;
    }
    if (this.addressModel.propertyAddressDTO.state) {
      address1 = address1 + `${this.addressModel.propertyAddressDTO.state}`;
    }

    var address2 = "";
    if (this.addressModel.propertyAddressDTO.fpNo) {
      address2 = address2 + `FP No: ${this.addressModel.propertyAddressDTO.fpNo}, `;
    }
    if (this.addressModel.propertyAddressDTO.plotPartNo) {
      address2 = address2 + `Plot Part No: ${this.addressModel.propertyAddressDTO.plotPartNo}, `;
    }
    if (this.addressModel.propertyAddressDTO.tpNo) {
      address2 = address2 + `TP No: ${this.addressModel.propertyAddressDTO.tpNo}, `;
    }
    if (this.addressModel.propertyAddressDTO.serveyNo) {
      address2 = address2 + `Revenue Survey No: ${this.addressModel.propertyAddressDTO.serveyNo}, `;
    }
    fullAddress = fullAddress + address1;
    if (address2 != '') {
      if (address2 != '')
        address2 = address2.substring(0, address2.length - 2);
      fullAddress = address2 + '\n' + fullAddress;
    }

    this.addressModel.propertyAddressDTO.propertyAddress = fullAddress;
    if (!this.addressModel.propertyAddressDTO.isPostalAddressDiff) {
      this.addressModel.propertyAddressDTO.postalAddress = fullAddress;
    }

    if (!this.isValidForm) {
      this.checkIsValidAddress();
    }
  }

  onSubmit(form: NgForm) {
    this.checkIsValidAddress();

    if (form.form.valid && this.isValidForm) {
      this.addressModel.entryModeLookupCode = Constants.ItemCodes.Application;
      this.addressModel.reasonForCreationItemCode = Constants.ItemCodes.New;
      this.addressModel.applicationNumber = this.commonService.applicationNo;
      this.newNewPropertyEntryAddService.saveBasic(this.addressModel).subscribe(
        (data) => {
          this.addressModel.propertyBasicId = data.body.data;
          this.newNewPropertyEntryAddDataSharingService.updateDataSourceProperty(this.addressModel);
          this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(2);
        },
        (error) => {
          this.commonService.callWarningResponse(error);
        });
    }
  }

  checkIsValidAddress() {
    if (!this.addressModel.propertyAddressDTO.houseNo && !this.addressModel.propertyAddressDTO.buildingName &&
      !this.addressModel.propertyAddressDTO.societyName && !this.addressModel.propertyAddressDTO.streetName &&
      !this.addressModel.propertyAddressDTO.landMark && !this.addressModel.propertyAddressDTO.areaName) {
      this.isValidForm = false;
    }
    else {
      this.isValidForm = true;
    }
  }


  checkIsPostalAddressEmpty(event) {
    this.isPostalAddressEmpty = false;
    if (!event.control.value) {
      event.control.status = 'INVALID';
    }
    if (event.control.value && event.control.value.toString().trim() == '') {
      event.control.status = 'INVALID';
    }
  }

  onSearchSRNo() {
    this.propertySearchSharingService.setIsOpenSearchForm(true);
  }

  changePostalAddressCheckBox(){
    if(this.addressModel.propertyAddressDTO.isPostalAddressDiff) {
      this.addressModel.propertyAddressDTO.postalAddress = '';
    } else {
      this.addressModel.propertyAddressDTO.postalAddress = this.addressModel.propertyAddressDTO.propertyAddress;
    }
  }

  onBackClick() {
    this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(0);
  }

  onBlurReferenceProperty(inValid){
    if(inValid){
      this.addressModel.referencePropertyNo = '';
    }
  }


  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.element.nativeElement.value;
    this.addressModel.oldPropertyNo = current;
  }
}
