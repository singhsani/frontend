import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationReconnectionDataSharingService } from '../../Services/application-reconnection-data-sharing.service';


@Component({
  selector: 'app-water-tax-detail',
  templateUrl: './water-tax-detail.component.html',
  styleUrls: ['./water-tax-detail.component.scss']
})
export class WaterTaxDetailComponent implements OnInit {

  
  subscription: Subscription;
  displayedColumns: string[] = ['taxName', 'billAmount', 'paidAmount'];
  dataSource = [];
  totalPaidAmount: number;
  totalBillAmount: number
  constructor(private applicationReconnectionDataSharingService: ApplicationReconnectionDataSharingService) { }

  ngOnInit() {
    this.applicationReconnectionDataSharingService.getWaterTaxDetail().subscribe(data => {
      this.dataSource = data;
      if (this.dataSource) {
        this.totalPaidAmount = this.dataSource.map(t => t.paidAmount).reduce((acc, value) => acc + value, 0);
        this.totalBillAmount = this.dataSource.map(t => t.billAmount).reduce((acc, value) => acc + value, 0);
      }
    });
  }

  ngOnDestroy() { }

  cancelForm() {
    this.applicationReconnectionDataSharingService.setIsShowWaterTaxDetail(false);
    this.applicationReconnectionDataSharingService.setIsShowWaterBillDetail(true);
  }
}