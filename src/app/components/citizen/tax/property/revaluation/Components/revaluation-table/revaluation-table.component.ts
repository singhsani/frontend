import { Component, OnInit, ViewChild } from '@angular/core';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { RevaluationService } from '../../Services/revaluation.service';
import { Subscription } from 'rxjs';
import { SearchModel } from '../../Models/revaluation.model';
import { NgForm } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';


@Component({
  selector: 'app-revaluation-table',
  templateUrl: './revaluation-table.component.html',
  styleUrls: ['./revaluation-table.component.scss']
})
export class RevaluationTableComponent implements OnInit {

  subscription: Subscription;
  searchModelSubscription: Subscription;
  displayedColumns: string[] = ['select', 'propertyNo', 'propertyAddress', 'ownerName', 'occupierName'];
  dataSource: any = [];
  searchModel = new SearchModel();
  selectedItem: any = null;
  isShowDetail = false;
  isSearchByPropertyNo: boolean = false;
  reasonofReassessmentList = [];
  reasonofReassessmentId: number;
  @ViewChild(MatSort) sort: MatSort;
  totalCount: any = 0;
  constructor(private revaluationDataSharingService: RevaluationDataSharingService,
    private revaluationService: RevaluationService,
    private commonService: CommonService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getLookups();
    this.revaluationDataSharingService.observableIsSearchByPropertyNo.subscribe((data) => {
      this.isSearchByPropertyNo = data;
    })
    this.revaluationDataSharingService.observableIsClear.subscribe((data) => {
      if (data) {
        this.dataSource = [];
      }
    })
    this.searchModelSubscription = this.revaluationDataSharingService.observableSearchModel.subscribe((data) => {
      this.searchModel = data;
    })
    this.subscription = this.revaluationDataSharingService.observableIsShowTable.subscribe((data) => {
      if (data) {
        this.isShowDetail = false;
        this.search();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.searchModelSubscription.unsubscribe();
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Reason_For_Reassessment}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.reasonofReassessmentList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Reason_For_Reassessment))[0].items;
    });
  }


  search() {
    if(this.searchModel) {
      this.revaluationService.search(this.searchModel).subscribe(
        (data) => {
          if (data.status === 200) {
            if (data.body.length == 0) {
              this.alertService.info('No data found!');
              if (!this.isSearchByPropertyNo || (this.isSearchByPropertyNo && this.dataSource.length == 0)) {
                this.revaluationDataSharingService.updatedIsShowTable(false);
              }
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
        });
    }
  }

  onChangeSelect(event) {
    this.reasonofReassessmentId = null;
    this.isShowDetail = true;
  }

  onEnterClick(formDetail: NgForm) {
    if (formDetail.form.valid) {

      this.revaluationService.save({ reassessmentReasonLookupId: this.reasonofReassessmentId, propertyNo: this.selectedItem.propertyNo }).subscribe(
        (data) => {
          if (data.status === 200) {
            this.selectedItem.propertyVersionId = data.body.data.propertyVersionId;
            this.selectedItem.revaluationId = data.body.data.revaluationId;
            this.revaluationDataSharingService.updatedIsRefreshTable(false);
            this.revaluationDataSharingService.updatedIsShowForm(true);
            this.revaluationDataSharingService.updateDataSourceOccupier(null);
            this.revaluationDataSharingService.updatedDataModel(this.selectedItem);
            this.revaluationDataSharingService.applicationNumber = data.body.applicationNumber;
          }
        },
        (error) => {
          this.commonService.callErrorResponse(error);
        });

    }
  }
}