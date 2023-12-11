import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { NewPropertyEntryAddService } from '../../Services/new-property-entry-add.service';
import { NewPropertyEntryAddDataSharingService } from '../../Services/new-property-entry-add-data-sharing.service';
import { Constants } from 'src/app/vmcshared/Constants';
import { Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, MatDatepickerInputEvent, Sort } from '@angular/material';
import { UnitDetailModel, MeasurementModel, RoomModel } from '../../Models/new-property-entry-add.model';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.scss']
})

export class UnitDetailComponent implements OnInit {

  @ViewChild('form') myForm: NgForm;
  translateKey: string = 'newPropertyTaxScreen';
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
  showBuildUpArea: boolean =false;
  measurementModel: MeasurementModel;
  roomModel: RoomModel;
  isShowRoomDetail: boolean = false;
  step = 0;
  measurementForm: FormGroup;
  roomForm: FormGroup;
  showCarpetAreaError:  boolean = false;
  carpetDisabled: boolean = true ;
  isDisabled: boolean = true;
  isReadOnly: boolean = true;
  measureMentVersionId :Number ; 

  constructor(private formBuilder: FormBuilder,
    private newNewPropertyEntryAddDataSharingService: NewPropertyEntryAddDataSharingService,
    private commonService: CommonService,
    private newNewPropertyEntryAddService: NewPropertyEntryAddService,
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
    this.subscription = this.newNewPropertyEntryAddDataSharingService.observableOccupier.subscribe((data) => {
      if (data) {
        this.modelOccupier = data;
        this.getUnitListByOccupierId();
       // this.clearUnit();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  revertStep() {
    this.step = 1;
  }

  getLookups() {
    const lookupcode = `lookup_codes=${Constants.LookupCodes.Floor_No}&lookup_codes=${Constants.LookupCodes.Room_Type_New}`;
    this.commonService.getLookupValuesAccordingToScreen(lookupcode).subscribe(data => {
      this.floorList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Floor_No))[0].items;
      this.roomTypeList = Object.assign([], data).filter(f => f.lookupCode.includes(Constants.LookupCodes.Room_Type_New))[0].items;
      this.floorList.sort((a, b) => (a.itemName < b.itemName ? -1 : 1));
    });
  }

  onChangedUsage(val) {
    this.unitDetailModel.subUsageMstId = null;
    if (val)
      this.getSubUsageList(val);
  }

  getUsageList() {
    this.newNewPropertyEntryAddService.getUsageList({ active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.usageList = data.body;
          this.usageList.sort((a, b) => (a.usageName < b.usageName ? -1 : 1));

        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      }
    );
  }

  searchConstructionClass() {
    this.newNewPropertyEntryAddService.searchConstructionClass({active:true}).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.constructionClassList = data.body;
          this.constructionClassList.sort((a, b) => (a.description < b.description ? -1 : 1));
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      }
    )
  }

  searchOccupancyType() {
    this.newNewPropertyEntryAddService.searchOccupancyType({active:true}).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.occupancyTypeList = data.body;
          this.occupancyTypeList.sort((a, b) => (a.occypancyType < b.occypancyType ? -1 : 1));
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      }
    );
  }

   getSubUsageList(usageMasterId) {
    this.subUsageList = [];
    this.newNewPropertyEntryAddService.getSubUsageList({ usageMasterId: usageMasterId, active: true }).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.subUsageList = data.body;
          this.subUsageList.sort((a, b) => (a.subUsage < b.subUsage ? -1 : 1));
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  getUnitListByOccupierId() {
    this.newNewPropertyEntryAddDataSharingService.updateDataSourceUnitList(null);
    this.newNewPropertyEntryAddService.getUnitListByOccupierId(this.modelOccupier.propertyOccupierId).subscribe(
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
          };
          this.dataSource.sort = this.sort;
          if (this.dataSource.data.length > 0) {
            this.isShowUnitable = true;
            this.newNewPropertyEntryAddDataSharingService.updateDataSourceUnitList(this.dataSource.data);
            const model = data.body.filter(f => f.propertyUnitId === this.unitDetailModel.propertyUnitId)
            this.unitDetailModel = model.length > 0 ? model[0] : new UnitDetailModel();
          }
          else {
            this.unitDetailModel = new UnitDetailModel();
            this.measurementModel = new MeasurementModel();
            this.measurementModel.manualArea = true;
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
    this.unitDetailModel = cloneDeep(item);
    
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
    this.isShowRoomDetail = false;
    this.setEffectiveToDateMinDate();
  }

  isDuplicateUnitNo = false;
  checkDuplicateUnitNo(event) {
    this.isDuplicateUnitNo = false;
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length && this.dataSource.data.length > 0 &&this.unitDetailModel.unitNo!=null) {
      const obj = this.dataSource.data.filter(f => f.unitNo.toLowerCase() === this.unitDetailModel.unitNo.toLowerCase()
        && f.occupierId === this.modelOccupier.propertyOccupierId
        && f.propertyBasicId === this.modelOccupier.propertyBasicVersionId
        && f.propertyUnitId !== this.unitDetailModel.propertyUnitId);
      if (obj.length > 0) {
        this.isDuplicateUnitNo = true;
      }
    }
  }

  constructionYearBind(event: MatDatepickerInputEvent<Date>) {
    this.unitDetailModel.constructionYear = null;
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
    const subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
      if (isConfirm) {
        this.newNewPropertyEntryAddService.deleteUnit(item.propertyUnitId).subscribe(
          (data) => {
            if (data.status === 200) {
              this.getUnitListByOccupierId();
              this.clearUnit();
            }
          },
          (error) => {
            this.commonService.callErrorResponse(error);
          });
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
      this.unitDetailModel.effectiveFromDate = this.commonService.getPayloadDate(this.unitDetailModel.effectiveFromDate);
      this.unitDetailModel.effectiveToDate = this.commonService.getPayloadDate(this.unitDetailModel.effectiveToDate);
      this.unitDetailModel.buildingPermissionDate = this.commonService.getPayloadDate(this.unitDetailModel.buildingPermissionDate);
      this.unitDetailModel.occupancyCertificateDate = this.commonService.getPayloadDate(this.unitDetailModel.occupancyCertificateDate);
      this.unitDetailModel.tikaDate = this.commonService.getPayloadDate(this.unitDetailModel.tikaDate);
      if (this.unitDetailModel.completionDate)
        this.unitDetailModel.completionDate = this.commonService.getPayloadDate(this.unitDetailModel.completionDate);
      this.newNewPropertyEntryAddService.saveUnit(this.unitDetailModel).subscribe(
        (data) => {
          if (data.status === 200) {
            this.unitDetailModel.propertyUnitId = data.body.data;
            this.selectedRowIndex = this.unitDetailModel.propertyUnitId;
            this.isEditMode = true;
            this.step = 1;
            this.getUnitListByOccupierId();
          }
          if(form.submitted){
            this.showBuildUpArea = true;
              form.resetForm();
          }
        },
        (error) => {
          this.commonService.callErrorResponse(error);
        });
    }else if(!form.form.valid){
      if(!this.myForm.form.controls['buildingPermissionNo'].value){
        this.myForm.form.controls['buildingPermissionNo'].setErrors(null);
        this.myForm.form.controls['buildingPermissionDate'].setErrors(null);
      }
      if(!this.myForm.form.controls['occupancyCertificateNo'].value){
        this.myForm.form.controls['occupancyCertificateNo'].setErrors(null);
        this.myForm.form.controls['occupancyCertificateDate'].setErrors(null);
      }
      if(!this.myForm.form.controls['completionNo'].value){
        this.myForm.form.controls['completionNo'].setErrors(null);
        this.myForm.form.controls['completionDate'].setErrors(null);
      }
    }
  }

  clearUnit() {
    this.isEditMode = false;
    this.unitDetailModel = new UnitDetailModel();
    this.measurementModel = new MeasurementModel();
    this.measurementModel.manualArea = true;
    this.step = 0;
  }

  clearUnitData(form : NgForm) {
    let unitId;
    let unitNo;
    if(this.unitDetailModel.propertyUnitId){
      unitId = this.unitDetailModel.propertyUnitId;
      unitNo = this.unitDetailModel.unitNo;
    }
    form.resetForm();
    setTimeout(() => {
    this.unitDetailModel = new UnitDetailModel();
    this.unitDetailModel.propertyUnitId = unitId;
    this.unitDetailModel.unitNo = unitNo;
    },);
  }
  // saveMeasurementDetail(form: NgForm) {
  //   if (form.form.valid) {
  //     this.measurementModel.propertyUnitVersionId = this.unitDetailModel.propertyUnitId;
  //     this.measurementModel.generalTax = this.measurementModel.generalTax ? this.measurementModel.generalTax : 0;
  //     this.measurementModel.valuation = this.measurementModel.valuation ? this.measurementModel.valuation : 0;
  //     this.newNewPropertyEntryAddService.saveMeasurement(this.measurementModel).subscribe(
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
    this.newNewPropertyEntryAddService.viewMeasurement(this.unitDetailModel.propertyUnitId).subscribe(
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
  //     this.newNewPropertyEntryAddService.saveRoom(this.roomModel).subscribe(
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
    const subConfirm = this.alertService.getConfirm().subscribe(isConfirm => {
      if (isConfirm) {
        this.newNewPropertyEntryAddService.deleteRoom(item.propertyRoomId).subscribe(
          (data) => {
            if (data.status === 200) {
              this.roomModel = new RoomModel();
              this.viewMeasurement();
              this.getUnitListByOccupierId();
            }
          },
          (error) => {
            this.commonService.callErrorResponse(error);
          });
      }
      subConfirm.unsubscribe();
    });

  }

  getRoomListByUnitId() {
    this.newNewPropertyEntryAddService.getRoomListByUnitId(this.unitDetailModel.propertyUnitId).subscribe(
      (data) => {
        if (data.status === 200) {
          this.dataSourceRoom = new MatTableDataSource(data.body);
          this.dataSourceRoom.sort = this.sort;
          if (this.dataSourceRoom.data.length > 0) {
            this.isShowRoomDetail = true;
            this.measurementModel.manualArea = false;
          } else {
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
    this.newNewPropertyEntryAddDataSharingService.updateDataSourceMoveStepper(3);
  }


  setMeasurementAssessableArea() {
    if (this.measurementModel.carpetArea != null && this.measurementModel.exemptedArea != null) {
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

    if(this.roomModel.assessableArea!=null){
      this.roomModel.assessableArea = parseFloat((this.roomModel.carpetArea - this.roomModel.exemptedArea).toFixed(2));
    }

    if(this.roomModel.builtUpArea<this.roomModel.carpetArea){
      this.showCarpetAreaError = true;

      console.log("this.showCarpetAreaError - > ", this.showCarpetAreaError);
    }

  }

  setStep(index: number) {
    this.step = index;
  }


  initMeasurementForm() {
    this.measurementForm = this.formBuilder.group({
      builtUpArea: new FormControl(null),
      carpetArea: new FormControl(null, Validators.required),
      exemptedArea: new FormControl(null, Validators.required),
      assessableArea: new FormControl({ value: null, disabled: true }),
      valuation: new FormControl({ value: null, disabled: true }),
      generalTax: new FormControl({ value: null, disabled: true }),
      manualArea: new FormControl(),
    }, {
        validator: [ this.checkIsValidExempteArea('carpetArea', 'exemptedArea')]
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
    this.newNewPropertyEntryAddService.saveMeasurement(this.measurementModel).subscribe(
      (data) => {
        if (data.status === 200) {
          this.measurementModel.propertyMeasurementId = data.body.data;
          // this.getUnitListByOccupierId();
          // this.viewMeasurement();
          const tempMeasurementId = data.body.data;
          this.saveMeasurementTax(tempMeasurementId, 0);
          }
          this.showBuildUpArea=false;
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  // checkIsValidBuildUpCarpetArea(firstControlName: string, secondControlName: string) {
  //   return (formGroup: FormGroup) => {
  //     const control1 = formGroup.controls[firstControlName];
  //     const control2 = formGroup.controls[secondControlName];
  //     if (control2.errors && !control2.errors.isValidArea) {
  //       return;
  //     }

  //     if (parseFloat(control1.value) < parseFloat(control2.value)) {
  //       control2.setErrors({ isValidArea: true });
  //     } else {
  //       control2.setErrors(null);
  //     }
  //   };
  // }
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
    };
  }

  // checkIsValidRoomBuildUpCarpetArea(firstControlName: string, secondControlName: string) {
  //   return (formGroup: FormGroup) => {
  //     const control1 = formGroup.controls[firstControlName];
  //     const control2 = formGroup.controls[secondControlName];
  //     if (control1.errors && !control1.errors.isBuiltUpValidArea) {
  //       return;
  //     }

  //     if (parseFloat(control1.value) < parseFloat(control2.value)) {
  //       control1.setErrors({ isBuiltUpValidArea: true });
  //     } else {
  //       control1.setErrors(null);
  //     }
  //   };
  // }



  checkIsValidCarpetArea(firstControlName: string, secondControlName: string) {
    return (formGroup: FormGroup) => {
      const control1 = formGroup.controls[firstControlName];
      const control2 = formGroup.controls[secondControlName];
      if (control2.errors && !control2.errors.isCarpetAreaValid) {
        return;
      }

      if (parseFloat(control1.value) < parseFloat(control2.value)) {
        control2.setErrors({ isCarpetAreaValid: true });
      } else {
        control2.setErrors(null);
      }
    };
  }


  initRoomForm() {
    this.roomForm = this.formBuilder.group({
      builtUpAreaRoom: new FormControl(null),
      roomTypeLookupId: new FormControl(null, Validators.required),
      length: new FormControl(null, Validators.required),
      breadth: new FormControl(null, Validators.required),
      exemptedAreaRoom: new FormControl(null, Validators.required),
      carpetAreaRoom: new FormControl({ value: null }),
      assessableAreaRoom: new FormControl({ value: null, disabled: true }),
      valuation: new FormControl({ value: null, disabled: true }),
    }, {
        validator: [this.checkIsValidExempteArea('carpetAreaRoom', 'exemptedAreaRoom'),
        this.checkIsValidCarpetArea('builtUpAreaRoom', 'carpetAreaRoom')]
      });
  }

  get formRoom() { return this.roomForm.controls; }

  onSubmitRoom(form:NgForm) {

    if (this.roomForm.invalid) {
      return;
    }

    this.roomModel.propertyUnitVersionId = this.unitDetailModel.propertyUnitId;
    this.newNewPropertyEntryAddService.saveRoom(this.roomModel).subscribe(
      (data) => {
        if (data.status === 200) {
          this.roomModel = new RoomModel();
         // this.viewMeasurement();
          this.measureMentVersionId = data.body.data;
          this.saveMeasurementTax(0,this.measureMentVersionId);
        //  this.getUnitListByOccupierId();
          form.resetForm();
          this.clearRoom();
        }
      },
      (error) => {
        this.commonService.callErrorResponse(error);
      });
  }

  updateValidation(event1, event2) {
    if(event1.value){
      event2.setValidators([Validators.required]);
    }else{
     event2.clearValidators();
    }
    event2.updateValueAndValidity();
  }

  saveMeasurementTax(mesurementId:Number,roomId:Number ){
    this.newNewPropertyEntryAddService.saveMeasurementTax(mesurementId,roomId).subscribe(
      (data) => {
        if (data) {
          this.getUnitListByOccupierId();
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

  sortData(sort: Sort) {
    const data = this.dataSourceRoom.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSourceRoom.data = data;
      return;
    }
    this.dataSourceRoom.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'roomTypeName':
          return compare(a.roomTypeName, b.roomTypeName, isAsc);
        case 'length':
          return compare(a.length, b.length, isAsc);
        case 'breadth':
          return compare(a.breadth, b.breadth, isAsc);
        case 'carpetArea':
          return compare(a.carpetArea, b.carpetArea, isAsc);
        default:
          return 0;
      }
    });

  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
