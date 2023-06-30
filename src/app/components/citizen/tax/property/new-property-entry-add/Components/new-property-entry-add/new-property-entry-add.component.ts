import { Component,  ViewChild, AfterViewInit } from '@angular/core';
import { MatStepper } from '@angular/material';
import { Subscription } from 'rxjs';
import { NewPropertyEntryAddDataSharingService } from '../../Services/new-property-entry-add-data-sharing.service';
import { PropertySearchSharingService } from 'src/app/vmcshared/component/property-search/property-search-sharing.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { ApplicantAddressService } from 'src/app/vmcshared/Services/applicant-address.service';
import { ApplicantDetailDTO } from '../../../../Models/applicant-details.model';
import { ActivatedRoute } from '@angular/router';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { NewPropertyEntryAddService } from '../../Services/new-property-entry-add.service';
import { DataSharingService } from 'src/app/vmcshared/Services/data-sharing.service';

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
  formId : number;
  apiCode : string;
  constructor(
    private newNewPropertyEntryAddDataSharingService: NewPropertyEntryAddDataSharingService,
    private propertySearchSharingService: PropertySearchSharingService,
    private commonService: CommonService,
    private addressService: ApplicantAddressService,
    private route: ActivatedRoute,
    private newPropertyEntryAddService : NewPropertyEntryAddService,
    private propertyEntryAddDataSharingService : DataSharingService  ) {
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

    this.route.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      if(this.formId != 0){
        this.newPropertyEntryAddService.getVersionById(this.formId).subscribe(res =>{
          res.body.serviceApplicationId = this.formId;
          this.propertyEntryAddDataSharingService.setApplicantDetailsEditModel(res.body);
          this.viewBasic(res.body.extraIds)
        })
      }
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
    debugger
    applicantDetailsDTO.uniqueId = this.newNewPropertyEntryAddDataSharingService.applicationNo;
    this.addressService.saveApplicantDetail(applicantDetailsDTO).subscribe(
         (data) => {
           this.commonService.applicationNo = data.body.applicationNo;
           this.moveStepper(1);
         },
         (error) => {
           this.commonService.callErrorResponse(error);
         });
   }

   viewBasic(propertyBasicId : number){
    if(propertyBasicId){
      this.newPropertyEntryAddService.viewBasic(propertyBasicId).subscribe(res=>{
          console.log(res)
          this.newNewPropertyEntryAddDataSharingService.setPropertyEditModel(res.body);
        }
      )
    }
   }
}
