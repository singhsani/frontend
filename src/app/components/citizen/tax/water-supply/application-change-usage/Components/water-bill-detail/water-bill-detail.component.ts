import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationChangeUsageDataSharingService } from '../../Services/application-change-usage-data-sharing.service';

@Component({
  selector: 'app-water-bill-detail',
  templateUrl: './water-bill-detail.component.html',
  styleUrls: ['./water-bill-detail.component.scss']
})
export class WaterBillDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['financialYear', 'billNo', 'billDate', 'billDueDate', 'billAmount', 'intrestOrPenaltyAmount', 'ownerDetail', 'action'];
  dataSource = [];

  constructor(private applicationChangeUsageDataSharingService: ApplicationChangeUsageDataSharingService) { }

  ngOnInit() {
    this.applicationChangeUsageDataSharingService.getWaterBillDetail().subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationChangeUsageDataSharingService.setWaterTaxDetail(item.taxWiseOutstandings);
    this.applicationChangeUsageDataSharingService.setIsShowWaterBillDetail(false);
    this.applicationChangeUsageDataSharingService.setIsShowWaterTaxDetail(true);
  }
  cancelForm() {
    this.applicationChangeUsageDataSharingService.setIsShowWaterBillDetail(false);
  }
}