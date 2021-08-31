import { Component, OnDestroy, OnInit } from '@angular/core';
import { BillprintingdatasharingserviceService } from '../../services/billprintingdatasharingservice.service';

@Component({
  selector: 'app-bill-printing',
  templateUrl: './bill-printing.component.html',
  styleUrls: ['./bill-printing.component.scss']
})
export class BillPrintingComponent implements OnInit, OnDestroy {

  isShowTable: boolean = false;

  constructor(private billPrintingDataSharingService: BillprintingdatasharingserviceService) { }

  ngOnInit() {
    this.billPrintingDataSharingService.observableIsShowTable.subscribe(data => {
      this.isShowTable = data;
    });
  }
  ngOnDestroy() {
    this.billPrintingDataSharingService.updatedIsShowTable(false);
  }

}
