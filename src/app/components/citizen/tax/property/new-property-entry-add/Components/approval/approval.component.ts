import { Component, OnInit } from '@angular/core';
import { NewPropertyEntryAddService } from '../../Services/new-property-entry-add.service';
import { NewPropertyEntryAddDataSharingService } from '../../Services/new-property-entry-add-data-sharing.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval-property-entry',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})

export class ApprovalComponent implements OnInit {

  modelProperty: any = {};
  subscription: Subscription;
  isApproveOrDecline: boolean = false;
  constructor(private newNewPropertyEntryAddDataSharingService: NewPropertyEntryAddDataSharingService,
        private newNewPropertyEntryAddService: NewPropertyEntryAddService,
        public route: Router,
    private alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.newNewPropertyEntryAddDataSharingService.observableProperty.subscribe((data) => {
      if (data) {
        this.modelProperty = data;
      }
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  onApprove() {
    this.approveOrDecline(true);
  }

  onDecline() {
    this.approveOrDecline(false);
  }

  onBackClick() {
    this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(2);
  }

  approveOrDecline(isApproved) {
    var dataToPost = {
      "approved": isApproved,
      "propertyVersionId": this.modelProperty.propertyBasicId
    };

    this.newNewPropertyEntryAddService.approveOrDecline(dataToPost).subscribe(
      (data) => {
        if (data.status === 200) {
          var popertyNo = data.body.data == '' ? '' : ' Property No : ' + data.body.data;
          this.alertService.success(data.body.message + popertyNo);
          this.isApproveOrDecline = true;
          this.route.navigateByUrl('/', {skipLocationChange: true}).then(()=>
          this.route.navigate(['/property/service/new-property-entry']));
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