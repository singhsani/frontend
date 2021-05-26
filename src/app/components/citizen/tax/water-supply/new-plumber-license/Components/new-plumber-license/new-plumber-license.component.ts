import { Component, OnInit,ViewChild } from '@angular/core';
import { NewPlumberLicenseDataSharingService } from '../../Services/new-plumber-license-data-sharing.service';
import { MatStepper } from '@angular/material';
import { Subscription } from 'rxjs';



@Component({
    selector: 'app-new-plumber-license',
    templateUrl: './new-plumber-license.component.html'
})

export class NewPlumberLicenseComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;
    subscription: Subscription;
    currentIndex: number = 0;

    isShowForm: boolean = true;
    isShowApproval: boolean = false;
    constructor(
        private newPlumberLicenseDataSharingService: NewPlumberLicenseDataSharingService) { }

    ngOnInit() {        
        this.newPlumberLicenseDataSharingService.getIsShowForm().subscribe(data => {
            this.isShowForm = data;
        });
        this.newPlumberLicenseDataSharingService.getIsShowApproval().subscribe(data => {
            this.isShowApproval = data;
        });
        this.newPlumberLicenseDataSharingService.setIsShowForm(true);

        this.subscription = this.newPlumberLicenseDataSharingService.dataSourceMoveStepper.subscribe((data) => {
            if (data != null) {
              this.currentIndex = data;
              this.moveStepper(data);
            }
          })
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

}