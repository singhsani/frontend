import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { Subscription } from 'rxjs';
import { RevaluationService } from '../../Services/revaluation.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { OccupierModel } from '../../Models/revaluation.model';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

@Component({
  selector: 'app-occupier-detail',
  templateUrl: './occupier-detail.component.html',
  styleUrls: ['./occupier-detail.component.scss']
})

export class OccupierDetailComponent implements OnInit {

  columns: string[] = ['occupierCode', 'titleName', 'firstName', 'middleName', 'lastName', 'aadharNo', 'mobileNo', 'action'];
  dataSource: any = [];
  titleList = [];
  model: OccupierModel;
  selectedDataModel: any = {};
  subscription: Subscription;
  subscriptionMove: Subscription;
  isOccupierExist: boolean = false;
  isDuplicateCode: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  isShowTable: boolean = false;
  isUnitDetailEntered: boolean = false;
  unitDetailErrorMessage: string;

  constructor(private commonService: CommonService,
    private revaluationDataSharingService: RevaluationDataSharingService,
    private revaluationService: RevaluationService,
    private alertService: AlertService) {

  }

  ngOnInit() {
    this.model = new OccupierModel();
    this.getLookups();
    this.subscriptionMove = this.revaluationDataSharingService.observableMoveStepper.subscribe((data) => {
      if (data) {
        this.model = new OccupierModel();
      }
    })
    this.subscription = this.revaluationDataSharingService.observableDataModel.subscribe((data) => {
      if (data) {
        this.selectedDataModel = data;
        this.searchOccupier();
      }
    })
    this.revaluationDataSharingService.observableUnitList.subscribe((data) => {
      if (data) {
        this.checkUnitDetailIsExist();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionMove.unsubscribe();
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Title}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.titleList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Title))[0].items;

    });
  }

  searchOccupier() {
    this.revaluationService.searchOccupier(this.selectedDataModel.propertyVersionId).subscribe(
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

  save(formDetail: NgForm) {
    if (formDetail.form.valid && this.isDuplicateCode == false) {
      this.model.propertyBasicVersionId = this.selectedDataModel.propertyVersionId
      this.revaluationService.saveOccupier(this.model).subscribe(
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
        });

    }
  }

  eidt(item) {
    this.model = item;
  }

  delete(item) {
    this.alertService.confirm();
    var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
      if (isConfirm) {
        this.revaluationService.deleteOccupier(item.propertyOccupierId).subscribe(
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

  moveStepper(item) {
    this.revaluationDataSharingService.updateDataSourceOccupier(item);
    this.revaluationDataSharingService.updateDataSourceMoveStepper(2);
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
      this.revaluationService.viewBasic(this.selectedDataModel.propertyVersionId).subscribe(
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
    this.checkOccupierExist();
    if (this.isOccupierExist && this.isUnitDetailEntered) {
      this.revaluationService.submit(this.selectedDataModel.revaluationId).subscribe(
        (data) => {
          if (data.status === 200) {
            this.alertService.success(data.body.message);
            this.revaluationDataSharingService.updateDataSourceMoveStepper(3);
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
  onBack() {
    this.revaluationDataSharingService.updateDataSourceMoveStepper(0);
  }
}
