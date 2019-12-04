import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationTransferOwnershipDataSharingService } from '../../Services/application-transfer-ownership-data-sharing.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['propertyNo', 'ownerName', 'occupierName', 'dueAmount', 'rebateAmount', 'payableAmount', 'action'];
  dataSource = [];

  constructor(private applicationTransferOwnershipDataSharingService: ApplicationTransferOwnershipDataSharingService) { }

  ngOnInit() {
    this.applicationTransferOwnershipDataSharingService.getPropertyDetail().subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationTransferOwnershipDataSharingService.setPropertyBillDetail(item.billWiseDetails);
    this.applicationTransferOwnershipDataSharingService.setIsShowPropertyDetail(false);
    this.applicationTransferOwnershipDataSharingService.setIsShowPropertyBillDetail(true);
  }
  cancelForm() {
    this.applicationTransferOwnershipDataSharingService.setIsShowPropertyDetail(false);
  }
}