import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { OwnerModel } from '../../Models/transfer-property.model';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { Subscription } from 'rxjs';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { MatSort, MatTableDataSource } from '@angular/material';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

@Component({
  selector: 'app-property-owner',
  templateUrl: './property-owner.component.html',
  styleUrls: ['./property-owner.component.scss']
})

export class PropertyOwnerComponent implements OnInit {

  columnsExistingOwner: string[] = ['titleName', 'firstName', 'middleName', 'lastName', 'aadharNo', 'mobileNo','emailAddress'];
  dataSourceExistingOwner: any = [];
  columnsNewOwner: string[] = ['titleName', 'firstName', 'middleName', 'lastName', 'aadharNo', 'mobileNo','emailAddress','action'];
  dataSourceNewOwner: any = [];
  titleList = [];
  ownerModel: OwnerModel;
  selectedDataModel: any = {};
  propertyDetailModel: any = {};
  subscription: Subscription;
  isNewOwnerExist: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private commonService: CommonService,
    private transferPropertyDataSharingService: TransferPropertyDataSharingService,
    private transferPropertyService: TransferPropertyService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.ownerModel = new OwnerModel();
    this.getLookups();
    this.transferPropertyDataSharingService.observableDataModel.subscribe((data) => {
      if (data) {
        this.selectedDataModel = data;
      }
    })
    this.subscription = this.transferPropertyDataSharingService.observablePropertyDetailModel.subscribe((data) => {
      if (data) {
        this.propertyDetailModel = data;
        this.searchOwnerByPropertyNo();
        this.searchOwnerByPropertyVersionId();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Title}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.titleList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Title))[0].items;

    });
  }

  searchOwnerByPropertyNo() {
    this.transferPropertyService.searchOwnerByPropertyNo(this.selectedDataModel.propertyNo).subscribe(
      (data) => {
        if (data.status === 200) {
          this.dataSourceExistingOwner = new MatTableDataSource(data.body);
          this.dataSourceExistingOwner.sort = this.sort;
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
      });
  }

  searchOwnerByPropertyVersionId() {
    this.transferPropertyService.searchOwnerByPropertyVersionId(this.propertyDetailModel.propertyVersionId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.dataSourceNewOwner = new MatTableDataSource(data.body);
          this.dataSourceNewOwner.sort = this.sort;
          if (this.dataSourceNewOwner.data.length > 0) {
            this.isNewOwnerExist = true;
          }
          else{
            this.isNewOwnerExist = false;
          }
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
      });
  }

  save(formDetail: NgForm) {
    if (formDetail.form.valid) {
      this.ownerModel.propertyBasicVersionId = this.propertyDetailModel.propertyVersionId
      this.transferPropertyService.saveOwner(this.ownerModel).subscribe(
        (data) => {
          if (data.status === 200) {
            this.ownerModel = new OwnerModel();
            this.searchOwnerByPropertyVersionId();
            formDetail.resetForm();
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
        });

    }
  }

  deleteOwner(item) {
    this.alertService.confirm();
    var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
      if (isConfirm) {
    this.transferPropertyService.deleteOwner(item.propertyOwnerId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.searchOwnerByPropertyVersionId();
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
    subConfirm.unsubscribe();
  });

  }

  onNext() {
    if (!this.isNewOwnerExist) {
      this.alertService.error('Please enter at least one new owner detail.');
    }
    else {
      this.transferPropertyDataSharingService.updateDataSourceMoveStepper(3);
    }

  }
  onBack() {
    this.transferPropertyDataSharingService.updateDataSourceMoveStepper(0);
  }
}
