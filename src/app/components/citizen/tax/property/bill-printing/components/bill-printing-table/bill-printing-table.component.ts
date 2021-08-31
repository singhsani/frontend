import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge, of, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Constants } from 'src/app/vmcshared/Constants';
import { downloadFile } from 'src/app/vmcshared/downloadFile';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { BillPrintingModel, ListModel } from '../../models/bill-printing.model';
import { BillprintingdatasharingserviceService } from '../../services/billprintingdatasharingservice.service';
import { BillprintingserviceService } from '../../services/billprintingservice.service';

@Component({
    selector: 'app-bill-printing-table',
    templateUrl: './bill-printing-table.component.html',
    styleUrls: ['./bill-printing-table.component.scss']
})
export class BillPrintingTableComponent implements OnInit {

    displayedColumns: string[] = ['select', 'propertyNo', 'ownerName', 'occupierName', 'assessmentYear', 'action'];
    /** For Pagination and Sorting of Table */
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource<ListModel>([]);
    subscription: Subscription;
    searchModel = new BillPrintingModel();
    totalCount: any = 0;
    selection = new SelectionModel<ListModel>(true, []);
    pageRecord = Constants.pageRecord;
    resultsLength: number = 0;
    constructor(
        private billPrintingDataSharingService: BillprintingdatasharingserviceService,
        private commonService: CommonService,
        private billPrintingService: BillprintingserviceService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.billPrintingDataSharingService.observableSearchModel.subscribe((data) => {
            if (data) {
                this.searchModel = data;
            }
        });

        this.subscription = this.billPrintingDataSharingService.observableIsShowTable.subscribe((data) => {
            if (data) {
                this.paginator.pageSize = Constants.pageSize;
                this.search();
            } else {
                this.dataSource = new MatTableDataSource<ListModel>([]);
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    search() {
        /* this.searchModel.billDateFrom = this.commonService.getPayloadDate(this.searchModel.billDateFrom);
         this.searchModel.billDateTo = this.commonService.getPayloadDate(this.searchModel.billDateTo);
         this.billPrintingService.search(this.searchModel).subscribe(
             (data) => {
                 if (data.body.length === 0) {
                     this.alertService.info('No Data Found!');
                     this.billPrintingDataSharingService.updatedIsShowTable(false);
                 } else {
                     this.dataSource = new MatTableDataSource(data.body);
                     this.dataSource.sort = this.sort;
                     this.dataSource.paginator=this.paginator;
                 }
                 this.totalCount = this.dataSource.data.length;
                 this.selection.clear();
             },
             (error) => {
                 this.billPrintingDataSharingService.updatedIsShowTable(false);
                 this.commonService.callErrorResponse(error);
             });*/
        this.paginator.pageIndex = 0;
        this.searchModel.pageNo = null;
        this.searchModel.pageSize = null;
        this.searchList();
    }
    searchList() {
        merge(this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    if (this.searchModel.pageNo != this.paginator.pageIndex || this.searchModel.pageSize != this.paginator.pageSize) {
                        if (this.searchModel.pageSize == this.paginator.pageSize) {
                            this.searchModel.pageNo = this.paginator.pageIndex;
                        } else {
                            this.searchModel.pageNo = 0;
                            this.paginator.pageIndex = 0;
                        }
                        this.searchModel.pageSize = this.paginator.pageSize;
                        this.searchModel.billDateFrom = this.commonService.getPayloadDate(this.searchModel.billDateFrom);
                        this.searchModel.billDateTo = this.commonService.getPayloadDate(this.searchModel.billDateTo);
                        return this.billPrintingService.search(this.searchModel);
                    }
                }),
                map(data => {
                    return data;
                }),
                catchError(() => {
                    return of([]);
                })
            ).subscribe((data) => {
                if (data.body.data.length == 0) {
                    this.alertService.info('No Data Found!');
                    this.billPrintingDataSharingService.updatedIsShowTable(false);
                    this.resultsLength = 0;
                } else {
                    this.dataSource = new MatTableDataSource(data.body.data);
                    this.totalCount = data.body.totalRecords;
                    this.resultsLength = data.body.totalRecords;
                }
                this.selection.clear();
            },
                (error) => {
                    this.billPrintingDataSharingService.updatedIsShowTable(false);
                    this.commonService.callErrorResponse(error);
                }
            );
    }

    onPrintBill() {

        if (this.selection.selected.length === 0) {
            this.alertService.error('Please select at least one record.');
        } else {
            var billIds = [];
            this.selection.selected.forEach(element => {
                billIds.push(element.propertyBillMstId);
            });
            this.billPrintingService.billPrint({ billIds: billIds }).subscribe(
                (data) => {
                    downloadFile(data, 'print-bill-' + Date.now() + '.pdf', 'application/pdf');
                },
                (error) => {
                    this.commonService.callErrorResponse(error);
                });
        }
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
    masterToggle() {
        this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    delete(element) {
        this.alertService.confirm();
        var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
            if (isConfirm) {
                let billId = element.propertyBillMstId;
                this.billPrintingService.delete(billId).subscribe(
                    (data) => {
                        this.alertService.info(data.body.message);
                        this.search();
                    },
                    (error) => {
                        this.commonService.callErrorResponse(error);
                    });
            }
            subConfirm.unsubscribe();
        });
    }
}
