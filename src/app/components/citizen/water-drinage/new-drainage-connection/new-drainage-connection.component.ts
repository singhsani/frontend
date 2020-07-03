import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { TranslateService } from 'src/app/shared/modules/translate/translate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { TaxRebateApplicationService } from '../../tax/property/tax-rebate-application/Services/tax-rebate-application.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { NewWaterConnectionEntryService } from '../../tax/water-supply/new-water-connection-entry/Services/new-water-connection-entry.service';
import { WaterDrinageConfig} from '../water-drinage-config';
import * as _ from 'lodash';
import { CommonService } from 'src/app/vmcshared/Services/common-service';


 
@Component({
  selector: 'app-new-drainage-connection',
  templateUrl: './new-drainage-connection.component.html',
  styleUrls: ['./new-drainage-connection.component.scss']
})
export class NewDrainageConnectionComponent implements OnInit {

  formId: number;
  apiCode: string;

  
  newDrainageConnectionForm: FormGroup;
  translateKey: string = 'newDrainageConnectionKey';

  tabIndex: number = 0;

  uploadFilesArray: Array<any> = [];
  wardZoneLevel = [];
  wardZoneLevel1List = [];
  wardZoneLevel2List = [];
  wardZoneLevel3List = [];
  wardZoneLevel4List = [];

  connectionUsageList = [];
  connectionSubUsageList = [];

  config: WaterDrinageConfig = new WaterDrinageConfig();
  public showButtons: boolean = true;
  ispostalAddressDiff  : boolean = false; 

  plumberList: any = [];
  limitList = [];
  isOutofLimit: boolean = false;
  displayedColumns = ['propertyNo', 'ownerName', 'address', "actions"];
  dataSource = [];
  isShowPropertyGrid = false;
  waterDrainageConnPropertyDetailsDTOList = [];
  isprimaryProperty : boolean = false;
  propertyaryy = [];

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService,
    public translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private formService: FormsActionsService,
    private taxRebateApplicationService: TaxRebateApplicationService,
    private newWaterConnectionEntryService: NewWaterConnectionEntryService,
    private alertService: AlertService,
    private commonService: CommonService,
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.apiCode = param.get('apiCode');
      this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    });

    if (!this.formId) {
      this.router.navigate([ManageRoutes.getFullRoute('CITIZENDASHBOARD')]);
    }else{
      this.newDrainageConnectionFormControls();
      this.getWardZoneLevel();
      this.getUsageList();
      this.getDrainageConnectionNewData();
      this.getPlumberList();
      this.getFormData(this.formId);
    }
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Water_Within_Limit}&lookup_codes=${Constants.LookupCodes.Connection_Type}`
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
     
      this.limitList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Water_Within_Limit))[0].items;
     
    });
  
  }

  onChangedLimit(val) {
    if (val) {
      var objLimit = this.limitList.filter(f => f.itemId == val)[0];
      if (objLimit.itemCode == Constants.ItemCodes.Out_of_Limit) {
        this.isOutofLimit = true;
      }
      else {
        this.isOutofLimit = false;
      }
    }
  }
  onTabChange(evt) {
    this.tabIndex = evt;
  }

  /**
   * this method is used to get drainage pipeline connection data
   * 
   */
  getDrainageConnectionNewData() {
    this.formService.getFormData(this.formId).subscribe(res => {
      try {
        this.newDrainageConnectionForm.patchValue(res);
        this.showButtons = true;
        this.dataSource = res.waterDrainageConnPropertyDetailsDTOList;
       
       if(this.dataSource.length != 0) {
        this.isShowPropertyGrid = true; 
      }
      } catch (error) {
        console.log(error.message)
      }
    });
  }
  handleErrorsOnSubmit(flag) {
    
    console.log("flag", flag);
    let step0 = 11;
    let step1 = 26;

    if (flag != null) {
      //Check validation for step by step
      let count = flag;

      if (count <= step0) {
        this.tabIndex = 0;
        return false;
      } else if (count <= step1) {
        this.tabIndex = 1;
        return false;
      }
      else {
        console.log("else condition");
      }

    }
  }

  deleteProperty(data){

    this.dataSource = this.waterDrainageConnPropertyDetailsDTOList;
   
    const index = this.dataSource.indexOf(data.propertyNo);
    this.dataSource.splice(index, 1);

    if(this.dataSource.length == 0) {
      this.isShowPropertyGrid = false;
      this.waterDrainageConnPropertyDetailsDTOList=[];
      this.isprimaryProperty = false;
    }

  }
  getPropertyAddressDetail() {
    
    this.newWaterConnectionEntryService.getPropertyAddress(this.newDrainageConnectionForm.get('propertyNo').value).subscribe(
      (data) => {
        if (data.status === 200) {
          if(this.newDrainageConnectionForm.get('primaryProperty').value != this.isprimaryProperty){
            this.isprimaryProperty = true;
          this.getPropertyValues(data.body.propertyBasic.propertyAddressDTO);
          
          let temojb = { 'propertyNo' :  data.body.propertyBasic.propertyNo ,
          'ownerName' :  data.body.propertyOwners[0].firstName , 
           'address' :data.body.propertyBasic.propertyAddressDTO.propertyAddress }
          this.waterDrainageConnPropertyDetailsDTOList.push(temojb);
          
          let propertyObj = {'primaryProperty': this.newDrainageConnectionForm.get('primaryProperty').value , 'propertyNo':this.newDrainageConnectionForm.get('propertyNo').value};
          this.propertyaryy.push(propertyObj);
          
          this.dataSource = [];
          
          this.dataSource = this.waterDrainageConnPropertyDetailsDTOList;
          this.dataSource = this.dataSource.slice();
          this.isShowPropertyGrid = true;
          
          this.getFormsArray().push(this.createFormGroup("waterDrainageConnPropertyDetailsDTOList", {}));
          
          this.newDrainageConnectionForm.get('waterDrainageConnPropertyDetailsDTOList').setValue(this.propertyaryy);
          
          if(this.newDrainageConnectionForm.get('primaryProperty').value){
            this.newDrainageConnectionForm.get('primaryProperty').setValue(this.newDrainageConnectionForm.get('primaryProperty').value);
            this.newDrainageConnectionForm.get('propertyNo').setValue(this.newDrainageConnectionForm.get('propertyNo').value)
          }else{
            this.newDrainageConnectionForm.get('primaryProperty').reset();
            this.newDrainageConnectionForm.get('propertyNo').reset();
            
          }
        
        if(this.dataSource.length == 0) {
          this.isShowPropertyGrid = false;
        }
      
        }else{
          this.alertService.info("you can add only one primary property");
        }
      }
      },
      (error) => {
        this.alertService.error(error.error.message);
      });
  }

  createFormGroup(key: string, data: any): FormGroup {

		let formGroupData: FormGroup;
			
     formGroupData = this.fb.group({
      propertyNo: [null],
      primaryProperty : [null]
    })
    return formGroupData;
      }
  getFormData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
      console.log("Get form data", res);
      if(res.waterDrainageWardId) {
        this.getWardZone(res.waterDrainageZoneId, 2);
      }
      if(res.waterDrainageBlockId){
        this.getWardZone(res.waterDrainageWardId,3);
      }
      if(res.connectionUsage){
        this.getSubUsageList(res.connectionUsage)
      }
      res.serviceDetail.serviceUploadDocuments.forEach(app => {
        (<FormArray>this.newDrainageConnectionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
      });
      this.requiredDocumentList();
    })
  }
  requiredDocumentList() {
    this.uploadFilesArray = [];
    _.forEach(this.newDrainageConnectionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
      if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
        this.uploadFilesArray.push({
          'labelName': value.documentLabelEn,
          'fieldIdentifier': value.fieldIdentifier,
          'documentIdentifier': value.documentIdentifier
        })
      }
    });
    console.log("uploadFileArray", this.uploadFilesArray);
    //check for attachment is mandatory
    //	this.dependentAttachment(this.waterPipeliConnectionForm.get('undergroundWatertankMapApproved').value, 'UNDERGROUND_WATER_TANK_MAP');
    //this.dependentAttachment(this.waterPipeliConnectionForm.get('overgroundWatertankMapApproved').value, 'OVERHEAD_WATER_TANK_MAP');
  }

  newDrainageConnectionFormControls() {
    this.newDrainageConnectionForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      /* Step 1 controls start */
      drainageConnectionNo: [null],
      oldDrainageConnectionNo: [null],
      aadharNo: [null, [Validators.maxLength(12)]],
      ownerName: [null, [Validators.required]],
      mobileNo: [null, [Validators.maxLength(10)]],
      ownerEmailId: [null],
      
      limit: [null],
      waterDrainageZoneId: [null, [Validators.required]],
      waterDrainageWardId: [null, [Validators.required]],
      waterDrainageBlockId: [null, [Validators.required]],

      electricityConnectionNo : [null],
      gasConnectionNo : [null],
      buildingPermissionNo : [null],
      completionCertificateNo : [null],
      occupancyCertificateNo : [null],


      connectionUsage: [null, [Validators.required]],
      connectionSubUsage: [null, [Validators.required]],
      plumberId: [null, [Validators.required]],
      propertyNo: [null, [Validators.required]],
      primaryProperty: [null, [Validators.required]],
      fpNo: [null, [Validators.required]],
      plotPartNo: [null, [Validators.required]],
      tpNo: [null, [Validators.required]],
      serveyNo: [null, [Validators.required]],
      houseNo: [null, [Validators.required]],
      buildingName: [null, [Validators.required]],
      societyName: [null, [Validators.required]],
      streetName: [null, [Validators.required]],
      pincode: [null, [Validators.required]],
      postalAddress: [null],
      postalAddressDiff: [null],
      propertyAddress: [null],
      waterDrainageConnPropertyDetailsDTOList: this.fb.array([]),
    }, {});
  }

  getPropertyValues(data : any){
    this.newDrainageConnectionForm.get('fpNo').setValue(data.fpNo);
    this.newDrainageConnectionForm.get('plotPartNo').setValue(data.plotPartNo);
    this.newDrainageConnectionForm.get('tpNo').setValue(data.tpNo);
    this.newDrainageConnectionForm.get('serveyNo').setValue(data.serveyNo);
    this.newDrainageConnectionForm.get('houseNo').setValue(data.houseNo);
    this.newDrainageConnectionForm.get('buildingName').setValue(data.buildingName);
    this.newDrainageConnectionForm.get('societyName').setValue(data.societyName);
    this.newDrainageConnectionForm.get('streetName').setValue(data.streetName);
    this.newDrainageConnectionForm.get('pincode').setValue(data.pincode);
    this.newDrainageConnectionForm.get('postalAddress').setValue(data.postalAddress);
    this.newDrainageConnectionForm.get('propertyAddress').setValue(data.postalAddress);
    this.ispostalAddressDiff = true;
  }

  onChangeAddress() {
    var fullAddress = "";
    if (this.newDrainageConnectionForm.get('houseNo').value) {
      fullAddress = fullAddress + this.newDrainageConnectionForm.get('houseNo').value +',';
    }
    if (this.newDrainageConnectionForm.get('buildingName').value) {
      fullAddress = fullAddress + this.newDrainageConnectionForm.get('buildingName').value + ',';
    }
    if (this.newDrainageConnectionForm.get('societyName').value) {
      fullAddress = fullAddress + this.newDrainageConnectionForm.get('societyName').value +',';
    }
    if (this.newDrainageConnectionForm.get('streetName').value) {
      fullAddress = fullAddress + this.newDrainageConnectionForm.get('streetName').value + ',';
    }
    if (this.newDrainageConnectionForm.get('pincode').value) {
      fullAddress = fullAddress + this.newDrainageConnectionForm.get('pincode').value +',';
    }
    

    var address2 = "";
    if (this.newDrainageConnectionForm.get('fpNo').value) {
      address2 = address2 + 'FP No: '+this.newDrainageConnectionForm.get('fpNo').value +',';
    }
    if (this.newDrainageConnectionForm.get('plotPartNo').value) {
      address2 = address2 + 'Plot Part No: '+this.newDrainageConnectionForm.get('plotPartNo').value + ',';
    }
    if (this.newDrainageConnectionForm.get('tpNo').value) {
      address2 = address2 + 'TP No: '+this.newDrainageConnectionForm.get('tpNo').value + ',';
    }
    if (this.newDrainageConnectionForm.get('serveyNo').value) {
      address2 = address2 + 'Survey No: '+this.newDrainageConnectionForm.get('serveyNo').value +',';
    }
    fullAddress = fullAddress;
    if (address2 != '') {
      fullAddress =  address2 + '\n' + fullAddress;
    }
    if (fullAddress != '' && address2 != '')
      fullAddress = fullAddress.substring(0, fullAddress.length - 2);
    
      this.newDrainageConnectionForm.get('postalAddress').setValue(fullAddress);
      this.newDrainageConnectionForm.get('propertyAddress').setValue(fullAddress);
    
  }

  eventCheck(event){
    if(event.checked){
      this.ispostalAddressDiff = true;
    }else{
      this.ispostalAddressDiff = false;
    }
  }

  getWardZoneLevel() {
    this.taxRebateApplicationService.getWardZoneLevel().subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel = data.body;
          console.log('wardZoneLevel', this.wardZoneLevel);
          this.wardZoneLevel.sort((a, b) => a.levelOrderSequence - b.levelOrderSequence);
          this.getWardZoneFirstLevel();
        }
      },
      (error) => {
        console.log('error', error);
      }
    )
  }

  getWardZoneFirstLevel() {
    this.taxRebateApplicationService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
      (data) => {
       if (data.status === 200 && data.body.length) {
          this.wardZoneLevel1List = data.body;
          
        }
      },
      (error) => {
        console.log('error', error);
      })
  }

  onChangedWardZone(value, level) {
    if (level == 2) {
      //this.waterPipeliConnectionForm.controls.waterPipelineWard.setValue();
      this.wardZoneLevel2List = [];
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
    }
    else if (level == 3) {
      this.wardZoneLevel3List = [];
      this.wardZoneLevel4List = [];
    }
    else if (level == 4) {
      this.wardZoneLevel4List = [];
    }
    if (value)
      this.getWardZone(value, level)
  }

  getPlumberList() {
    this.newWaterConnectionEntryService.getPlumberList({ licenseFor: Constants.ItemCodes.License_Water, activeOnly: true }).subscribe(
      (data) => {
       if (data.status === 200 && data.body.length) {
          this.plumberList = data.body;
          console.log("plumber list", this.plumberList)
          //TODO Ask to nikulbhai about filter plumber list

          // this.filteredPlumerList = this.plumerCtrl.valueChanges
          //   .pipe(
          //     startWith(''),
          //     map(f => f ? this.filterPlumber(f) : this.plumberList.slice())
          //   );
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
  }

  getFormsArray(): FormArray {
		let formArrayData: FormArray;
	
				formArrayData = this.newDrainageConnectionForm.get('waterDrainageConnPropertyDetailsDTOList') as FormArray;
				
	
		return formArrayData;
	}

  getWardZone(parentId, level) {
    var postData = {};
    postData = { parentId: parentId };
    this.taxRebateApplicationService.getWardZone(postData).subscribe(
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
        console.log('error', error);
      })
  }

  onChangedConnectionUsage(val) {
    console.log("value", val)
    this.connectionSubUsageList = null;
    if (val)
      this.getSubUsageList(val);
  }

  getUsageList() {
    this.newWaterConnectionEntryService.getUsageList({ active: true }).subscribe(
      (data) => {
        console.log("new_water ", data.body);
        if (data.status === 200 && data.body.length) {
          this.connectionUsageList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  getSubUsageList(usageMasterId) {
    var postToData = { usageMasterId: usageMasterId, active: true };
    this.newWaterConnectionEntryService.getSubUsageList(postToData).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.connectionSubUsageList = data.body;
          console.log("sub list", this.connectionSubUsageList)
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

}
