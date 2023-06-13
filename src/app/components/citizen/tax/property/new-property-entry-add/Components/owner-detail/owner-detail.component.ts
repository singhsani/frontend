import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { NewPropertyEntryAddService } from '../../Services/new-property-entry-add.service';
import { NewPropertyEntryAddDataSharingService } from '../../Services/new-property-entry-add-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { Subscription } from 'rxjs';
import { OwnerModel, PropertyModel } from '../../Models/new-property-entry-add.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

@Component({
  selector: 'app-owner-detail',
  templateUrl: './owner-detail.component.html',
  styleUrls: ['./owner-detail.component.scss']
})

export class OwnerDetailComponent implements OnInit {

  translateKey: string = 'newPropertyTaxScreen';
  subscription: Subscription;
  modelProperty: any = {};
  titleList = [];
  columns: string[] = ['titleName', 'firstName', 'middleName', 'lastName', 'aadharNo', 'mobileNo', 'emailAddress', 'isPrimaryOwner', 'action'];
  dataSource: any = [];
  ownerModel: OwnerModel;
  propertyModel: PropertyModel;
  isOwnerExist: boolean = true;
  propertyTypeList = [];
  propertySubTypeList = [];
  landClassList = [];
  highLowRiseList = [];
  waterZoneList = [];
  isShowOwnerTable: boolean = false;
  panelOpenState: boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  subsPropertyEditMode : Subscription
  constructor(
    private newNewPropertyEntryAddDataSharingService: NewPropertyEntryAddDataSharingService,
    private commonService: CommonService,
    private newNewPropertyEntryAddService: NewPropertyEntryAddService,
    private alertService: AlertService) {
    this.modelProperty = {}
    this.ownerModel = new OwnerModel();
    this.isOwnerExist = true;
    this.propertyModel = new PropertyModel();
  }

  ngOnInit() {
    this.getLookups();
    this.getPropertyTypeList();
    this.getLocationFactor();
    this.subscription = this.newNewPropertyEntryAddDataSharingService.observableProperty.subscribe((data) => {
      if (data) {
        this.isOwnerExist = true;
        this.modelProperty = data;
      }
    })

    this.subsPropertyEditMode = this.newNewPropertyEntryAddDataSharingService.getPropertyEditModel().subscribe(data => {
      if (data) {
        this.dataSource = new MatTableDataSource(data.propertyOwners);
        this.dataSource.sort = this.sort;
        this.checkOwnerExist();
        if (data.propertyTypeVersion)
          this.propertyModel = data.propertyTypeVersion;
        if (this.propertyModel.propertyTypeMstId) {
          this.getPropertySubTypeList(this.propertyModel.propertyTypeMstId)
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subsPropertyEditMode.unsubscribe()
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Water_Zone}&lookup_codes=${Constants.LookupCodes.High_Low_Rise}&lookup_codes=${Constants.LookupCodes.Title}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.titleList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Title))[0].items;
      this.highLowRiseList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.High_Low_Rise))[0].items;
      this.waterZoneList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Water_Zone))[0].items;
    });
  }

  onChangedPropertyType(val) {
    this.propertySubTypeList = [];
    this.propertyModel.subPropertyTypeMstId = null;
    if (val)
      this.getPropertySubTypeList(val);
  }

  getPropertyTypeList() {
    this.newNewPropertyEntryAddService.getPropertyTypeList({ active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.propertyTypeList = data.body;
          this.propertyTypeList.sort((a, b) =>
          (a.propertyType < b.propertyType ? -1 : 1));
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
  }

  getPropertySubTypeList(masterId) {
    this.newNewPropertyEntryAddService.getPropertySubTypeList({ propertyTypeMstId: masterId, active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.propertySubTypeList = data.body;
          this.propertySubTypeList.sort((a, b) =>
          (a.subPropertyType < b.subPropertyType ? -1 : 1));

        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
  }

  getLocationFactor() {
    this.newNewPropertyEntryAddService.getLocationFactor({ active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.landClassList = data.body;
          this.landClassList.sort((a, b) =>
          (a.locationName < b.locationName ? -1 : 1));
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
  }

  searchOwner() {
    this.newNewPropertyEntryAddService.searchOwner(this.modelProperty.propertyBasicId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.dataSource = new MatTableDataSource(data.body);
          this.dataSource.sort = this.sort;
          this.checkOwnerExist();
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

  saveOwner(form: NgForm) {
    if (form.form.valid) {
      this.ownerModel.propertyBasicVersionId = this.modelProperty.propertyBasicId
      this.newNewPropertyEntryAddService.searchEmailIdOwner(this.ownerModel.propertyBasicVersionId, this.ownerModel.emailAddress, this.ownerModel.propertyOwnerId==undefined ? '':this.ownerModel.propertyOwnerId).subscribe(
        (data) => {
          if (data.status === 200) {
            this.saveOwnerAfterIsPrimaryCheck(form);
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

  deleteOwner(item) {
    this.alertService.confirm();
    var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
      if (isConfirm) {
        this.newNewPropertyEntryAddService.deleteOwner(item.propertyOwnerId).subscribe(
          (data) => {
            if (data.status === 200) {
              this.ownerModel = new OwnerModel();
              this.searchOwner();
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

  editOwner(item) {
    this.ownerModel = Object.assign({}, item);
    this.panelOpenState = true;
  }

  checkOwnerExist() {
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length && this.dataSource.data.length > 0) {
      this.isOwnerExist = true;
      this.isShowOwnerTable = true;
    }
    else {
      this.isOwnerExist = false;
      this.isShowOwnerTable = false;
    }
  }

  onSubmit(form: NgForm) {
    this.checkOwnerExist();
    if (form.form.valid && this.isOwnerExist) {
      this.propertyModel.propertyBasicVersionsId = this.modelProperty.propertyBasicId;
      this.propertyModel.version = 1; // TODO
      this.newNewPropertyEntryAddService.savePropertyType(this.propertyModel).subscribe(
        (data) => {
          if (data.status === 200) {
            this.propertyModel.propertyTypeId = data.body.data;
            this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(3);
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

  onBackClick() {
    this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(1);
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

  togglePanel() {
    this.panelOpenState = !this.panelOpenState
  }

  clearPropertyOwner(form: NgForm){
    console.log("Successfully Cleared.");
    form.resetForm();
  }
  saveOwnerAfterEmailCheck( form: NgForm){


    this.newNewPropertyEntryAddService.saveOwner(this.ownerModel).subscribe(
      (data) => {
        if (data.status === 200) {
          form.resetForm();
          this.ownerModel = new OwnerModel();
          this.searchOwner();
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

  saveOwnerAfterIsPrimaryCheck(form: NgForm) {
    if (form.form.valid) {
      this.ownerModel.propertyBasicVersionId = this.modelProperty.propertyBasicId
      const isPrimaryOwner : boolean = this.ownerModel.isPrimaryOwner;
      this.newNewPropertyEntryAddService.searchOwnerIsPrimary(this.ownerModel.propertyBasicVersionId,this.ownerModel.propertyOwnerId==undefined ? '' : this.ownerModel.propertyOwnerId,isPrimaryOwner).subscribe(
        (data) => {
          if (data.status === 200) {

            this.saveOwnerAfterEmailCheck(form);
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

}

