import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationDisconnectionDataSharingService } from '../../Services/application-disconnection-data-sharing.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['propertyNo', 'ownerName', 'occupierName', 'dueAmount', 'rebateAmount', 'payableAmount', 'action'];
  dataSource = [];

  constructor(private applicationDisconnectionDataSharingService: ApplicationDisconnectionDataSharingService) { }

  ngOnInit() {
    this.applicationDisconnectionDataSharingService.getPropertyDetail().subscribe(data => {
            this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationDisconnectionDataSharingService.setPropertyBillDetail(item.billWiseDetails);
    this.applicationDisconnectionDataSharingService.setIsShowPropertyDetail(false);
    this.applicationDisconnectionDataSharingService.setIsShowPropertyBillDetail(true);
  }
  cancelForm() {
    this.applicationDisconnectionDataSharingService.setIsShowPropertyDetail(false);
  }
}