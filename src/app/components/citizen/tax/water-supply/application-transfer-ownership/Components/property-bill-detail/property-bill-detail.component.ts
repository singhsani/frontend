import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationTransferOwnershipDataSharingService } from '../../Services/application-transfer-ownership-data-sharing.service';

@Component({
  selector: 'app-property-bill-detail',
  templateUrl: './property-bill-detail.component.html',
  styleUrls: ['./property-bill-detail.component.scss']
})
export class PropertyBillDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['financialYear', 'billNo', 'billDate', 'billDueDate', 'billAmount', 'intrestOrPenaltyAmount', 'ownerDetail', 'action'];
  dataSource = [];

  constructor(private applicationTransferOwnershipDataSharingService: ApplicationTransferOwnershipDataSharingService) { }

  ngOnInit() {
    this.applicationTransferOwnershipDataSharingService.getPropertyBillDetail().subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationTransferOwnershipDataSharingService.setPropertyTaxDetail(item.taxWiseOutstandings);
    this.applicationTransferOwnershipDataSharingService.setIsShowPropertyBillDetail(false);
    this.applicationTransferOwnershipDataSharingService.setIsShowPropertyTaxDetail(true);
  }
  cancelForm() {
    this.applicationTransferOwnershipDataSharingService.setIsShowPropertyBillDetail(false);
    this.applicationTransferOwnershipDataSharingService.setIsShowPropertyDetail(true);
  }
}