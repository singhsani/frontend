import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationChangeUsageDataSharingService } from '../../Services/application-change-usage-data-sharing.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['propertyNo', 'ownerName', 'occupierName', 'dueAmount', 'rebateAmount', 'payableAmount', 'action'];
  dataSource = [];

  constructor(private applicationChangeUsageDataSharingService: ApplicationChangeUsageDataSharingService) { }

  ngOnInit() {
    this.applicationChangeUsageDataSharingService.getPropertyDetail().subscribe(data => {
            this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationChangeUsageDataSharingService.setPropertyBillDetail(item.billWiseDetails);
    this.applicationChangeUsageDataSharingService.setIsShowPropertyDetail(false);
    this.applicationChangeUsageDataSharingService.setIsShowPropertyBillDetail(true);
  }
  cancelForm() {
    this.applicationChangeUsageDataSharingService.setIsShowPropertyDetail(false);
  }
}