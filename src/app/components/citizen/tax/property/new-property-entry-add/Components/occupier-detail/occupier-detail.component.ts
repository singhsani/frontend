import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { NewPropertyEntryAddService } from '../../Services/new-property-entry-add.service';
import { NewPropertyEntryAddDataSharingService } from '../../Services/new-property-entry-add-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { Subscription } from 'rxjs';
import { OccupierModel } from '../../Models/new-property-entry-add.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

@Component({
  selector: 'app-occupier-detail',
  templateUrl: './occupier-detail.component.html',
  styleUrls: ['./occupier-detail.component.scss']
})

export class OccupierDetailComponent implements OnInit {

  columns: string[] = ['occupierCode', 'titleName', 'firstName', 'middleName', 'lastName', 'aadharNo', 'mobileNo', 'emailAddress', 'action'];
  dataSource: any = [];
  titleList = [];
  model: OccupierModel;
  subscription: Subscription;
    isOccupierExist: boolean = true;
  isShowTable: boolean = false;
  isDuplicateCode: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  modelProperty: any = {};
  isUnitDetailEntered: boolean = true;
  unitDetailErrorMessage: string;
  constructor(private newNewPropertyEntryAddDataSharingService: NewPropertyEntryAddDataSharingService,
    private commonService: CommonService,
    private newNewPropertyEntryAddService: NewPropertyEntryAddService,
    private alertService: AlertService) {
    this.modelProperty = {}
    this.isOccupierExist = true;
    this.isShowTable = false;

  }



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

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Title}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.titleList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Title))[0].items;

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

    }
  }

  eidt(item) {
    this.model = Object.assign({}, item);
  }

  moveStepper(item) {

    this.newNewPropertyEntryAddDataSharingService.updateDataSourceOccupier(item);
    this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(3);
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
            this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(4);
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
    this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(1);
  }
}