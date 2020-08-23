import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { TaxTransactionHistoryDataSharingService } from '../../Services/tax-transaction-history-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { TranslateService } from 'src/app/shared/modules/translate/translate.service';

@Component({
    selector: 'app-tax-transaction-history',
    templateUrl: './tax-transaction-history.component.html',
    styleUrls: ['./tax-transaction-history.component.scss']
})

export class TaxTransactionHistoryComponent implements OnInit, OnDestroy {
    isShowHistoryTable: boolean = false;
    isShowTransactionTable: boolean = false;
    isShowDetail: boolean = false;
    translateKey: string = 'taxTransactionScreen';

    constructor(private taxTransactionHistoryDataSharingService: TaxTransactionHistoryDataSharingService,
        public TranslateService: TranslateService) { }

    ngOnInit() {
        this.taxTransactionHistoryDataSharingService.getIsShowDetail().subscribe(data => {
            this.isShowDetail = data;
        });
        this.taxTransactionHistoryDataSharingService.getIsShowHistoryTable().subscribe(data => {
            this.isShowHistoryTable = data;
        });
        this.taxTransactionHistoryDataSharingService.getIsShowTransactionTable().subscribe(data => {
            this.isShowTransactionTable = data;
        });
    }
    ngOnDestroy() {
        this.taxTransactionHistoryDataSharingService.setIsShowHistoryTable(false);
        this.taxTransactionHistoryDataSharingService.setIsShowTransactionTable(false);
        this.taxTransactionHistoryDataSharingService.setIsShowDetail(false);
    }

}
