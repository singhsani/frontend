import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationChangeUsageDataSharingService } from '../../Services/application-change-usage-data-sharing.service';

@Component({
  selector: 'app-property-bill-detail',
  templateUrl: './property-bill-detail.component.html',
  styleUrls: ['./property-bill-detail.component.scss']
})
export class PropertyBillDetailComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['financialYear', 'billNo', 'billDate', 'billDueDate', 'billAmount', 'intrestOrPenaltyAmount', 'ownerDetail', 'action'];
  dataSource = [];

  constructor(private applicationChangeUsageDataSharingService: ApplicationChangeUsageDataSharingService) { }

  ngOnInit() {
    this.applicationChangeUsageDataSharingService.getPropertyBillDetail().subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnDestroy() {
  }

  onDetailClick(item) {
    this.applicationChangeUsageDataSharingService.setPropertyTaxDetail(item.taxWiseOutstandings);
    this.applicationChangeUsageDataSharingService.setIsShowPropertyBillDetail(false);
    this.applicationChangeUsageDataSharingService.setIsShowPropertyTaxDetail(true);
  }
  cancelForm() {
    this.applicationChangeUsageDataSharingService.setIsShowPropertyBillDetail(false);
    this.applicationChangeUsageDataSharingService.setIsShowPropertyDetail(true);
  }
}