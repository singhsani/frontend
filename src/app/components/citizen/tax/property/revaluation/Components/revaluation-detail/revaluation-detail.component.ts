import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { RevaluationService } from '../../Services/revaluation.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-revaluation-detail',
  templateUrl: './revaluation-detail.component.html',
  styleUrls: ['./revaluation-detail.component.scss']
})
export class RevaluationDetailComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  subscription: Subscription;
  currentIndex: number = 0;
  
  constructor(
    private commonService: CommonService,
    private revaluationDataSharingService: RevaluationDataSharingService,
    private revaluationService: RevaluationService) { }

  ngOnInit() {
    this.subscription = this.revaluationDataSharingService.observableMoveStepper.subscribe((data) => {
      if (data != null) {
        this.currentIndex = data;
        this.moveStepper(data);
      }
    })
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.moveStepper(0);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cancelForm() {
    this.revaluationDataSharingService.updatedIsShowForm(false);
  }
}