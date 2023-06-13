import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2'
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';

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
    private transferPropertyService: TransferPropertyService,
    private addressService: ApplicantAddressService) { }

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

  saveApplicantDetails(applicantDetailsDTO: ApplicantDetailDTO){
    if(!applicantDetailsDTO.uniqueId){
      applicantDetailsDTO.uniqueId = this.transferPropertyDataSharingService.applicationNo;
    }
   this.addressService.saveApplicantDetail(applicantDetailsDTO).subscribe(
				(data) => {
					this.commonService.applicationNo = data.body.applicationNo;
          this.transferPropertyDataSharingService.updateDataSourceMoveStepper(3);
          this.transferPropertyDataSharingService.serviceId = data.body.id;
				},
				(error) => {
					this.commonService.callErrorResponse(error);
				});
  }
}