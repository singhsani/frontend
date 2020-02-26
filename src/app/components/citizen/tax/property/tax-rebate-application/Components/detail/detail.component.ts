import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaxRebateApplicationDataSharingService } from '../../Services/tax-rebate-application-data-sharing.service';
import { TaxRebateApplicationService } from '../../Services/tax-rebate-application.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { downloadFile } from 'src/app/vmcshared/downloadFile';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {

  model: any = {};
  rebateTypeList = [];
  financialYear = [];
  isShaved: boolean = false;
  isApprovedorDecline: boolean = false;
  constructor(
    private taxRebateApplicationDataSharingService: TaxRebateApplicationDataSharingService,
    private taxRebateApplicationService: TaxRebateApplicationService,
    private alertService: AlertService) {

  }

  ngOnInit() {
    this.model = {};
    this.taxRebateApplicationDataSharingService.observableDataModel.subscribe(data => {
      if (data) {
        this.model = Object.assign({}, data);
        
      }
    });
    this.getRebatTypeList();
    this.getFinancialYear();
  }

  getRebatTypeList() {
    this.taxRebateApplicationService.getRebatType({ active: true,approvalRequired:true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.rebateTypeList = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  getFinancialYear() {
    this.taxRebateApplicationService.getFinancialYear().subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.financialYear = data.body;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      }
    )
  }

  cancelForm() {
    this.taxRebateApplicationDataSharingService.updatedIsShowForm(false);
  }

  onSubmit(formDetail: NgForm) {
    if (formDetail.form.valid) {
      this.model.propertyServiceApplicationId = 1; // TODO
      this.taxRebateApplicationService.save(this.model).subscribe(
        (data) => {
          this.isShaved = true;
          this.model.taxRebateApplicationId = data.body.data;
          this.alertService.success(data.body.message);
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

  onDecline() {
    this.taxRebateApplicationService.approveOrReject({ approved: false, taxRebateApplicationId: this.model.taxRebateApplicationId }).subscribe(
      (data) => {
        this.isApprovedorDecline = true;
        // downloadFile(data, "reject-" + Date.now() + ".pdf", 'application/pdf');
        this.alertService.success(data.body.message);
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
  onApproved() {
    this.taxRebateApplicationService.approveOrReject({ approved: true, taxRebateApplicationId: this.model.taxRebateApplicationId }).subscribe(
      (data) => {
        this.isApprovedorDecline = true;
        // downloadFile(data, "approve-" + Date.now() + ".pdf", 'application/pdf');
        this.alertService.success(data.body.message);
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