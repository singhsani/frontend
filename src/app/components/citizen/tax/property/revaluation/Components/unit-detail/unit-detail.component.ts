import { Component, OnInit, ViewChild } from '@angular/core';
import { RevaluationDataSharingService } from '../../Services/revaluation-data-sharing.service';
import { ValidatorService } from 'src/app/vmcshared/data-table/validator.service';
import { Subscription } from 'rxjs';
import { RevaluationService } from '../../Services/revaluation.service';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { MatSort, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
import { Constants } from 'src/app/vmcshared/Constants';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { UnitDetailModel, MeasurementModel, RoomModel } from '../../Models/revaluation.model';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss']
})

export class UnitDetailComponent implements OnInit {

  subscription: Subscription;
  modelOccupier: any = {};
  selectedRowIndex: number = -1;
  isShowUnitable: boolean = true;
  @ViewChild(MatSort) sort: MatSort;
  columns: string[] = ['unitNo', 'usageName', 'subUsage', 'builtUpArea', 'carpetArea', 'assessibleArea', 'generalTax', 'action'];
  dataSource: any = [];
  columnsRoom = ['roomTypeName', 'length', 'breadth', 'carpetArea', 'action'];
  dataSourceRoom: any = [];
  unitDetailModel: UnitDetailModel;
  floorList = [];
  roomTypeList = [];
  usageList = [];
  subUsageList = [];
  constructionClassList = [];
  occupancyTypeList = [];
  khalkuvaConnectionList = Constants.YesNoValue;
  drainageConnections = Constants.YesNoValue;
  gasConnections = Constants.YesNoValue;
  effectiveFromDateMaxDate = new Date();
  effectiveToDateMinDate = new Date();
  isEditMode: boolean = false;
  isEditRoom: boolean = false;
  measurementModel: MeasurementModel;
  roomModel: RoomModel;
  isShowRoomDetail: boolean = false;
  step = 0;
  measurementForm: FormGroup;
  roomForm: FormGroup;
  isValidEffectiveToDate: boolean = true;
  effectiveToDateErrorMessage: string;
  measureMentVersionId :Number ; 

  constructor(private formBuilder: FormBuilder,
    private revaluationDataSharingService: RevaluationDataSharingService,
    private commonService: CommonService,
    private revaluationService: RevaluationService,
    private alertService: AlertService) {
    this.unitDetailModel = new UnitDetailModel();
    this.measurementModel = new MeasurementModel();
    this.measurementModel.manualArea = true;
    this.roomModel = new RoomModel();
    // // TODO
    // this.unitDetailModel.occupierId = 512;
    // this.unitDetailModel.propertyBasicId = 584;
    // this.modelOccupier.propertyOccupierId = 512;
    // this.modelOccupier.propertyBasicVersionId = 584;
    // this.getUnitListByOccupierId();

  }

  ngOnInit() {
    this.initMeasurementForm();
    this.initRoomForm();
    this.getLookups();
    this.getUsageList();
    this.searchConstructionClass();
    this.searchOccupancyType();
    this.subscription = this.revaluationDataSharingService.observableOccupier.subscribe((data) => {
      if (data) {
        this.modelOccupier = data;
        this.getUnitListByOccupierId();
        this.clearUnit();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.isValidEffectiveToDate = true;
  }

  getLookups() {
    let lookupcode = `lookup_codes=${Constants.LookupCodes.Floor_No}&lookup_codes=${Constants.LookupCodes.Room_Type}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.floorList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Floor_No))[0].items;
      this.roomTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Room_Type))[0].items;
    });
  }

  onChangedUsage(val) {
    this.unitDetailModel.subUsageMstId = null;
    if (val)
      this.getSubUsageList(val);
  }

  getUsageList() {
    this.revaluationService.getUsageList({ active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.usageList = data.body;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      }
    )
  }

  searchConstructionClass() {
    this.revaluationService.searchConstructionClass({active:true}).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.constructionClassList = data.body;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      }
    )
  }

  searchOccupancyType() {
    this.revaluationService.searchOccupancyType({active:true}).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.occupancyTypeList = data.body;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      }
    )
  }

  getSubUsageList(usageMasterId) {
    this.subUsageList = [];
    this.revaluationService.getSubUsageList({ usageMasterId: usageMasterId, active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.subUsageList = data.body;
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      })
  }

  getUnitListByOccupierId() {
    this.revaluationDataSharingService.updateDataSourceUnitList(null);
    this.revaluationService.getUnitListByOccupierId(this.modelOccupier.propertyOccupierId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.dataSource = new MatTableDataSource(data.body);
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'builtUpArea': return item.propertyMeasurement.builtUpArea;
              case 'carpetArea': return item.propertyMeasurement.carpetArea;
              case 'assessibleArea': return item.propertyMeasurement.assessableArea;
              case 'generalTax': return item.propertyMeasurement.generalTax;
              default: return item[property];
            }
          }
          this.dataSource.sort = this.sort;
          if (this.dataSource.data.length > 0) {
            this.isShowUnitable = true;
            this.revaluationDataSharingService.updateDataSourceUnitList(this.dataSource.data);
            var model = data.body.filter(f => f.propertyUnitId == this.unitDetailModel.propertyUnitId)
            this.unitDetailModel = model.length > 0 ? model[0] : new UnitDetailModel();
          }
          else {
            this.isShowUnitable = false;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  editUnit(item) {
    this.isEditMode = true;
    this.getSubUsageList(item.usageMstId);
    this.unitDetailModel = item;
    this.viewMeasurement();
    this.selectedRowIndex = item.propertyUnitId;
    this.step = 0;
    this.roomModel = new RoomModel();

    this.setEffectiveToDateMinDate();
  }

  highlight(row) {
    this.selectedRowIndex = row.propertyUnitId;
  }

  copyUnit(item) {
    this.isEditMode = false;
    this.getSubUsageList(item.usageMstId);
    this.unitDetailModel = Object.assign({}, item);
    this.unitDetailModel.propertyUnitId = null;
    this.selectedRowIndex = -1;
    this.step = 0;
    this.measurementModel = new MeasurementModel();
    this.measurementModel.manualArea = true;
    this.roomModel = new RoomModel();
    this.roomModel = new RoomModel();
    this.isShowRoomDetail = false;
    this.setEffectiveToDateMinDate();
  }

  isDuplicateUnitNo = false;
  checkDuplicateUnitNo(event) {
    this.isDuplicateUnitNo = false;
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length && this.dataSource.data.length > 0) {
      var obj = this.dataSource.data.filter(f => f.unitNo.toLowerCase() == this.unitDetailModel.unitNo.toLowerCase()
        && f.occupierId == this.modelOccupier.propertyOccupierId
        && f.propertyBasicId == this.modelOccupier.propertyBasicVersionId
        && f.propertyUnitId != this.unitDetailModel.propertyUnitId);
      if (obj.length > 0) {
        this.isDuplicateUnitNo = true;
      }
    }
  }

  constructionYearBind(event: MatDatepickerInputEvent<Date>) {
    this.unitDetailModel.constructionYear
    if (event.value != null) {
      this.unitDetailModel.constructionYear = event.value.getFullYear();
    }
    this.setEffectiveToDateMinDate();
  }

  setEffectiveToDateMinDate() {
    if (this.unitDetailModel.effectiveFromDate) {
      this.effectiveToDateMinDate = new Date(moment(new Date(this.unitDetailModel.effectiveFromDate)).add("days", 1).toString());
    }
  }

  deleteUnit(item) {
    this.alertService.confirm();
    var subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
      if (isConfirm) {
        this.revaluationService.deleteUnit(item.propertyUnitId).subscribe(
          (data) => {
            if (data.status === 200) {
              this.getUnitListByOccupierId();
              this.clearUnit();
            }
          },
          (error) => {
            this.commonService.callErrorResponse(error);
          })
      }
      subConfirm.unsubscribe();
    });

  }

  saveUnitDetail(form: NgForm) {
    this.checkDuplicateUnitNo(null);
    if (form.form.valid && !this.isDuplicateUnitNo) {
      this.unitDetailModel.annualRent = 0;
      this.unitDetailModel.occupierId = this.modelOccupier.propertyOccupierId;
      this.unitDetailModel.propertyBasicId = this.modelOccupier.propertyBasicVersionId;

      var dataToPost = Object.assign({}, this.unitDetailModel);
      if (dataToPost.effectiveFromDate)
        dataToPost.effectiveFromDate = this.commonService.getPayloadDate(dataToPost.effectiveFromDate);
      if (dataToPost.effectiveToDate)
        dataToPost.effectiveToDate = this.commonService.getPayloadDate(dataToPost.effectiveToDate);

      if (dataToPost.tikaDate)
        dataToPost.tikaDate = this.commonService.getPayloadDate(dataToPost.tikaDate);
      if (dataToPost.buildingPermissionDate)
        dataToPost.buildingPermissionDate = this.commonService.getPayloadDate(dataToPost.buildingPermissionDate);
      if (dataToPost.occupancyCertificateDate)
        dataToPost.occupancyCertificateDate = this.commonService.getPayloadDate(dataToPost.occupancyCertificateDate);
      if (dataToPost.completionDate)
        dataToPost.completionDate = this.commonService.getPayloadDate(dataToPost.completionDate);

      this.revaluationService.saveUnit(dataToPost).subscribe(
        (data) => {
          if (data.status === 200) {
            this.unitDetailModel.propertyUnitId = data.body.data;
            this.selectedRowIndex = this.unitDetailModel.propertyUnitId;
            this.isEditMode = true;
            this.step = 1;
            this.getUnitListByOccupierId();
          }
        },
        (error) => {
          this.commonService.callErrorResponse(error);
        });
    }
  }

  clearUnit() {
    this.isEditMode = false;
    this.unitDetailModel = new UnitDetailModel();
    this.measurementModel = new MeasurementModel();
    this.measurementModel.manualArea = true;
    this.step = 0;
  }

  clearUnitData() {
    var unitId = this.unitDetailModel.propertyUnitId;
    var unitNo = this.unitDetailModel.unitNo;
    this.unitDetailModel = new UnitDetailModel();
    this.unitDetailModel.propertyUnitId = unitId;
    this.unitDetailModel.unitNo = unitNo;
  }

  // saveMeasurementDetail(form: NgForm) {
  //   if (form.form.valid) {
  //     this.measurementModel.propertyUnitVersionId = this.unitDetailModel.propertyUnitId;
  //     this.measurementModel.generalTax = this.measurementModel.generalTax ? this.measurementModel.generalTax : 0;
  //     this.measurementModel.valuation = this.measurementModel.valuation ? this.measurementModel.valuation : 0;
  //     this.revaluationService.saveMeasurement(this.measurementModel).subscribe(
  //       (data) => {
  //         if (data.status === 200) {
  //           this.measurementModel.propertyMeasurementId = data.body.data;
  //           this.getUnitListByOccupierId();
  //         }
  //       },
  //       (error) => {
  //         if (error.status === 400) {
  //           var errorMessage = '';
  //           error.error[0].propertyList.forEach(element => {
  //             errorMessage = errorMessage + element + "</br>";
  //           });
  //           this.alertService.error(errorMessage);
  //         }
  //         else {
  //           this.alertService.error(error.error.message);
  //         }
  //       });
  //   }
  // }

  viewMeasurement() {
    this.revaluationService.viewMeasurement(this.unitDetailModel.propertyUnitId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.measurementModel = data.body;
          if (this.measurementModel == null) {
            this.measurementModel = new MeasurementModel();
            this.measurementModel.manualArea = true;
          }
        }
        this.getRoomListByUnitId();
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  onChnageManualArea() {
    // this.measurementModel = new MeasurementModel();
    this.measurementModel.manualArea = false;
    this.roomModel = new RoomModel();
    this.getRoomListByUnitId();
  }

  clearMeasurement() {
    this.measurementModel = new MeasurementModel();
    this.measurementModel.manualArea = true;
  }

  // saveRoomDetail(form: NgForm) {
  //   if (form.form.valid) {
  //     this.roomModel.propertyUnitVersionId = this.unitDetailModel.propertyUnitId;
  //     this.revaluationService.saveRoom(this.roomModel).subscribe(
  //       (data) => {
  //         if (data.status === 200) {
  //           this.roomModel = new RoomModel();
  //           this.viewMeasurement();
  //           this.getUnitListByOccupierId();
  //         }
  //       },
  //       (error) => {
  //         if (error.status === 400) {
  //           var errorMessage = '';
  //           error.error[0].propertyList.forEach(element => {
  //             errorMessage = errorMessage + element + "</br>";
  //           });
  //           this.alertService.error(errorMessage);
  //         }
  //         else {
  //           this.alertService.error(error.error.message);
  //         }
  //       });

  //   }
  // }

  editRoom(item) {
    this.isEditRoom = true;
    this.roomModel = Object.assign({}, item);

  }

  copyRoom(item) {
    this.isEditRoom = false;
    this.roomModel = Object.assign({}, item);
    this.roomModel.propertyRoomId = null;
  }

  deleteRoom(item) {
    this.alertService.confirm();
    var subConfirm = this.alertService.getConfirm().subscribe(data => {
      if (data) {
        this.revaluationService.deleteRoom(item.propertyRoomId).subscribe(
          (data) => {
            if (data.status === 200) {
              this.roomModel = new RoomModel();
              this.viewMeasurement();
              this.getUnitListByOccupierId();
            }
          },
          (error) => {
            this.commonService.callErrorResponse(error);
          })
      }
      subConfirm.unsubscribe();
    });

  }

  getRoomListByUnitId() {
    this.revaluationService.getRoomListByUnitId(this.unitDetailModel.propertyUnitId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.dataSourceRoom = new MatTableDataSource(data.body);
          this.dataSourceRoom.sort = this.sort;
          if (this.dataSourceRoom.data.length > 0) {
            this.isShowRoomDetail = true;
            this.measurementModel.manualArea = false;
          }
          else {
            this.isShowRoomDetail = false;
          }
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  clearRoom() {
    this.roomModel = new RoomModel();
  }

  onBackClick() {
    this.revaluationDataSharingService.updateDataSourceMoveStepper(1);
  }

  setMeasurementAssessableArea() {
    if (this.measurementModel.carpetArea && this.measurementModel.exemptedArea) {
      this.measurementModel.assessableArea = parseFloat((this.measurementModel.carpetArea - this.measurementModel.exemptedArea).toFixed(2));
    }
  }

  setRoomeAssessableArea() {
    if (this.roomModel.carpetArea && this.roomModel.exemptedArea)
      this.roomModel.assessableArea = parseFloat((this.roomModel.carpetArea - this.roomModel.exemptedArea).toFixed(2));
  }

  setRoomCarpetArea() {
    if (this.roomModel.length && this.roomModel.breadth) {
      this.roomModel.carpetArea = parseFloat((this.roomModel.length * this.roomModel.breadth).toFixed(2));
    }
  }

  setStep(index: number) {
    this.step = index;
  }


  initMeasurementForm() {
    this.measurementForm = this.formBuilder.group({
      builtUpArea: new FormControl(null, Validators.required),
      carpetArea: new FormControl(null, Validators.required),
      exemptedArea: new FormControl(null, Validators.required),
      assessableArea: new FormControl({ value: null, disabled: true }),
      valuation: new FormControl({ value: null, disabled: true }),
      generalTax: new FormControl({ value: null, disabled: true }),
      manualArea: new FormControl(),
    }, {
        validator: [this.checkIsValidBuildUpCarpetArea('builtUpArea', 'carpetArea'), this.checkIsValidExempteArea('carpetArea', 'exemptedArea')]
      });
  }

  get formMeasurement() { return this.measurementForm.controls; }

  onSubmitMeasurement() {
    if (this.measurementForm.invalid) {
      return;
    }
    this.measurementModel.propertyUnitVersionId = this.unitDetailModel.propertyUnitId;
    this.measurementModel.generalTax = this.measurementModel.generalTax ? this.measurementModel.generalTax : 0;
    this.measurementModel.valuation = this.measurementModel.valuation ? this.measurementModel.valuation : 0;
    this.revaluationService.saveMeasurement(this.measurementModel).subscribe(
      (data) => {
        if (data.status === 200) {
          this.measurementModel.propertyMeasurementId = data.body.data;
          this.getUnitListByOccupierId();
          // this.viewMeasurement();
          const tempMeasurementId = data.body.data;
          this.saveMeasurementTax(tempMeasurementId, 0);
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  checkIsValidBuildUpCarpetArea(firstControlName: string, secondControlName: string) {
    return (formGroup: FormGroup) => {
      const control1 = formGroup.controls[firstControlName];
      const control2 = formGroup.controls[secondControlName];
      if (control2.errors && !control2.errors.isValidArea) {
        return;
      }

      if (parseFloat(control1.value) < parseFloat(control2.value)) {
        control2.setErrors({ isValidArea: true });
      } else {
        control2.setErrors(null);
      }
    }
  }
  checkIsValidExempteArea(firstControlName: string, secondControlName: string) {
    return (formGroup: FormGroup) => {
      const control1 = formGroup.controls[firstControlName];
      const control2 = formGroup.controls[secondControlName];
      if (control2.errors && !control2.errors.isValidExempteArea) {
        return;
      }
      if (parseFloat(control1.value) < parseFloat(control2.value)) {
        control2.setErrors({ isValidExempteArea: true });
      } else {
        control2.setErrors(null);
      }
    }
  }

  checkIsValidRoomBuildUpCarpetArea(firstControlName: string, secondControlName: string) {
    return (formGroup: FormGroup) => {
      const control1 = formGroup.controls[firstControlName];
      const control2 = formGroup.controls[secondControlName];
      if (control1.errors && !control1.errors.isBuiltUpValidArea) {
        return;
      }

      if (parseFloat(control1.value) < parseFloat(control2.value)) {
        control1.setErrors({ isBuiltUpValidArea: true });
      } else {
        control1.setErrors(null);
      }
    }
  }

  initRoomForm() {

    this.roomForm = this.formBuilder.group({
      builtUpAreaRoom: new FormControl(null, Validators.required),
      roomTypeLookupId: new FormControl(null, Validators.required),
      length: new FormControl(null, Validators.required),
      breadth: new FormControl(null, Validators.required),
      exemptedAreaRoom: new FormControl(null, Validators.required),
      carpetAreaRoom: new FormControl({ value: null, disabled: true }),
      assessableAreaRoom: new FormControl({ value: null, disabled: true }),
      valuation: new FormControl({ value: null, disabled: true }),
    }, {
        validator: [this.checkIsValidRoomBuildUpCarpetArea('builtUpAreaRoom', 'carpetAreaRoom'), this.checkIsValidExempteArea('carpetAreaRoom', 'exemptedAreaRoom')]
      });
  }

  get formRoom() { return this.roomForm.controls; }

  onSubmitRoom() {

    if (this.roomForm.invalid) {
      return;
    }

    this.roomModel.propertyUnitVersionId = this.unitDetailModel.propertyUnitId;
    this.revaluationService.saveRoom(this.roomModel).subscribe(
      (data) => {
        if (data.status === 200) {
          this.roomModel = new RoomModel();
        //  this.viewMeasurement();
         // this.getUnitListByOccupierId();
         this.measureMentVersionId = data.body.data;
         this.saveMeasurementTax(0,this.measureMentVersionId);
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

  saveMeasurementTax(mesurementId:Number,roomId:Number){
    this.revaluationService.saveMeasurementTax(mesurementId,roomId).subscribe(
      (data) => {
        if (data) {
          // this.getUnitListByOccupierId();
          this.viewMeasurement();
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