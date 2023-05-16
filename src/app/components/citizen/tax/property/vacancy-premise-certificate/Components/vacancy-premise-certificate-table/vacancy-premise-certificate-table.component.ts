import { Component, OnInit, ViewChild } from '@angular/core';
import { VacancyPremiseCertificateDataSharingService } from '../../Services/vacancy-premise-certificate-data-sharing.service';
import { VacancyPremiseCertificateService } from '../../Services/vacancy-premise-certificate.service';
import { Subscription, ObjectUnsubscribedError } from 'rxjs';
import { SearchModel, DataModel } from '../../Models/vacancy-premise-certificate.model';
import { NgForm } from '@angular/forms';
import { MatTableDataSource, MatSort,MatPaginator } from '@angular/material';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { merge, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';

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
  totalCount: any = 0;
  @ViewChild(MatSort) sort: MatSort;
  detailOutstandingButtonText = "Show Detail";
  isShowOutstandingDetail: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
	pageRecord = Constants.pageRecord; 
  resultsLength: number = 0;	
  
  constructor(private vacancyPremiseCertificateDataSharingService: VacancyPremiseCertificateDataSharingService,
    private vacancyPremiseCertificateService: VacancyPremiseCertificateService,
    private alertService: AlertService,
    private commonService:CommonService) { }

  ngOnInit() {
    this.paginator.pageSize=Constants.pageSize;
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
   /* this.vacancyPremiseCertificateService.search(this.searchModel).subscribe(
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
            this.totalCount = this.dataSource.data.length;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });*/
      this.paginator.pageIndex=0;
      this.searchModel.pageNo=null;
	    this.searchModel.pageSize=null;
      this.searchList();
  }
  searchList() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          if(this.searchModel.pageNo!=this.paginator.pageIndex || this.searchModel.pageSize!=this.paginator.pageSize){
            if(this.searchModel.pageSize==this.paginator.pageSize){
              this.searchModel.pageNo=this.paginator.pageIndex;
            }else{
              this.searchModel.pageNo=0;
              this.paginator.pageIndex=0;
            }
          this.searchModel.pageSize=this.paginator.pageSize;
          return this.vacancyPremiseCertificateService.search(this.searchModel);
        }          
        }),
        map(data => {				
          return data;
        }),
        catchError(() => {
          return of([]);
        })
      ).subscribe((data) => {
        if (data.status === 200) {
          if (data.body.data.length == 0) {
            this.alertService.info('No Data Found!');
            this.vacancyPremiseCertificateDataSharingService.updatedIsShowTable(false);
              this.dataSource = [];
            this.resultsLength=0;
          } else {
            this.dataSource = new MatTableDataSource(data.body.data);
            this.dataSource.sort = this.sort;                   
            this.totalCount = data.body.totalRecords;
            this.resultsLength= data.body.totalRecords;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      }
      );
  }
  onChangeSelect(event) {
    this.getOutstandingDetails(this.selectedItem.propertyOccupierId);
    this.isShowPayMode = true;
  }

  private getOutstandingDetails(propertyOccupierId:number) {
    this.vacancyPremiseCertificateService.getOutsatndingDetails(propertyOccupierId).subscribe(
      (data) => {
        if (data.status === 200) {
          if(data.body) {
            this.dataMoodel.outstandingAmount = data.body.outstandingAmount;
            this.dataMoodel.taxRateWiseOutstandingDetails = data.body.taxRateWiseOutstandingDetails;
            this.dataMoodel.totalOutstanding = data.body.outstandingAmount;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  onEnterClick() {
      this.getVacancyPremisesApplication(this.selectedItem.propertyOccupierId + "");
  }

  getVacancyPremisesApplication (propertyOccupierId: string){
    if(!propertyOccupierId){
      return;
    }
    this.vacancyPremiseCertificateService.getvacancypremiseapplication(propertyOccupierId).subscribe(
      (data) => {
        if (data.status === 200) {
          if(data.body != null && data.body != '') {
            this.alertService.warning("You have already apply for vacancy premise.Your application number is :" + data.body)
            }else{  
                this.vacancyPremiseCertificateService.checkIsOwnerAsOccupier(propertyOccupierId).subscribe(
                  (data) => {
                    if(data.status === 200){
                      if(data.body != null && !data.body) {
                        this.alertService.warning("Not allowed to do application because owner is not occupier.")
                      }else{
                        if(this.dataMoodel.outstandingAmount != 0) {
                          this.commonService.dueToOutstandingMessage(this.selectedItem.propertyNo);
                        } else {
                          this.dataMoodel = Object.assign(this.dataMoodel,this.selectedItem);
                          this.dataMoodel.occupierId = this.selectedItem.propertyOccupierId;
                          this.vacancyPremiseCertificateDataSharingService.updatedDataModel(this.dataMoodel);
                          this.vacancyPremiseCertificateDataSharingService.updatedIsShowForm(true);
                        }
                      }
                    }
                  },(error) => {
                    this.commonService.callErrorResponse(error);
                  }
                )
            }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }
  onOutstandingDetailCLick() {
    this.isShowOutstandingDetail = !this.isShowOutstandingDetail;
    this.detailOutstandingButtonText = "Show Detail";
    if (this.isShowOutstandingDetail) {
      this.detailOutstandingButtonText = "Hide Detail";
    }
  }
}
