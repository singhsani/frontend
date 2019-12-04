import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationChangeUsageDataSharingService } from '../../Services/application-change-usage-data-sharing.service';


@Component({
  selector: 'app-property-tax-detail',
  templateUrl: './property-tax-detail.component.html',
  styleUrls: ['./property-tax-detail.component.scss']
})
export class PropertyTaxDetailComponent implements OnInit {

  
  subscription: Subscription;
  displayedColumns: string[] = ['taxName', 'billAmount', 'paidAmount'];
  dataSource = [];
  totalPaidAmount: number;
  totalBillAmount: number
  constructor(private applicationChangeUsageDataSharingService: ApplicationChangeUsageDataSharingService) { }

  ngOnInit() {
    this.applicationChangeUsageDataSharingService.getPropertyTaxDetail().subscribe(data => {
      this.dataSource = data;
      if (this.dataSource) {
        this.totalPaidAmount = this.dataSource.map(t => t.paidAmount).reduce((acc, value) => acc + value, 0);
        this.totalBillAmount = this.dataSource.map(t => t.billAmount).reduce((acc, value) => acc + value, 0);
      }
    });
  }

  ngOnDestroy() { }

  cancelForm() {
    this.applicationChangeUsageDataSharingService.setIsShowPropertyTaxDetail(false);
    this.applicationChangeUsageDataSharingService.setIsShowPropertyBillDetail(true);
  }
}