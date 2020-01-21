import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable, merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { PaginationService } from '../../../core/services/citizen/data-services/pagination.service';

@Component({
	selector: 'app-transactions',
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

	translateKey: string = "addTransctionScreen";

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	
	displayedColumns: string[] = ['id', 'chalanNumber', 'amount', 'paymentDate', 'payableServices', 'transactionId', 'paymentStatus', 'detailsButton'];
	myControl: FormControl = new FormControl();
	resultsLength: number = 0;
	pageSize: number = 5;
	isLoadingResults: boolean = true;
	isRateLimitReached: boolean = false;
	dataSource = new MatTableDataSource();
	filteredOptions: Observable<any[]>;

	constructor(private dialog: MatDialog,
		private paginationService: PaginationService) {
	}

	ngOnInit() {
		// If the user changes the sort order, reset back to the first page.
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.getAllPaymentsList();

	}

	/**
	 * Method is used to open transaction dailog details
	 * @param transaction - pass transaction object.
	 */
	openDailog(transaction): void {
		this.dialog.open(TransactionDataDialog, {
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
		this.paginator.pageSize = 5;
		this.paginator.pageIndex = 0;

		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				startWith({}),
				switchMap(() => {
					this.isLoadingResults = true;
					this.paginationService.pageIndex = (this.paginator.pageIndex + 1);
					this.paginationService.pageSize = this.paginator.pageSize;
					return this.paginationService!.getAllPaymentsData();// NOSONAR
				}),
				map(data => {
					// Flip flag to show that loading has finished.
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
				this.dataSource.data = data
			});
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
    Payment Date: {{tData.paymentDate | date:'dd/MM/yyyy hh:mm:ss a'}}
  </li>
  <li>
    Status: {{tData.paymentStatus}}
  </li>
</ol>

	<div mat-dialog-actions align="center">
		<button mat-raised-button color="primary" (click)="onNoClick()" cdkFocusInitial>Ok</button>
	</div>
  `
})

export class TransactionDataDialog {
	public tData: any;
	constructor(
		public dialogRef: MatDialogRef<TransactionDataDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.tData = this.data.tData;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
