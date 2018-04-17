import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, Form } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';

import { PaginationService } from '../../../core/services/citizen/data-services/pagination.service';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

import swal from 'sweetalert2'

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  paymentsForm: FormGroup;
  PayableServices: Object[];
  displayedColumns: string[] = ['id', 'chalanNumber', 'amount', 'paymentDate', 'payableServices', 'paymentStatus'];
  myControl: FormControl = new FormControl();
  resultsLength: number = 0;
  pageSize: number = 10;
  isLoadingResults: boolean = true;
  isRateLimitReached: boolean = false;
  dataSource = new MatTableDataSource();
  filteredOptions: Observable<any[]>;

  constructor(
    public dialog: MatDialog,
    private formService: FormsActionsService,
    private paginationService: PaginationService,
    private _router: Router,
    private fb: FormBuilder
  ) {
    this.getPayableServicesList();
  }

  ngOnInit() {
    this.paymentsForm = this.fb.group({
      chalanNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('([0-9]|[A-Z]|[a-z])+')]],
      amount: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      payableServices: this.fb.group({
        code: ['', Validators.required]
      })
    });

    this.getAllPaymentsList();
  }

  /*this.filteredOptions = this.myControl.valueChanges
     .pipe(
       startWith(''),
       map(tamount => this.filter(tamount))
     );*/

  /*filter(tamount: string) {
    console.log(tamount);

    return this.transArray.filter(option =>
      option.tamount.toLowerCase().indexOf(tamount.toLowerCase()) === 0);
  }*/


  /**
   * Method is used to open transaction dailog details
   * @param transaction - pass transaction object.
   */
  openDailog(transaction): void {
    console.log(transaction);
    let dialogRef = this.dialog.open(TransactionDataDialog, {
      width: '400px',
      data: {
        tData: transaction
      }
    });

  }

  /**
   * Get All Payments List For Citizen.
   */
  getAllPaymentsList() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.paginationService.pageIndex = (this.paginator.pageIndex + 1);
          this.paginationService.pageSize = this.pageSize;
          return this.paginationService!.getAllPaymentsData();
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          console.log(data);
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          if (data.success && data.totalRecords >= 0) {
            this.resultsLength = data.totalRecords;
            return data.data;
          } else {
            this.resultsLength = 0;
          }
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        console.log(data);
        this.dataSource.data = data
      });
  }

  /**
	 * 
	 * @param payData - json data as payment data.
	 */
  makePayment(payData) {
    this.formService.createPayment(payData).subscribe(respData => {
      swal({
        type: 'success',
        title: 'Your payment is successfull',
        html: '<p> Id : ' + respData.id + '</p><br>' +
          '<p> Amount : ' + respData.amount + '</p><br>' +
          '<p> Chalan Number : ' + respData.chalanNumber + '</p><br>' +
          '<p> Payment Date : ' + respData.paymentDate + '</p><br>' +
          '<p> Service : ' + respData.payableServices + '</p><br>' +
          '<p> Status : ' + respData.paymentStatus + '</p><br>',
        showConfirmButton: true,
        customClass: 'animated tada'
      });

      this.paymentsForm.markAsPristine();
      this.paymentsForm.markAsUntouched();
      this.paymentsForm.reset();
    });

  }

  /**
   * Method is used to get all payable services list from api.
   */
  getPayableServicesList() {
    this.formService.getPayableServiceList().subscribe(respData => {
      this.PayableServices = respData.list;
    })
  }
}


/**
 * TransactionDataDialog Component to dispaly dailog as details of payments.
 */
@Component({
  template: `
  <ol>
  <li>
    Id: {{tData.id}}
  </li>
  <li>
    Amount: {{tData.amount}}
  </li>
  <li>
    Chalan Number: {{tData.chalanNumber}}
  </li>
  <li>
    Payment Date: {{tData.paymentDate}}
  </li>
  <li>
    Status: {{tData.paymentStatus}}
  </li>
</ol>
  `
})

export class TransactionDataDialog {
  private tData: Object;
  constructor(
    public dialogRef: MatDialogRef<TransactionDataDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.tData = this.data.tData;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
