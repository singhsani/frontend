import { Component, OnInit, ViewChild } from '@angular/core';
import { VacancyPremiseCertificateDataSharingService } from '../../Services/vacancy-premise-certificate-data-sharing.service';
import { VacancyPremiseCertificateService } from '../../Services/vacancy-premise-certificate.service';
import { Subscription, ObjectUnsubscribedError } from 'rxjs';
import { SearchModel, DataModel } from '../../Models/vacancy-premise-certificate.model';
import { NgForm } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';


@Component({
  selector: 'app-vacancy-premise-certificate-table',
  templateUrl: './vacancy-premise-certificate-table.component.html',
  styleUrls: ['./vacancy-premise-certificate-table.component.scss']
})
export class VacancyPremiseCertificateTableComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['select', 'propertyNo', 'propertyAddress', 'ownerName', 'occupierName'];
  dataSource: any = [];
  searchModel = new SearchModel();
  selectedItem: any = null;
  dataMoodel = new DataModel();
  isShowPayMode = false;
  isShowDetail = false;
  detailButtonText = "Show Detail";
  isSearchByPropertyNo: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private vacancyPremiseCertificateDataSharingService: VacancyPremiseCertificateDataSharingService,
    private vacancyPremiseCertificateService: VacancyPremiseCertificateService,
    private alertService: AlertService,
    private commonService:CommonService) { }

  ngOnInit() {
    this.vacancyPremiseCertificateDataSharingService.observableIsSearchByPropertyNo.subscribe((data) => {
      this.isSearchByPropertyNo = data;
    })
    this.vacancyPremiseCertificateDataSharingService.observableIsClear.subscribe((data) => {
      if (data) {
        this.dataSource = [];
      }
    })
    this.vacancyPremiseCertificateDataSharingService.observableSearchModel.subscribe((data) => {
      this.searchModel = data;
    })
    this.subscription = this.vacancyPremiseCertificateDataSharingService.observableIsShowTable.subscribe((data) => {
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
    this.vacancyPremiseCertificateService.search(this.searchModel).subscribe(
      (data) => {
        if (data.status === 200) {
          if (data.body.length == 0) {
            this.alertService.info('No Data Found!');
            this.vacancyPremiseCertificateDataSharingService.updatedIsShowTable(false);
            this.dataSource = [];
          }
          else {
            this.dataSource = new MatTableDataSource(data.body);
            this.dataSource.sort = this.sort;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  onChangeSelect(event) {
    this.isShowPayMode = true;
  }

  onEnterClick() {
    this.vacancyPremiseCertificateService.getOutsatndingDetails(this.selectedItem.propertyOccupierId).subscribe(
      (data) => {
        if (data.status === 200) {
          if(data.body.outstandingAmount > 0) {
            this.alertService.error('You have outstanding amount of '+data.body.outstandingAmount+'.Please clear your due first after that to apply certification');
          } else {
            this.dataMoodel = Object.assign(this.dataMoodel,this.selectedItem)
            this.dataMoodel.totalOutstanding = data.body.outstandingAmount;
            this.dataMoodel.occupierId = this.selectedItem.propertyOccupierId;
            this.vacancyPremiseCertificateDataSharingService.updatedDataModel(this.dataMoodel);
            this.vacancyPremiseCertificateDataSharingService.updatedIsShowForm(true);
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }
}
