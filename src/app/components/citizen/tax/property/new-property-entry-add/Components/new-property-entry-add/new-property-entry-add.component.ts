import { Component,  ViewChild, AfterViewInit } from '@angular/core';
import { MatStepper } from '@angular/material';
import { Subscription } from 'rxjs';
import { NewPropertyEntryAddDataSharingService } from '../../Services/new-property-entry-add-data-sharing.service';
import { PropertySearchSharingService } from 'src/app/vmcshared/component/property-search/property-search-sharing.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';

@Component({
  selector: 'app-new-property-entry-add',
  templateUrl: './new-property-entry-add.component.html',
  styleUrls: ['./new-property-entry-add.component.scss']
})
export class NewPropertyEntryAddComponent implements AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper;
  subscription: Subscription;
  currentIndex: number = 0;
  isShowForm: boolean = false;
  constructor(
    private newNewPropertyEntryAddDataSharingService: NewPropertyEntryAddDataSharingService,
    private propertySearchSharingService: PropertySearchSharingService,
    private commonService: CommonService,
    private addressService: ApplicantAddressService ) {
  }
  ngOnInit() {

    this.subscription = this.newNewPropertyEntryAddDataSharingService.observableMoveStepper.subscribe((data) => {
      if (data != null) {
        this.currentIndex = data;
        this.moveStepper(data);
      }
    })
    this.propertySearchSharingService.getIsOpenSearchForm().subscribe(data => {
      this.isShowForm = data;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
  }

  ngAfterViewInit() {
    setTimeout(() => {
     this.moveStepper(0);
    });
  }

  stepChanged(event, stepper){
    stepper.selected.interacted = false;
  }

  stepChangedEvent(event){
    this.moveStepper(event);
  }

  saveApplicantDetails(applicantDetailsDTO: ApplicantDetailDTO){
    this.addressService.saveApplicantDetail(applicantDetailsDTO).subscribe(
         (data) => {
           this.commonService.applicationNo = data.body.applicationNo;
           this.moveStepper(1);
         },
         (error) => {
           this.commonService.callErrorResponse(error);
         });
   }
}
