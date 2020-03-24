import { Component, OnInit } from '@angular/core';
import { TaxRebateApplicationService } from '../../tax/property/tax-rebate-application/Services/tax-rebate-application.service';
import { Constants } from '../../../../vmcshared/Constants';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { convertCompilerOptionsFromJson } from 'typescript';
import { CommonService } from '../../../../shared/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageRoutes } from '../../../../config/routes-conf';
import { WaterDrinageConfig } from '../water-drinage-config';
import * as _ from 'lodash';


@Component({
  selector: 'app-water-pipeline-work-completion',
  templateUrl: './water-pipeline-work-completion.component.html',
  styleUrls: ['./water-pipeline-work-completion.component.scss']
})
export class WaterPipelineWorkCompletionComponent implements OnInit {


  wardZoneLevel = [];
  wardZoneLevel1List = [];
  apiCode: string;
  

  disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
  waterPipelineWorkCompletionForm: FormGroup;

  displayedColumns: string[] = ['id', 'workOrderNo', 'developerFullName', 'contractorFullName', 
                                'workOrderDate', 'estimateAmount', 'workOrderValidTill', 'connectionStatus'];

  dataSource: any[] = [
    // {id:0, workOrderNo: 1, developerFullName: 'Hydrogen', contractorFullName: 1.0079, workOrderDate: 'H', estimateAmount: 10, workOrderValidTill: 'H2', connectionStatus: 'IN_PROGRESS', schemeName: 'abc1'},
    // {id:1, workOrderNo: 2, developerFullName: 'Helium', contractorFullName: 4.0026, workOrderDate: 'He', estimateAmount: 20, workOrderValidTill: 'H3', connectionStatus: 'IN_PROGRESS', schemeName: 'abc2'}
  ];

  selection = new SelectionModel<any>(true, []);
  isFromShow: boolean = true;
  selectedRowId: any;
  selectedIdArr: any[] = [];
  waterPipelineWorkCompletionSearchForm: FormGroup;
  waterPipelineConnection: any = null;

  config: WaterDrinageConfig = new WaterDrinageConfig();
  uploadFilesArray: any[] = [];

  constructor(
    private taxRebateApplicationService: TaxRebateApplicationService,
    private fb: FormBuilder,
    private formActionsService: FormsActionsService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    debugger;
    this.route.paramMap.subscribe(param => {
      //this.apiCode = param.get('apiCode');
      this.formActionsService.apiType = 'wtrPipeConnWorkCompletion';
    });
    this.waterPipelineWorkCompletionControls();
    this.waterPipelineWorkCompletionSearchControls();
    this.getWardZoneLevel();
  }

  waterPipelineWorkCompletionSearchControls() {
    this.waterPipelineWorkCompletionSearchForm = this.fb.group({
      workCompletionWard: [''],
      workCompletionSchemeName: [''],
      workCompletionWorkOrderNo: [''],
      workCompletionDate: ['']
    });
  }

  waterPipelineWorkCompletionControls() {
    this.waterPipelineWorkCompletionForm = this.fb.group({
      tpiName: [''],
      connectionApplyFor: ['BOTH', Validators.required],
      attachments: [],
      waterPipeLineConnectionDTO: this.fb.group({
        serviceCode: 'HEL-WTR-PIPELINE',
      /* Step 1 controls start */
      fieldView: [null],
      fieldList: [null],
      schemeName: [null, [Validators.required, Validators.maxLength(200)]],
      landmark: [null],
      societyName: [null, [Validators.required, Validators.maxLength(150)]],
      propertyAddress: [null, [Validators.required, Validators.maxLength(200)]],
      contractorAddress: [null, [Validators.required, Validators.maxLength(200)]],
      mobileNo: [null, [Validators.maxLength(10)]],
      // waterPipelineZone: this.fb.group({
      //   code: [null, Validators.required]
      // }),
      // waterPipelineWard: this.fb.group({
      //   code: [null, Validators.required]
      // }),
      waterPipelineZoneId: [null, [Validators.required]],
      waterPipelineWardId: [null, [Validators.required]],
      //firmCity: [null, [Validators.required, Validators.maxLength(10)]],
      tpNo: [null],
      fpNo: [null],
      revenueSurveyNo: [null],
      citySurveyNo: [null],
      buildingPermissionNo: [null],
      buildingPermissionDate: [null],
      developerFullName: [null, [Validators.required, Validators.maxLength(200)]],
      developerAddress: [null, [Validators.required, Validators.maxLength(200)]],
      developerMobileNo: [null, [Validators.maxLength(10)]],
      developerEmailId: [null],
      reraRegNo: [null, [Validators.required]],

      contractorFullName: [null, [Validators.required, Validators.maxLength(200)]],
      contractorMobileNo: [null, [Validators.maxLength(10)]],
      contractorEmailId: [null],
      registrationNumber: [null, [Validators.required]],
      registrationDate: [null, Validators.required],
      registrationClass: [null, Validators.required],
      workExecutionFromAmount: [null, [Validators.required]],
      workExecutionToAmount: [null, [Validators.required]],
      registrationValidity: [null],
      reraRegistrationDate: [null, Validators.required],
      attachments: [],
      paymentMode: this.fb.group({
        code: [null]
      }),
      workOrderNo: [null],
      workOrderDate: [null],
      estimateAmount: [0],
      connectionStatus: [null]
      })
    });
  }

  getWardZoneLevel() {
    this.taxRebateApplicationService.getWardZoneLevel().subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel = data.body;
          console.log('wardZoneLevel', this.wardZoneLevel);
          this.wardZoneLevel.sort((a, b) => a.levelOrderSequence - b.levelOrderSequence);
          this.getWardZoneFirstLevel();
        }
      },
      (error) => {
        console.log('error', error);
      }
    )
  }

  getWardZoneFirstLevel() {
    this.taxRebateApplicationService.getWardZoneFirstLevel(1, Constants.ModuleKey.Property_Tax).subscribe(
      (data) => {
        if (data.status === 200 && data.body.length) {
          this.wardZoneLevel1List = data.body;
        }
      },
      (error) => {
        console.log('error', error);
      })
  }

  oneRowSelected(row, currentlySelected) {
    debugger;
    this.selectedRowId = row.id;
    if(this.selectedIdArr.length > 0 && this.selectedIdArr.indexOf(row.id) > -1) {
      this.selectedIdArr = [];
      this.isFromShow = true;
      this.waterPipelineConnection = null;
    } else {
      this.selectedIdArr = [];
      this.selectedIdArr.push(row.id);
      this.isFromShow = false;
      this.waterPipelineConnection = row;
      this.formActionsService.getWtrPipAppsByWaterPipelineConnection(row.id).subscribe(
        res => {
          console.log(res);
          if(res.data) {
            //get api call
            this.formActionsService.getFormData(row.serviceFormId).subscribe(
              res => {
                this.waterPipelineWorkCompletionForm.patchValue(res);
                res.serviceDetail.serviceUploadDocuments.forEach(app => {
                  (<FormArray>this.waterPipelineWorkCompletionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
                });
                this.requiredDocumentList();
              }, error => {
                if (error.error && error.error.length) {
                  this.commonService.openAlert("Warning", error.error[0].message, "warning");
                }
              }
            );
          } else {
            debugger;
            //create api call.
            this.formActionsService.createFormData().subscribe(res => {
              this.waterPipelineWorkCompletionForm.patchValue(res);
              let rowJson = {waterPipeLineConnectionDTO: row};
              this.waterPipelineWorkCompletionForm.patchValue(rowJson);
              res.serviceDetail.serviceUploadDocuments.forEach(app => {
                (<FormArray>this.waterPipelineWorkCompletionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
              });
              this.requiredDocumentList();
            }, error=> {
              if (error.error && error.error.length) {
                this.commonService.openAlert("Warning", error.error[0].message, "warning");
              }
            })
          }
        }, error => {
          if (error.error && error.error.length) {
            this.commonService.openAlert("Warning", error.error[0].message, "warning");
          }
        }
      );
      //this.waterPipelineWorkCompletionForm.patchValue(row);
      // console.log('form control value befor set');
      // console.log(this.waterPipelineWorkCompletionForm.value);
      // this.waterPipelineWorkCompletionForm.patchValue({developerFullName: row.developerFullName});
      // this.waterPipelineWorkCompletionForm.updateValueAndValidity({});
      // console.log('form control value after set');
      // console.log(this.waterPipelineWorkCompletionForm.value);

      
    }
  }

  requiredDocumentList() {
    this.uploadFilesArray = [];
    _.forEach(this.waterPipelineWorkCompletionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
      if (value.mandatory && value.isActive && value.requiredOnCitizenPortal) {
        this.uploadFilesArray.push({
          'labelName': value.documentLabelEn,
          'fieldIdentifier': value.fieldIdentifier,
          'documentIdentifier': value.documentIdentifier
        })
      }
    });
    console.log("uploadFileArray", this.uploadFilesArray);
  }

  searchInWtrPipeline(form: any) {
    debugger;
    console.log(form);
    let date : any = this.getStringDate(form.controls['workCompletionDate'].value);
    this.formActionsService.getWaterPipelineConnectionStatusAndOthersList(
      form.controls['workCompletionWard'].value, 
      form.controls['workCompletionSchemeName'].value,
      form.controls['workCompletionWorkOrderNo'].value,
      date
    ).subscribe(res => {
      console.log('res is');
      console.log(res);
      this.dataSource = res.data;
    }, error => {
      console.log('err');
      console.log(error);
    });
  }

  getStringDate(date: any) : any {
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }


  submitWtrPipWorkCompletion(waterPipelineWorkCompletionForm: any) {
    console.log('submit is called.');
    let wtrPipelineWorkCompletion : any = {};
    wtrPipelineWorkCompletion.waterPipeLineConnectionDTO = this.waterPipelineConnection;
    wtrPipelineWorkCompletion.workCompletionOrderAppliedDate = this.getStringDate(new Date());
    wtrPipelineWorkCompletion.connectionApplyFor = 'BOTH';
    wtrPipelineWorkCompletion.tpiName = waterPipelineWorkCompletionForm.controls['tpiName'].value;
    wtrPipelineWorkCompletion.serviceFormId = 0;
    console.log('water pipeline work completion is:');
    console.log(wtrPipelineWorkCompletion);
  }


}
