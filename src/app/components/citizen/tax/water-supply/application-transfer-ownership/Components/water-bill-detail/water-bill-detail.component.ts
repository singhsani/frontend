import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationTransferOwnershipDataSharingService } from '../../Services/application-transfer-ownership-data-sharing.service';

@Component({
  selector: 'app-water-bill-detail',
  templateUrl: './water-bill-detail.component.html',
  styleUrls: ['./water-bill-detail.component.scss']
})
export class WaterBillDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['financialYear', 'billNo', 'billDate', 'billDueDate', 'billAmount', 'intrestOrPenaltyAmount', 'ownerDetail', 'action'];
  dataSource = [];

  constructor(private applicationTransferOwnershipDataSharingService: ApplicationTransferOwnershipDataSharingService) { }

  ngOnInit() {
    this.applicationTransferOwnershipDataSharingService.getWaterBillDetail().subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationTransferOwnershipDataSharingService.setWaterTaxDetail(item.taxWiseOutstandings);
    this.applicationTransferOwnershipDataSharingService.setIsShowWaterBillDetail(false);
    this.applicationTransferOwnershipDataSharingService.setIsShowWaterTaxDetail(true);
  }
  cancelForm() {
    this.applicationTransferOwnershipDataSharingService.setIsShowWaterBillDetail(false);
  }
}