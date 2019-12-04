import { Component, OnInit, OnDestroy } from '@angular/core';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { CreateFormulaSharingService } from './create-formula-sharing.service';
import { CreateFormulaService } from './create-formula.service';
import { AlertService } from '../../Services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-formula',
  templateUrl: './create-formula.component.html',
  styleUrls: ['./create-formula.component.scss']
})

export class CreateFormulaComponent implements OnInit,OnDestroy {

  operatorList = [];
  propertyOperatorList = [];
  waterOperatorList = [];
  formula: string;
  isProperty : boolean;
  isWater : boolean;
  subscription: Subscription;
  constructor(private commonService: CommonService,
    private createFormulaSharingService: CreateFormulaSharingService,
    private createFormulaService: CreateFormulaService,
    private alertService: AlertService) {
     
  }
  
  ngOnInit() {
    this.getLookups();
    this.getFormulaLookupProperty();
    this.getFormulaLookupWater();
    this.subscription = this.createFormulaSharingService.getFormulaValue().subscribe(data => {
        this.formula = data.formula;
        this.isProperty = data.isProperty;
        this.isWater = data.isWater;
    });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Operators}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.operatorList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Operators))[0].items;
    });
  }

  getFormulaLookupProperty() {
    this.createFormulaService.getFormulaLookupProperty().subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.propertyOperatorList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  getFormulaLookupWater() {
    this.createFormulaService.getFormulaLookupWater().subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.waterOperatorList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  onClickFomula(val, item) {
    //item.selected = true;
    if (this.formula) {
      this.formula = this.formula + ' ' + val;
    }
    else {
      this.formula = val;
    }
  }

  onCreate() {
    var model = { formula: this.formula };
    this.createFormulaSharingService.setFormulaModel(model);
    this.createFormulaSharingService.setIsShowCreateFormulaForm(false);
  }

  onBack() {
    this.createFormulaSharingService.setIsShowCreateFormulaForm(false);
  }
  onClear() {
    this.formula = null;
    // this.operatorList.forEach(element => {
    //   element.selected = false;
    // });
    // this.propertyOperatorList.forEach(element => {
    //   element.selected = false;
    // });
    // this.waterOperatorList.forEach(element => {
    //   element.selected = false;
    // });
  }
}