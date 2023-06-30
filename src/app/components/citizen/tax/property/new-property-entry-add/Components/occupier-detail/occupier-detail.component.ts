import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { NewPropertyEntryAddService } from '../../Services/new-property-entry-add.service';
import { NewPropertyEntryAddDataSharingService } from '../../Services/new-property-entry-add-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { Subscriber, Subscription } from 'rxjs';
import { OccupierModel } from '../../Models/new-property-entry-add.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { Router } from '@angular/router';

@Component({
  selector: 'app-occupier-detail',
  templateUrl: './occupier-detail.component.html',
  styleUrls: ['./occupier-detail.component.scss']
})

export class OccupierDetailComponent implements OnInit {

  translateKey: string = 'newPropertyTaxScreen';
  columns: string[] = ['occupierCode', 'titleName', 'firstName', 'middleName', 'lastName', 'aadharNo', 'mobileNo', 'emailAddress', 'action'];
  dataSource: any = [];
  titleList = [];
  occupierList = [];
  model: OccupierModel;
  occupierTypeList = [];
  occupierSubTypeList = [];
  copyOfOccupierSubTypeList = [];
  subscription: Subscription;
  isOccupierExist: boolean = true;
  isShowTable: boolean = false;
  isDuplicateCode: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  modelProperty: any = {};
  isUnitDetailEntered: boolean = true;
  unitDetailErrorMessage: string;
  panelOpenState: boolean;
  subsPropertyEditMode : Subscription
  constructor(private newNewPropertyEntryAddDataSharingService: NewPropertyEntryAddDataSharingService,
    private commonService: CommonService,
    private newNewPropertyEntryAddService: NewPropertyEntryAddService,
    private alertService: AlertService, private router: Router) {
    this.modelProperty = {}
    this.isOccupierExist = true;
    this.isShowTable = false;

  }

  show: Number = 0;


  ngOnInit() {
    this.model = new OccupierModel();
    this.getLookups();
    this.subscription = this.newNewPropertyEntryAddDataSharingService.observableProperty.subscribe((data) => {
      if (data) {
        this.modelProperty = data;
      }
    })

    this.newNewPropertyEntryAddDataSharingService.observableUnitList.subscribe((data) => {
      if (data) {
        this.checkUnitDetailIsExist();
      }
    })

    this.subsPropertyEditMode = this.newNewPropertyEntryAddDataSharingService.getPropertyEditModel().subscribe(data => {
      if (data) {
      this.dataSource = new MatTableDataSource(data.propertyOccupiers);
        this.dataSource.sort = this.sort;
        if (this.dataSource.data.length > 0) {
          this.isOccupierExist = true;
          this.isShowTable = true;
        }
        else {
          this.isOccupierExist = false;
          this.isShowTable = false;
          this.model = new OccupierModel();
        }
       this.modelProperty.propertyBasicId = data.propertyBasic.propertyBasicId;
        this.checkUnitDetailIsExist();
      }
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subsPropertyEditMode.unsubscribe()
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Title}&lookup_codes=${Constants.LookupCodes.OCCUPIER_CODE}&lookup_codes=${Constants.LookupCodes.OCCUPIER_TYPE}&lookup_codes=${Constants.LookupCodes.OCCUPIER_SUB_TYPE}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.titleList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Title))[0].items;
      this.occupierList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.OCCUPIER_CODE))[0].items;
      this.occupierTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.OCCUPIER_TYPE))[0].items;
      this.occupierSubTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.OCCUPIER_SUB_TYPE))[0].items;
      this.copyOfOccupierSubTypeList = this.occupierSubTypeList
    });
  }

  searchOccupier() {
    this.newNewPropertyEntryAddService.searchOccupier(this.modelProperty.propertyBasicId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.dataSource = new MatTableDataSource(data.body);
          this.dataSource.sort = this.sort;
          if (this.dataSource.data.length > 0) {
            this.isOccupierExist = true;
            this.isShowTable = true;
          }
          else {
            this.isOccupierExist = false;
            this.isShowTable = false;
          }
          this.checkUnitDetailIsExist();
        }
      },
      (error) => {
        if (error.status === 400) {
          var errorMessage = '';
          error.error[0].propertyList.forEach(element => {
            errorMessage = errorMessage + element + "</br>";
          });
          this.alertService.error(errorMessage);
        }
        else {
          this.alertService.error(error.error.message);
        }
      });
  }

  checkDuplicateCode(event) {
    this.isDuplicateCode = false;
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length && this.dataSource.data.length > 0) {
      var obj = this.dataSource.data.filter(f => f.occupierCode == event.target.value && f.propertyOccupierId != this.model.propertyOccupierId);
      if (obj.length > 0) {
        this.isDuplicateCode = true;
      }
    }
  }

  saveOccupier(formDetail: NgForm) {

    if (formDetail.form.valid && this.isDuplicateCode == false) {
      this.model.propertyBasicVersionId = this.modelProperty.propertyBasicId
      this.newNewPropertyEntryAddService.searchEmailIdOccupier(this.model.propertyBasicVersionId, this.model.emailAddress, this.model.propertyOccupierId==undefined ? '':this.model.propertyOccupierId).subscribe(
        (data) => {
          if (data.status === 200) {

            this.saveOccupierAfterEmail(formDetail);
          }
        },
        (error) => {
          if (error.status === 400) {
            var errorMessage = '';
            error.error[0].propertyList.forEach(element => {
              errorMessage = errorMessage + element + "</br>";
            });
            this.alertService.error(errorMessage);
          }
          else {
            this.alertService.error(error.error.message);
          }
        });

    }
  }

  eidt(item) {
    const occupierType = this.occupierTypeList.find(f=>Number(item.occupierType) == f.itemId)
    if(occupierType.itemName){
      this.occupierTypeChange(occupierType.itemName);
      this.model = Object.assign({}, item);
    }
  }

  moveStepper(item) {

    this.newNewPropertyEntryAddDataSharingService.updateDataSourceOccupier(item);
    this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(4);
  }

  moveToDocumentsTab() {
    this.checkOccupierExist();
    if (this.isOccupierExist && this.isUnitDetailEntered) {
      this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(5);
    }
  }

  delete(item) {
    this.alertService.confirm();
    var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
      if (isConfirm) {
        this.newNewPropertyEntryAddService.deleteOccupier(item.propertyOccupierId).subscribe(
          (data) => {
            if (data.status === 200) {
              this.model = new OccupierModel();
              this.searchOccupier();
            }
          },
          (error) => {
            if (error.status === 400) {
              var errorMessage = '';
              error.error[0].propertyList.forEach(element => {
                errorMessage = errorMessage + element + "</br>";
              });
              this.alertService.error(errorMessage);
            }
            else {
              this.alertService.error(error.error.message);
            }
          })
      }
      subConfirm.unsubscribe();
    });
  }

  checkOccupierExist() {
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length && this.dataSource.data.length > 0) {
      this.isOccupierExist = true;
    }
    else {
      this.isOccupierExist = false;
    }
  }

  checkUnitDetailIsExist() {
    this.checkOccupierExist();
    if (this.isOccupierExist) {
      this.newNewPropertyEntryAddService.viewBasic(this.modelProperty.propertyBasicId).subscribe(
        (data) => {
          if (data.status === 200) {
            this.newNewPropertyEntryAddDataSharingService.applicationNo = data.body.propertyBasic.applicationNumber;
            this.isUnitDetailEntered = true;
            this.unitDetailErrorMessage = '';
            data.body.propertyOccupiers.forEach(element => {
              if (element) {
                if (element.unitVersion && element.unitVersion.length == 0) {
                  this.isUnitDetailEntered = false;
                  this.unitDetailErrorMessage = this.unitDetailErrorMessage + "*Please enter unit detail of occupier code: " + element.occupierCode + "<br>";
                }
                if (element.unitVersion && element.unitVersion.length > 0) {
                  element.unitVersion.forEach(unit => {
                    if (!unit.propertyMeasurement.propertyMeasurementId) {
                      this.isUnitDetailEntered = false;
                      this.unitDetailErrorMessage = this.unitDetailErrorMessage + "*Please enter measurement detail of occupier code: " + element.occupierCode + " and unit no: " + unit.unitNo + "<br>";
                    }
                  });

                }
              }
            });
          }
        },
        (error) => {
          if (error.status === 400) {
            var errorMessage = '';
            error.error[0].propertyList.forEach(element => {
              errorMessage = errorMessage + element + "</br>";
            });
            this.alertService.error(errorMessage);
          }
          else {
            this.alertService.error(error.error.message);
          }
        })
    }
  }

  onSubmit() {
    //  this.checkUnitDetailIsExist();
    this.checkOccupierExist();
    if (this.isOccupierExist && this.isUnitDetailEntered) {
      this.newNewPropertyEntryAddService.submit(this.modelProperty.propertyBasicId).subscribe(
        (data) => {
          if (data.status === 200) {
            this.alertService.success(data.body.message);
            //this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(4);
            this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENDASHBOARD'));
          }
        },
        (error) => {
          if (error.status === 400) {
            var errorMessage = '';
            error.error[0].propertyList.forEach(element => {
              errorMessage = errorMessage + element + "</br>";
            });
            this.alertService.error(errorMessage);
          }
          else {
            this.alertService.error(error.error.message);
          }
        })
    }
  }

  onBackClick() {
    this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(2);
  }

  onEnter(value: string) {
    console.log('value at 276->', value);
  }

  keyPressAlphabetOnly(event) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

saveOccupierAfterEmail( formDetail: NgForm){


  this.newNewPropertyEntryAddService.saveOccupier(this.model).subscribe(
    (data) => {
      if (data.status === 200) {
        formDetail.resetForm();
        this.model = new OccupierModel();
        this.searchOccupier();
      }
    },
    (error) => {
      if (error.status === 400) {
        var errorMessage = '';
        error.error[0].propertyList.forEach(element => {
          errorMessage = errorMessage + element + "</br>";
        });
        this.alertService.error(errorMessage);
      }
      else {
        this.alertService.error(error.error.message);
      }
    });

  //  saveOccupier finish

}
togglePanel() {
  this.panelOpenState = !this.panelOpenState
}

clearPropertyOwner(form: NgForm){
  console.log("Successfully Cleared.");
  form.resetForm();
}

occupierTypeChange(event){    
  this.occupierSubTypeList = this.copyOfOccupierSubTypeList
  if(event == 'General'){
   this.occupierSubTypeList = []
   const subTypeList = this.copyOfOccupierSubTypeList.find(x => x.itemCode === 'OCCUPIER_SUB_TYPE_2');
    subTypeList.itemName = 'General'
    this.occupierSubTypeList.push(subTypeList) 
  }
  else if(event == 'Factory'){
    this.occupierSubTypeList = []
    const subTypeList = this.copyOfOccupierSubTypeList.find(x => x.itemCode === 'OCCUPIER_SUB_TYPE_2');
     subTypeList.itemName = 'Factory'
     this.occupierSubTypeList.push(subTypeList) 
  }
  else if(event == 'State Govt.'){
    this.occupierSubTypeList = []
    this.copyOfOccupierSubTypeList.forEach(res =>{
      if(res.itemCode == 'OCCUPIER_SUB_TYPE_1' || res.itemCode == 'OCCUPIER_SUB_TYPE_2' ) {
        res.itemName =  res.itemCode == 'OCCUPIER_SUB_TYPE_1' ? 'State Govt. 8/10'  :'State Govt. on Rent'
        this.occupierSubTypeList.push(res) 
      }
    })
  }
  else{
    this.occupierSubTypeList = []
    this.copyOfOccupierSubTypeList.forEach(res =>{
      if(res.itemCode == 'OCCUPIER_SUB_TYPE_2' ||res.itemCode == 'OCCUPIER_SUB_TYPE_3' || res.itemCode == 'OCCUPIER_SUB_TYPE_4' || res.itemCode == 'OCCUPIER_SUB_TYPE_5') {
        res.itemName = res.itemCode == 'OCCUPIER_SUB_TYPE_2' ? 'Central Govt. on Rent' : (res.itemCode == 'OCCUPIER_SUB_TYPE_3' ? 'Central Govt. 75.00' : (res.itemCode == 'OCCUPIER_SUB_TYPE_4' ? 'Central Govt. 50.00%' :'Central Govt. 33.33%'))
        this.occupierSubTypeList.push(res) 
      }
    })
  }
}

}
