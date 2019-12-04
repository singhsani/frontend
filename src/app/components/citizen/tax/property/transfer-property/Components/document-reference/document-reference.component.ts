import { Component, OnInit } from '@angular/core';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { DocumentReferenceValidatorService } from '../../Services/document-reference-validator.service';
import { ValidatorService } from 'src/app/vmcshared/data-table/validator.service';
import { TableDataSource } from 'src/app/vmcshared/data-table/table-data-source';
import { DocumentReferenceModel } from '../../Models/transfer-property.model';
import { Subscription } from 'rxjs';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import swal from 'sweetalert2';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';

@Component({
  selector: 'app-document-reference',
  templateUrl: './document-reference.component.html',
  styleUrls: ['./document-reference.component.scss'],
  providers: [
    { provide: ValidatorService, useClass: DocumentReferenceValidatorService }
  ],
})

export class DocumentReferenceComponent implements OnInit {

  dateFormat = Constants.DateFormat.DDMMYYYY;
  documentTypeList = [];
  displayedColumns = ['documentTypeLookupName', 'documentNo', 'documentDate', 'actionsColumn'];
  dataSource: TableDataSource<DocumentReferenceModel>;
  subscription: Subscription;
  selectedDataModel: any = {};
  propertyDetailModel: any = {};
  isDocumentExist: boolean;
  maxDate:Date=new Date();
  
  constructor(
    private transferPropertyDataSharingService: TransferPropertyDataSharingService,
    private validatorService: ValidatorService,
    private transferPropertyService: TransferPropertyService,
    private commonService: CommonService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.isDocumentExist = false;
    this.dataSource = new TableDataSource<any>([], DocumentReferenceModel, this.validatorService);
    this.dataSource.addDatasource(new DocumentReferenceModel(), true);
    this.getLookups();
    this.transferPropertyDataSharingService.observableDataModel.subscribe((data) => {
      if (data) {
        this.selectedDataModel = data;
      }
    })
    this.subscription = this.transferPropertyDataSharingService.observablePropertyDetailModel.subscribe((data) => {
      if (data) {
        this.propertyDetailModel = data;
        this.searchDocument();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Document_Type}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.documentTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Document_Type))[0].items;

    });
  }

  searchDocument() {
    this.transferPropertyService.searchDocument(this.propertyDetailModel.propertyTransferId).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length > 0) {
          this.dataSource = new TableDataSource<any>(data.body, DocumentReferenceModel, this.validatorService);
          this.isDocumentExist = true;
        }
        else {
          this.dataSource = new TableDataSource<any>([], DocumentReferenceModel, this.validatorService);
          this.dataSource.addDatasource(new DocumentReferenceModel(), true);
          this.isDocumentExist = false;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
  }

  save(item) {
    if (item.validator.invalid) {
      if (item.validator.controls.documentTypeLookupId.invalid) {
        item.validator.controls.documentTypeLookupId.touched = true;
      }
      if (item.validator.controls.documentNo.invalid) {
        item.validator.controls.documentNo.touched = true;
      }
      if (item.validator.controls.documentDate.invalid) {
        item.validator.controls.documentDate.touched = true;
      }

    }
    else {
      var postData = item.currentData;
      postData.propertyTransferId = this.propertyDetailModel.propertyTransferId;
      postData.documentDate = this.commonService.getPayloadDate(postData.documentDate);
      this.transferPropertyService.saveDocument(postData).subscribe(
        (data) => {
          if (data.status === 200) {
            this.searchDocument();
          }
        },
        (error) => {
          if (error.status === 400) {
            var errorMessage = '';
            error.error[0].propertyList.forEach(element => {
              errorMessage = errorMessage + element + "</br>";
            });
            this.alertService.error(errorMessage);
          }
          else {
            this.alertService.error(error.error.message);
          }
        });
    }
  }

  deleteDocument(item) {
    this.alertService.confirm();
    var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
      if (isConfirm) {
        this.transferPropertyService.deleteDocument(item.currentData.documentId).subscribe(
          (data) => {
            if (data.status === 200) {
              this.searchDocument();
            }
          },
          (error) => {
            if (error.status === 400) {
              var errorMessage = '';
              error.error[0].propertyList.forEach(element => {
                errorMessage = errorMessage + element + "</br>";
              });
              this.alertService.error(errorMessage);
            }
            else {
              this.alertService.error(error.error.message);
            }
          });
      }
      subConfirm.unsubscribe();
    });
  }


  onNext() {
    if (!this.isDocumentExist) {
      this.alertService.error('Please enter at least one document detail.');
    }
    else {
      this.transferPropertyDataSharingService.updateDataSourceMoveStepper(3);
    }

  }

  onBack() {
    this.transferPropertyDataSharingService.updateDataSourceMoveStepper(1);
  }
}
