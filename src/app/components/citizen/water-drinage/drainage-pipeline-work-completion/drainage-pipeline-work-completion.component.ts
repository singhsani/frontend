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
import { TranslateService } from '../../../../shared/modules/translate/translate.service';

@Component({
  selector: 'app-drainage-pipeline-work-completion',
  templateUrl: './drainage-pipeline-work-completion.component.html',
  styleUrls: ['./drainage-pipeline-work-completion.component.scss']
})
export class DrainagePipelineWorkCompletionComponent implements OnInit {


  wardZoneLevel = [];
  wardZoneLevel1List = [];
  apiCode: string;
  translateKey: string = 'drainagePipelineWorkCompletionScreen';

  disablefutureDate = new Date(moment().format('YYYY-MM-DD'));
  drainagePipelineWorkCompletionForm: FormGroup;

  isFromShow: boolean = true;
  drainagePipelineWorkCompletionSearchForm: FormGroup;
  drainagePipelineConnection: any = null;

  config: WaterDrinageConfig = new WaterDrinageConfig();
  uploadFilesArray: any[] = [];

  constructor(
    private taxRebateApplicationService: TaxRebateApplicationService,
    private fb: FormBuilder,
    private formActionsService: FormsActionsService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    public translateService: TranslateService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.apiCode = param.get('apiCode');
      this.formActionsService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
    });
    this.drainagePipelineWorkCompletionSearchControls();
    this.drainagePipelineWorkCompletionControls();
    this.getWardZoneLevel();
  }

  drainagePipelineWorkCompletionSearchControls() {
    this.drainagePipelineWorkCompletionSearchForm = this.fb.group({
      workCompletionWorkOrderNo: [''],
      applicationNo: ['']
    });
  }

  drainagePipelineWorkCompletionControls() {
    this.drainagePipelineWorkCompletionForm = this.fb.group({
      apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode),
      serviceCode: 'HEL-DRNGPIP-WRK-COMPL',
      drainagePipeLineConnectionId: [null],
      schemeName: [null],
      drainagePipelineWardId: [null],
      tpNo: [null],
      fpNo: [null],
      revenueSurveyNo: [null],
      citySurveyNo: [null],
      workOrderNo: [null],
      workOrderDate: [null],
      developerFullName: [null],
      contractorFullName: [null],
      contractorAddress: [null],
      tpiName: ['', Validators.required],
      connectionApplyFor: ['BOTH', Validators.required],
      attachments: [],
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

  requiredDocumentList() {
    this.uploadFilesArray = [];
    _.forEach(this.drainagePipelineWorkCompletionForm.get('serviceDetail').get('serviceUploadDocuments').value, (value) => {
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


  searchInDrngPipeline(form: any) {
    console.log(form);
    this.formActionsService.getDrainagePipelineConnectionStatusAndOthersList(
      form.controls['workCompletionWorkOrderNo'].value,
      form.controls['applicationNo'].value
    ).subscribe(res => {
      if(res.data) {
        this.isFromShow = false;
        this.formActionsService.getDrngPipAppsByDrainagePipelineConnection(res.data.id).subscribe(res1 => {
          if(res1.data) {
            //get api call
            this.formActionsService.getFormData(res.data.serviceFormId).subscribe(
              res2 => {
                this.drainagePipelineWorkCompletionForm.patchValue(res2);
                res2.serviceDetail.serviceUploadDocuments.forEach(app => {
                  (<FormArray>this.drainagePipelineWorkCompletionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
                });
                this.requiredDocumentList();
              }, error => {
                if (error.error && error.error.length) {
                  this.commonService.openAlert("Warning", error.error[0].message, "warning");
                }
              }
            );
          } else {
            // create api call
            this.formActionsService.createFormData().subscribe(res3 => {
              this.drainagePipelineWorkCompletionForm.patchValue(res3);
              let rowJson = {
                schemeName: res.data.schemeName,
                drainagePipelineWardId: res.data.waterPipelineWardId,
                drainagePipeLineConnectionId: res.data.id,
                tpNo: res.data.tpNo,
                fpNo: res.data.fpNo,
                revenueSurveyNo: res.data.revenueSurveyNo,
                citySurveyNo: res.data.citySurveyNo,
                workOrderNo: res.data.workOrderNo,
                workOrderDate: res.data.workOrderDate,
                developerFullName: res.data.developerFullName,
                contractorFullName: res.data.contractorFullName,
                contractorAddress: res.data.contractorAddress
              };
              this.drainagePipelineWorkCompletionForm.patchValue(rowJson);
              res3.serviceDetail.serviceUploadDocuments.forEach(app => {
                (<FormArray>this.drainagePipelineWorkCompletionForm.get('serviceDetail').get('serviceUploadDocuments')).push(this.config.createDocumentsGrp(app));
              });
              this.requiredDocumentList();
            }, error => {
              if (error.error && error.error.length) {
                this.commonService.openAlert("Warning", error.error[0].message, "warning");
              }
            });
          }
        }, error => {
          if (error.error && error.error.length) {
            this.commonService.openAlert("Warning", error.error[0].message, "warning");
          }
        });
      } else {
        this.commonService.openAlert("Warning", "No data found", "warning");
      }
    });
  }

  getStringDate(date: any) : any {
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  }

}
