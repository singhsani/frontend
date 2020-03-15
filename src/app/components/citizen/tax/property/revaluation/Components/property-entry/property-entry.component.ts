import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { RevaluationService } from '../../Services/revaluation.service';
import { Subscription } from 'rxjs';
import { PropertyTypeModel } from '../../Models/revaluation.model';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

@Component({
  selector: 'app-property-entry',
  templateUrl: './property-entry.component.html',
  styleUrls: ['./property-entry.component.scss']
})

export class PropertyEntryComponent implements OnInit {

  subscription: Subscription;
  selectedDataModel: any = {}
  propertyTypeList = [];
  propertySubTypeList = [];
  landClassList = [];
  highLowRiseList = [];
  waterZoneList = [];
  model: PropertyTypeModel;
  constructor(private commonService: CommonService,
    private revaluationDataSharingService: RevaluationDataSharingService,
    private revaluationService: RevaluationService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.model = new PropertyTypeModel();
    this.selectedDataModel = {}
    this.getPropertyTypeList();
    this.getLocationFactor();
    this.getLookupValues();
    this.subscription = this.revaluationDataSharingService.observableDataModel.subscribe((data) => {
      if (data) {
        this.selectedDataModel = data;
        this.viewBasic()

      }
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getLookupValues() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Water_Zone}&lookup_codes=${Constants.LookupCodes.High_Low_Rise}`
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.highLowRiseList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.High_Low_Rise))[0].items;
      this.waterZoneList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Water_Zone))[0].items;
    });
  }

  onChangedPropertyType(val, isChanged) {
    if (isChanged == 1) {
      this.propertySubTypeList = [];
      this.model.subPropertyTypeMstId = null;
    }
    if (val)
      this.getPropertySubTypeList(val);
  }

  getPropertyTypeList() {
    this.revaluationService.getPropertyTypeList({ active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.propertyTypeList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  getPropertySubTypeList(masterId) {
    this.revaluationService.getPropertySubTypeList({ propertyTypeMstId: masterId, active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.propertySubTypeList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
  }

  getLocationFactor() {
    this.revaluationService.getLocationFactor({ active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.landClassList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
  }

  onNext(formDetail: NgForm) {
    if (formDetail.form.valid) {
      this.model.propertyBasicVersionsId = this.selectedDataModel.propertyVersionId;
      this.model.version = 1; // TODO
      this.revaluationService.savePropertyType(this.model).subscribe(
        (data) => {
          if (data.status === 200) {
            this.revaluationDataSharingService.updatedIsRefreshTable(true);
            this.revaluationDataSharingService.updateDataSourceMoveStepper(1);
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

  viewBasic() {
    this.revaluationService.viewBasic(this.selectedDataModel.propertyVersionId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.model = data.body.propertyTypeVersion;
          this.onChangedPropertyType(this.model.propertyTypeMstId, 0);
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
