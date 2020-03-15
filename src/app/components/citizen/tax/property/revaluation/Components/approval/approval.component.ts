import { Component, OnInit } from '@angular/core';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { RevaluationService } from '../../Services/revaluation.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})

export class ApprovalComponent implements OnInit {

  subscription: Subscription;
  selectedDataModel: any = {}
  isApproveOrDecline: boolean = false;
  constructor(private revaluationDataSharingService: RevaluationDataSharingService,
    private revaluationService: RevaluationService,
    private alertService:AlertService) {
  }

  ngOnInit() {
    this.subscription = this.revaluationDataSharingService.observableDataModel.subscribe((data) => {
      if (data) {
        this.selectedDataModel = data;
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onApproved() {
    this.approveOrDecline(true);
  }

  onDecline() {
    this.approveOrDecline(false);
  }

  onBack() {
    this.revaluationDataSharingService.updateDataSourceMoveStepper(1);
  }

  approveOrDecline(isApproved) {
    var dataToPost = {
      "approved": isApproved,
      "revaluationId": this.selectedDataModel.revaluationId
    };

    this.revaluationService.revaluationCallback(dataToPost).subscribe(
      (data) => {
        if (data.status === 200) {
          var popertyNo = data.body.data == '' ? '' : ' Property No : ' + data.body.data;
          this.alertService.success(data.body.message + popertyNo);
          this.isApproveOrDecline = true;

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
