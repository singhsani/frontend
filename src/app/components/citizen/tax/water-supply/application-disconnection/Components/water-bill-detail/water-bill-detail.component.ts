import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationDisconnectionDataSharingService } from '../../Services/application-disconnection-data-sharing.service';

@Component({
  selector: 'app-water-bill-detail',
  templateUrl: './water-bill-detail.component.html',
  styleUrls: ['./water-bill-detail.component.scss']
})
export class WaterBillDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['financialYear', 'billNo', 'billDate', 'billDueDate', 'billAmount', 'intrestOrPenaltyAmount', 'ownerDetail', 'action'];
  dataSource = [];

  constructor(private applicationDisconnectionDataSharingService: ApplicationDisconnectionDataSharingService) { }

  ngOnInit() {
    this.applicationDisconnectionDataSharingService.getWaterBillDetail().subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationDisconnectionDataSharingService.setWaterTaxDetail(item.taxWiseOutstandings);
    this.applicationDisconnectionDataSharingService.setIsShowWaterBillDetail(false);
    this.applicationDisconnectionDataSharingService.setIsShowWaterTaxDetail(true);
  }
  cancelForm() {
    this.applicationDisconnectionDataSharingService.setIsShowWaterBillDetail(false);
  }
}