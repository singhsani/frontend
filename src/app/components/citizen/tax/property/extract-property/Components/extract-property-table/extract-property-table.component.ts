import { Component, OnInit, ViewChild } from '@angular/core';
import { ExtractPropertyDataSharingService } from '../../Services/extract-property-data-sharing.service';
import { ExtractPropertyService } from '../../Services/extract-property.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { Subscription } from 'rxjs';
import { SearchModel, ServiceCharge } from '../../Models/extract-property.model';
import { NgForm } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { PaymentDataSharingService } from 'src/app/vmcshared/component/payment/payment-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';


@Component({
  selector: 'app-extract-property-table',
  templateUrl: './extract-property-table.component.html',
  styleUrls: ['./extract-property-table.component.scss']
})
export class ExtractPropertyTableComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['select', 'propertyNo', 'propertyAddress', 'ownerName', 'occupierName'];
  dataSource: any = [];
  searchModel = new SearchModel();
  selectedItem: any = null;
  serviceCharge = new ServiceCharge();
  isShowPayMode = false;
  isShowDetail = false;
  detailButtonText = "Show Detail";
  isSearchByPropertyNo: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private extractPropertyDataSharingService: ExtractPropertyDataSharingService,
    private extractPropertyService: ExtractPropertyService,
    private paymentDataSharingService: PaymentDataSharingService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.extractPropertyDataSharingService.observableIsSearchByPropertyNo.subscribe((data) => {
      this.isSearchByPropertyNo = data;
    })
    this.extractPropertyDataSharingService.observableIsClear.subscribe((data) => {
      if (data) {
        this.dataSource = [];
      }
    })
    this.extractPropertyDataSharingService.observableSearchModel.subscribe((data) => {
      this.searchModel = data;
    })
    this.subscription = this.extractPropertyDataSharingService.observableIsShowTable.subscribe((data) => {
      if (data) {
        this.isShowPayMode = false;
        this.isShowDetail = false;
        this.search();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search() {
    this.extractPropertyService.search(this.searchModel).subscribe(
      (data) => {
        if (data.status === 200) {
          if (data.body.length == 0) {
            this.alertService.info('No Data Found!');
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length == 0)) {
              this.extractPropertyDataSharingService.updatedIsShowTable(false);
            }
          }
          else {
            if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length == 0)) {
              this.dataSource = new MatTableDataSource(data.body);
            }
            else {
              const oldData = this.dataSource.data;
              const oldDataObj = oldData.filter(row => row.propertyNo == data.body[0].propertyNo);
              if (oldDataObj.length == 0) {
                oldData.push(data.body[0]);
                this.dataSource = new MatTableDataSource(oldData);
                //this.dataSource = oldData;
              }
            }
            this.dataSource.sort = this.sort;
          }
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      });
  }

  onChangeSelect(event) {
    this.extractPropertyService.calculateFee({ occupierId: this.selectedItem.propertyOccupierId }).subscribe(
      (data) => {
        if (data.status === 200) {
          this.serviceCharge = data.body.data;
          this.serviceCharge.noofCopies = 1;
          this.serviceCharge.totalAmountOriginal = this.serviceCharge.totalAmount;
          this.serviceCharge.occupierId = this.selectedItem.propertyOccupierId;
          this.serviceCharge.asonDate = new Date();
          this.isShowPayMode = true;
        }
        else {
          this.isShowPayMode = false;
        }
      },
      (error) => {
        if (error.status === 400) {
          this.isShowPayMode = false;
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

  onBlurNoofCopies(event) {
    this.serviceCharge.totalAmount = this.serviceCharge.totalAmountOriginal * event.target.value;
  }
  onDetailCLick() {
    this.isShowDetail = !this.isShowDetail;
    this.detailButtonText = "Show Detail";
    if (this.isShowDetail) {
      this.detailButtonText = "Hide Detail";
    }
  }
  onEnterClick(formDetail: NgForm) {
    if (formDetail.form.valid) {
      if (this.serviceCharge.noofCopies > 0) {
        this.paymentDataSharingService.updatedPamentFromOption(Constants.Payment_From_Option.Extract_Property);
        this.paymentDataSharingService.updatedDataModel(this.serviceCharge);
        this.extractPropertyDataSharingService.updatedIsShowForm(true);
      }
      else {
        this.alertService.error('No. of Copies should be greater than zero.');
      }
    }
  }
}
