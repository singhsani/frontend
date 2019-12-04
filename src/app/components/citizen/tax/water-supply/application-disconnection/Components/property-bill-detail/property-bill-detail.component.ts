import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationDisconnectionDataSharingService } from '../../Services/application-disconnection-data-sharing.service';

@Component({
  selector: 'app-property-bill-detail',
  templateUrl: './property-bill-detail.component.html',
  styleUrls: ['./property-bill-detail.component.scss']
})
export class PropertyBillDetailComponent implements OnInit,OnDestroy {

  subscription: Subscription;
  displayedColumns: string[] = ['financialYear', 'billNo', 'billDate', 'billDueDate', 'billAmount', 'intrestOrPenaltyAmount', 'ownerDetail', 'action'];
  dataSource = [];

  constructor(private applicationDisconnectionDataSharingService: ApplicationDisconnectionDataSharingService) { }

  ngOnInit() {
    this.subscription = this.applicationDisconnectionDataSharingService.getPropertyBillDetail().subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onDetailClick(item) {
    this.applicationDisconnectionDataSharingService.setPropertyTaxDetail(item.taxWiseOutstandings);
    this.applicationDisconnectionDataSharingService.setIsShowPropertyBillDetail(false);
    this.applicationDisconnectionDataSharingService.setIsShowPropertyTaxDetail(true);
  }
  cancelForm() {
    this.applicationDisconnectionDataSharingService.setIsShowPropertyBillDetail(false);
    this.applicationDisconnectionDataSharingService.setIsShowPropertyDetail(true);
  }
}