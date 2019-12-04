import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationReconnectionDataSharingService } from '../../Services/application-reconnection-data-sharing.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['propertyNo', 'ownerName', 'occupierName', 'dueAmount', 'rebateAmount', 'payableAmount', 'action'];
  dataSource = [];

  constructor(private applicationReconnectionDataSharingService: ApplicationReconnectionDataSharingService) { }

  ngOnInit() {
    this.applicationReconnectionDataSharingService.getPropertyDetail().subscribe(data => {
            this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationReconnectionDataSharingService.setPropertyBillDetail(item.billWiseDetails);
    this.applicationReconnectionDataSharingService.setIsShowPropertyDetail(false);
    this.applicationReconnectionDataSharingService.setIsShowPropertyBillDetail(true);
  }
  cancelForm() {
    this.applicationReconnectionDataSharingService.setIsShowPropertyDetail(false);
  }
}