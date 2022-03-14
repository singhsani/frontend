import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NewWaterConnectionEntryService } from '../../Services/new-water-connection-entry.service';
import { NewWaterConnectionEntryDataSharingService } from '../../Services/new-water-connection-entry-data-sharing.service';
import { PropertyAddressModel, PropertyModel } from '../../Models/new-water-connection-entry.model';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { ManageRoutes } from 'src/app/config/routes-conf';
import { Router } from '@angular/router';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  model = new PropertyAddressModel();
  propertyModel = new PropertyModel();
  propertyAddressDetails: NgForm;
  propertyDetails: NgForm;
  subscription: Subscription;
  connectionDtlId: number;
  isShowSubmitButton: boolean = false;
  fullAddress: string;
  constructor(private newNewWaterConnectionEntryDataSharingService: NewWaterConnectionEntryDataSharingService,
    private alertService: AlertService,private router: Router,
    private newNewWaterConnectionEntryService: NewWaterConnectionEntryService) {
  }

  primaryPropertyList = [{ itemId: true, itemName: "Yes" }, { itemId: false, itemName: "No" }];
  displayedColumns = ['propertyNo', 'ownerName', 'address', "actions"];
  dataSource = [];
  isShowPropertyGrid = false;

  ngOnInit() {
    this.subscription = this.newNewWaterConnectionEntryDataSharingService.observableNewWaterConnectionEntry.subscribe((data) => {
      if (data != null) {
        this.connectionDtlId = data.connectionDtlId;
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  saveProperty(formDetails: NgForm) {
    if (formDetails.form.valid) {
      this.propertyModel.connectionDtlId = this.connectionDtlId;
      this.newNewWaterConnectionEntryService.saveProperty(this.propertyModel).subscribe(
        (data) => {
          if (data.status === 200) {
            this.getPropertyList();
            if (this.propertyModel.primaryProperty) {
              this.getPropertyAddress();
            }
            this.propertyModel = new PropertyModel();
            formDetails.resetForm();
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

  getPropertyList() {
    this.newNewWaterConnectionEntryService.getPropertyList(this.connectionDtlId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.dataSource = data.body;
          this.isShowPropertyGrid = true;
        }
        if(this.dataSource.length == 0) {
          this.isShowPropertyGrid = false;
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

  getPropertyAddress() {
    this.newNewWaterConnectionEntryService.getPropertyAddress(this.propertyModel.propertyNo).subscribe(
      (data) => {
        if (data.status === 200) {
          this.model = data.body.propertyBasic.propertyAddressDTO;
          this.model.address = data.body.propertyBasic.propertyAddressDTO.propertyAddress;
        }
      },
      (error) => {
        this.alertService.error(error.error.message);
      });
  }

  deleteProperty(item) {
    this.newNewWaterConnectionEntryService.deleteProperty(item.waterConnectionPropertyDetailId).subscribe(
      (data) => {
        if (data.status === 200) {
          if (item.primaryProperty) {
            this.model = new PropertyAddressModel();
          }
          this.getPropertyList();
          this.alertService.success(data.body.message);
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

  savePropertyAddress(formDetails: NgForm) {
    this.savePropertyAddress1(formDetails, false);
  }
  setPropertyNo(propertyNo?: any) {
    this.propertyModel.propertyNo = propertyNo;
  }
  savePropertyAddress1(formDetails: NgForm, isSubmit: boolean) {
    if (formDetails.form.valid) {
      if (!this.model.postalAddressDiff) {
        this.model.postalAddress = this.fullAddress;
      }
      this.model.connectionDtlId = this.connectionDtlId;
      this.newNewWaterConnectionEntryService.savePropertyAddress(this.model).subscribe(
        (data) => {
          if (data.status === 200) {
            this.alertService.success(data.body.message);
            this.isShowSubmitButton = true;
            this.newNewWaterConnectionEntryDataSharingService.updateDataSourceMoveStepper(3, 2);
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
  onSubmit(formDetails: NgForm) {
    this.savePropertyAddress1(formDetails,true);
  }

  // finalSubmit() {
  //   this.newNewWaterConnectionEntryService.submit(this.connectionDtlId).subscribe(
  //     (data) => {
  //       if (data.status === 200) {
  //         this.alertService.success(data.body.message);
  //         this.newNewWaterConnectionEntryDataSharingService.updateDataSourceIsShowDocument(true);
  //         //this.newNewWaterConnectionEntryDataSharingService.updateDataSourceMoveStepper(2);
  //         this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENDASHBOARD'));
  //       }
  //     },
  //     (error) => {
  //       if (error.status === 400) {
  //         var errorMessage = '';
  //         error.error[0].propertyList.forEach(element => {
  //           errorMessage = errorMessage + element + "</br>";
  //         });
  //         this.alertService.error(errorMessage);
  //       }
  //       else {
  //         this.alertService.error(error.error.message);
  //       }
  //     });

  // }


  onBackClick(){
    this.newNewWaterConnectionEntryDataSharingService.updateDataSourceMoveStepper(1);
  }

  onChangeAddress() {
    this.fullAddress = "";
    if (this.model.houseNo) {
      this.fullAddress =  this.fullAddress + `${this.model.houseNo}, `;
    }
    if (this.model.buildingName) {
       this.fullAddress =  this.fullAddress + `${this.model.buildingName}, `;
    }
    if (this.model.societyName) {
       this.fullAddress =  this.fullAddress + `${this.model.societyName}, `;
    }
    if (this.model.streetName) {
       this.fullAddress =  this.fullAddress + `${this.model.streetName}, `;
    }
    if (this.model.landMark) {
       this.fullAddress =  this.fullAddress + `${this.model.landMark}, `;
    }
    if (this.model.areaName) {
       this.fullAddress =  this.fullAddress + `${this.model.areaName}, `;
    }
    if (this.model.pincode) {
       this.fullAddress =  this.fullAddress + `Pin: ${this.model.pincode}, `;
    }

    var address2 = "";
    if (this.model.fpNo) {
      address2 = address2 + `FP No: ${this.model.fpNo}, `;
    }
    if (this.model.plotPartNo) {
      address2 = address2 + `Plot Part No: ${this.model.plotPartNo}, `;
    }
    if (this.model.tpNo) {
      address2 = address2 + `TP No: ${this.model.tpNo}, `;
    }
    if (this.model.serveyNo) {
      address2 = address2 + `Survey No: ${this.model.serveyNo}, `;
    }
     this.fullAddress =  this.fullAddress;
    if (address2 != '') {
       this.fullAddress =  address2 + '\n' +  this.fullAddress;
    }
    if ( this.fullAddress != '' && address2 != '')
       this.fullAddress =  this.fullAddress.substring(0,  this.fullAddress.length - 2);
    this.model.address =  this.fullAddress;
    // if (!this.model.postalAddressDiff) {
    //   this.model.postalAddress = fullAddress;
    // }
  }
}