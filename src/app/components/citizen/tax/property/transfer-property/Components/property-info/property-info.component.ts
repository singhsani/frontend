import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TransferPropertyDataSharingService } from '../../Services/transfer-property-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { ApplicationModel } from '../../Models/transfer-property.model';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { TransferPropertyService } from '../../Services/transfer-property.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-property-info',
  templateUrl: './property-info.component.html',
  styleUrls: ['./property-info.component.scss']
})

export class PropertyInfoComponent implements OnInit {

  transferTypeList = [];
  transferSubTypeList = [];
  transferFloorList = [];
  applicationModel: ApplicationModel;
  subscription: Subscription;
  selectedDataModel: any = {}
  carpetArea: number;
  actualTransferDateMaxDate: Date = new Date();
  isValidTransferArea: boolean = true;
  transferPropertyInfoEditMode : Subscription
  constructor(private commonService: CommonService,
    private transferPropertyDataSharingService: TransferPropertyDataSharingService,
    private transferPropertyService: TransferPropertyService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.applicationModel = new ApplicationModel();
    this.selectedDataModel = {}
    this.getLookups();
    this.subscription = this.transferPropertyDataSharingService.observableDataModel.subscribe((data) => {
      if (data) {
        console.log(data)
        this.selectedDataModel = data;
        this.generateApplication();
        this.getCarpetArea();
        this.getFloorItems();
      }
    })

    this.transferPropertyInfoEditMode = this.transferPropertyDataSharingService.getPropertyEditModel().subscribe(data =>{ 
      if(data){
        this.applicationModel = data.detail;
        this.selectedDataModel = data.detail;
        this.getFloorItems()
        this.getTransferSubTypeLookup(data.detail.transferSubTypeLookupName)
       }
    }      
    )
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.transferPropertyInfoEditMode.unsubscribe()
  }

  getLookups() {
    //&lookup_codes=${Constants.LookupCodes.Floor_No}
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Transfer_Type}&lookup_codes=${Constants.LookupCodes.Transfer_SubType}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.transferTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Transfer_Type))[0].items;
      this.transferSubTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Transfer_SubType))[0].items;
      //this.transferFloorList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Floor_No))[0].items;
    });
  }
  generateApplication() {
    this.transferPropertyService.generateApplication({ outstandingAmount: this.selectedDataModel.outstandingAmount, propertyNo: this.selectedDataModel.propertyNo, applicationNo: this.selectedDataModel.applicationNo }).subscribe(
      (data) => {
        if (data.status === 200) {
          this.viewApplication(data.body.data);
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
        this.transferPropertyDataSharingService.updatedIsShowForm(false);

      });
  }

  getCarpetArea() {
    this.transferPropertyService.getCarpetArea(this.selectedDataModel.propertyNo).subscribe(
      (data) => {
        if (data.status === 200) {
          this.carpetArea = data.body;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  getFloorItems() {
    this.transferPropertyService.getFloors(this.selectedDataModel.propertyNo).subscribe(
      (data) => {
        if (data.status === 200) {
          this.transferFloorList = data.body;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  viewApplication(propertyTransferId) {
    this.transferPropertyService.viewApplication(propertyTransferId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.applicationModel = data.body;
          this.applicationModel.carpetArea = this.carpetArea;
          this.transferPropertyDataSharingService.applicationNo = this.applicationModel.applicationNo;
          this.transferPropertyDataSharingService.propertyTransferId = this.applicationModel.propertyTransferId;
          this.transferPropertyDataSharingService.isPaymentReceipt = data.body.paymentReceipt;
          this.transferPropertyDataSharingService.propertyServiceCode = data.body.serviceCode;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }
  onNext(formDetail: NgForm) {
    if (formDetail.form.valid  &&  this.isValidTransferArea == true) {
      this.applicationModel.actualTransferDate = this.commonService.getPayloadDate(this.applicationModel.actualTransferDate);
      this.transferPropertyService.saveDetail(this.applicationModel).subscribe(
        (data) => {
          if (data.status === 200) {
            this.transferPropertyDataSharingService.updatedIsRefreshTable(true);
            this.transferPropertyDataSharingService.updatedPropertyDetailModel(data.body.data);
            this.transferPropertyDataSharingService.updateDataSourceMoveStepper(1);
          }
        },
        (error) => {
          this.commonService.callErrorResponse(error);
        });
    }
  }

  checkIsValidTransferArea(event, transferArea) {
    this.isValidTransferArea = true;
    if (event.target.value) {
      if (parseFloat(event.target.value) > this.applicationModel.carpetArea) {
        this.isValidTransferArea = false;
        transferArea.control.status = 'INVALID';
      }
    }
  }

  onChangedTransferType(itemCode) {
      this.transferSubTypeList = [];
      this.applicationModel.transferSubTypeLookupId = null;
      if (itemCode.itemCode){
        let transferTypeCode = null;
        if(itemCode.itemCode == 'HEREDITARY'){
          transferTypeCode = 'HEREDITARY_TRANSFER_SUBTYPE'
        }else{
          transferTypeCode = 'OTHER_TRANSFER_SUBTYPE'
        }
        this.getTransferSubTypeLookup(transferTypeCode);
      }
  }

  getTransferSubTypeLookup(transferTypeCode) {
    this.transferSubTypeList = [];
    this.transferPropertyService.getTransferSubTypeLookup(transferTypeCode).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.transferSubTypeList = data.body[0].items;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      })
  }
}
