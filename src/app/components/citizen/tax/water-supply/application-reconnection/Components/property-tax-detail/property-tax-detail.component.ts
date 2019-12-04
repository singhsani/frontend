import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationReconnectionDataSharingService } from '../../Services/application-reconnection-data-sharing.service';


@Component({
  selector: 'app-property-tax-detail',
  templateUrl: './property-tax-detail.component.html',
  styleUrls: ['./property-tax-detail.component.scss']
})
export class PropertyTaxDetailComponent implements OnInit {

  
  subscription: Subscription;
  displayedColumns: string[] = ['taxName', 'billAmount', 'paidAmount'];
  dataSource = [];
  totalPaidAmount: number;
  totalBillAmount: number
  constructor(private applicationReconnectionDataSharingService: ApplicationReconnectionDataSharingService) { }

  ngOnInit() {
    this.applicationReconnectionDataSharingService.getPropertyTaxDetail().subscribe(data => {
      this.dataSource = data;
      if (this.dataSource) {
        this.totalPaidAmount = this.dataSource.map(t => t.paidAmount).reduce((acc, value) => acc + value, 0);
        this.totalBillAmount = this.dataSource.map(t => t.billAmount).reduce((acc, value) => acc + value, 0);
      }
    });
  }

  ngOnDestroy() { }

  cancelForm() {
    this.applicationReconnectionDataSharingService.setIsShowPropertyTaxDetail(false);
    this.applicationReconnectionDataSharingService.setIsShowPropertyBillDetail(true);
  }
}