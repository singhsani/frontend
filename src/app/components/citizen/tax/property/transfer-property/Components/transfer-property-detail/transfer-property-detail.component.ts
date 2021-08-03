import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2'
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-transfer-property-detail',
  templateUrl: './transfer-property-detail.component.html',
  styleUrls: ['./transfer-property-detail.component.scss']
})
export class TransferPropertyDetailComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper;
  subscription: Subscription;
  currentIndex: number = 0;
  
  constructor(
    private commonService: CommonService,
    private transferPropertyDataSharingService: TransferPropertyDataSharingService,
    private transferPropertyService: TransferPropertyService) { }

  ngOnInit() {
    this.subscription = this.transferPropertyDataSharingService.observableMoveStepper.subscribe((data) => {
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
    this.transferPropertyDataSharingService.updatedIsShowForm(false);
  }

  stepChangedEvent(event){
    this.moveStepper(event);
  }
}