import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-property-tax-detail',
  templateUrl: './property-tax-detail.component.html',
  styleUrls: ['./property-tax-detail.component.scss']
})
export class PropertyTaxDetailComponent implements OnInit {

  @Input() taxDetailData;

  @Output() showPayable = new EventEmitter();
  @Output() showTaxDetail = new EventEmitter();

  dataSource = [];
  displayedColumns: string[] = ['taxName', 'billAmount', 'paidAmount'];
  totalPaidAmount: number;
  totalBillAmount: number;
  
  constructor() { }

  ngOnInit() {
    this.dataSource = this.taxDetailData;
    if (this.dataSource) {
      this.totalPaidAmount = this.dataSource.map(t => t.paidAmount).reduce((acc, value) => acc + value, 0);
      this.totalBillAmount = this.dataSource.map(t => t.billAmount).reduce((acc, value) => acc + value, 0);
    }  
  }

  cancelForm() {
    this.showTaxDetail.emit(false);
    this.showPayable.emit(true);
  }

}