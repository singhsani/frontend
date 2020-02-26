import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationReconnectionDataSharingService } from '../../Services/application-reconnection-data-sharing.service';

@Component({
  selector: 'app-water-bill-detail',
  templateUrl: './water-bill-detail.component.html',
  styleUrls: ['./water-bill-detail.component.scss']
})
export class WaterBillDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['financialYear', 'billNo', 'billDate', 'billDueDate', 'billAmount', 'intrestOrPenaltyAmount', 'ownerDetail', 'action'];
  dataSource = [];

  constructor(private applicationReconnectionDataSharingService: ApplicationReconnectionDataSharingService) { }

  ngOnInit() {
    this.applicationReconnectionDataSharingService.getWaterBillDetail().subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationReconnectionDataSharingService.setWaterTaxDetail(item.taxWiseOutstandings);
    this.applicationReconnectionDataSharingService.setIsShowWaterBillDetail(false);
    this.applicationReconnectionDataSharingService.setIsShowWaterTaxDetail(true);
  }
  cancelForm() {
    this.applicationReconnectionDataSharingService.setIsShowWaterBillDetail(false);
  }
}