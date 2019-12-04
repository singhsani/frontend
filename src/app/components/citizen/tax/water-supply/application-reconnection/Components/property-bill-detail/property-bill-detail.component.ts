import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationReconnectionDataSharingService } from '../../Services/application-reconnection-data-sharing.service';

@Component({
  selector: 'app-property-bill-detail',
  templateUrl: './property-bill-detail.component.html',
  styleUrls: ['./property-bill-detail.component.scss']
})
export class PropertyBillDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['financialYear', 'billNo', 'billDate', 'billDueDate', 'billAmount', 'intrestOrPenaltyAmount', 'ownerDetail', 'action'];
  dataSource = [];

  constructor(private applicationReconnectionDataSharingService: ApplicationReconnectionDataSharingService) { }

  ngOnInit() {
    this.applicationReconnectionDataSharingService.getPropertyBillDetail().subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationReconnectionDataSharingService.setPropertyTaxDetail(item.taxWiseOutstandings);
    this.applicationReconnectionDataSharingService.setIsShowPropertyBillDetail(false);
    this.applicationReconnectionDataSharingService.setIsShowPropertyTaxDetail(true);
  }
  cancelForm() {
    this.applicationReconnectionDataSharingService.setIsShowPropertyBillDetail(false);
    this.applicationReconnectionDataSharingService.setIsShowPropertyDetail(true);
  }
}