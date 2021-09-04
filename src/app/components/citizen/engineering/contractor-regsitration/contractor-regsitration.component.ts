import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { AlertService } from 'src/app/vmcshared/Services/alert.service';
import { EngineeringService } from '../engineering.service';
import * as _ from 'lodash';
import { ManageRoutes } from 'src/app/config/routes-conf';
@Component({
  selector: 'app-contractor-regsitration',
  templateUrl: './contractor-regsitration.component.html',
  styleUrls: ['./contractor-regsitration.component.scss']
})
export class ContractorRegsitrationComponent implements OnInit {

  @ViewChild('residenceAddress') resAddrComponent: any;
  @ViewChild('firmAddress') officeAddrComponent: any;

  translateKey: string = 'pecRegistrationScreen';

  ownerShipDetail: FormArray;
  firmEmployeeDetail: FormArray;

  implYesNorray: Array<any> = [{ name: 'YES', code: true }, { name: 'NO', code: false }];
  tabIndex: number = 0;

  contractorRegistrationForm: FormGroup;
  maxDate: Date = new Date();
  minDate = moment().subtract(2, 'months').format('YYYY-MM-DD');
  attachmentList: any = [];
  bankNameArray: any = [];
  public serverUploadFilesArray: Array<any> = [];
  modalJsonRef: BsModalRef;

  formId: number;
  showButtons: boolean = false;

  constructor(
    private fb: FormBuilder,

    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,

    private router: Router,
    private formService: FormsActionsService,
    private modalService: BsModalService,
    private engineer: EngineeringService
  ) {
    this.engineer.apiType = "contractor";
    this.formService.apiType = "contractor";
    this.ownerShipDetail = this.fb.array([]);
    this.firmEmployeeDetail = this.fb.array([]);
  }

  ngOnInit() {
    this.contractorRegistrationControl();
    this.contractorRegistrationForm.addControl('ownerShipDetail', this.ownerShipDetail);
    this.contractorRegistrationForm.addControl('firmEmployeeDetail', this.firmEmployeeDetail);

    this.activatedRoute.paramMap.subscribe(param => {
      this.formId = Number(param.get('id'));
      this.getContractorData(this.formId);
    })

    this.getBankNames();
    this.getAllDocumentLists();

    if (!this.formId) {
      this.createFormData();
    }
  }

  createFormData() {
    this.engineer.createFormData().subscribe(res => {
      this.contractorRegistrationForm.patchValue(res);
      setTimeout(() => {
        this.showButtons = true;
      }, 0)
    });
  }
  contractorRegistrationControl() {

    this.contractorRegistrationForm = this.fb.group({

      apiType: null,
      serviceCode: null,
      serviceFormId: this.formId,
      applicationNumber: null,
      id: null,
      applicantFirstName: null,
      applicantMiddleName: null,
      applicantLastName: null,
      applicantMobileNumber: null,
      applicantEmail: null,
      serviceType: null,
      formStatus: null,
      hasFirmOrPartnership: null,
      powerOfAttorneyName: null,

      bankName: this.fb.group({
        code: [null, [Validators.required]],
        name: null
      }),

      accountNumber: null,
      branchName: null,
      firmName: null,
      firmMobileNumber: null,
      registrationDate: null,
      remarks: null,

      ownershipDetailList: this.ownerShipDetail,
      firmEmployeeDetails: this.firmEmployeeDetail,

      residenceAddress: this.fb.group(this.officeAddrComponent.addressControls()),
      firmAddress: this.fb.group(this.resAddrComponent.addressControls()),

      registrationDetail: null,
      threeYearWorkDetail: null,
      turnOverDetail: null,
      workShopAndPlantRate: null,
      hasOwnerAccountDepartment: null,
      contractorWorkDetail: null,
      hasAnyRegistrationOnAnotherOrganisation: null,
      anotherDeptOrOrgName: null,
      pastRegistrationDetail: null,
      engineerDetail: null,
      incomeTaxDetail: null,
      hasOwnerPartnerAndShareHolderApplyInAnyOrganization: null,
      solvencyAmountAndBankDetail: null,
      registrationDateOrReNewDate: null,
      oldRegistrationDate: null,
      oldRegistrationNumber: null,
      anyUnCompleteWorkDetailWithReason: null,
      hasAmountRemainingAnyCorporationOrOrganization: null,

      attachments: [],
      acceptAndCondition: [true],
      createdByCitizen: [true],
    });
    this.ownerShipDetail.push(this.createOwnerShipDetail());
    this.firmEmployeeDetail.push(this.createFirmEmployeeDetail());
  }

  getContractorData(id: number) {
    this.formService.getFormData(id).subscribe(res => {
      console.log("tresr", res)
      this.contractorRegistrationForm.patchValue(res);
      this.showButtons = true;
      this.contractorRegistrationForm.disable();
      this.setServiceDetailsOnInit(res);
     
    });
  }

  getBankNames() {
    this.engineer.getBankNames().subscribe(res => {
      this.bankNameArray = res.data;
    });
  }

  getAllDocumentLists() {
    this.engineer.getAllDocuments().subscribe(res => {
      this.attachmentList = _.cloneDeep(res);

      for (let file of this.attachmentList) {
        file['mandatory'] = false;
      }
    });
  }

  setServiceDetailsOnInit(res) {
    this.serverUploadFilesArray = res.attachments;
    const localUploadArray = [...this.serverUploadFilesArray];

    for (let file of localUploadArray) {
      console.log("file" + JSON.stringify(file));
      this.attachmentList.push(file);
    }
  }

  onTabChange(evt) {
    this.tabIndex = evt;
  }


  createOwnerShipDetail(): FormGroup {
    return this.fb.group({
      ownerType: null,
      ownerName: null,
    });
  }

  addRowOwnerShip() {
    this.ownerShipDetail.push(this.createOwnerShipDetail());
  }

  onRemoveRowOwnerShip(rowIndex: number) {
    this.ownerShipDetail.removeAt(rowIndex);
  }

  createFirmEmployeeDetail(): FormGroup {
    return this.fb.group({
      employeeName: null,
      employeeQualification: null,
      employeeStatus: null,
      experience: null,
      joiningDate: null,
      projectStartDate: null
    });
  }

  addRowFirmDetail() {
    this.firmEmployeeDetail.push(this.createFirmEmployeeDetail());
  }

  onRemoveRowFirmDetail(rowIndex: number) {
    this.firmEmployeeDetail.removeAt(rowIndex);
  }

  mandatoryFileCheck(serviceFormId, attachmentList) {
    return new Promise<any>((resolve, reject) => {
      this.formService.getFormData(serviceFormId).subscribe(respData => {
        if (respData.attachments) {
          let tempArray = [];
          respData.attachments.forEach(element => {
            tempArray.push(element.fieldIdentifier);
          });
          attachmentList.forEach(el => {
            if (tempArray.indexOf(el.fieldIdentifier) === -1 && el.mandatory) {
              resolve({ fileName: el.documentLabelEn, status: false });
              return;
            }
          });
          resolve({ fileName: "", status: true });
        } else {
          resolve({ fileName: "", status: true })
        }
      })
    })
  }

  openTermModel(template: TemplateRef<any>) {
    this.modalJsonRef = this.modalService.show(template);
  }
  hideModel() {
    this.modalJsonRef.hide();
  }


  onSubmit() {

    
    this.contractorRegistrationForm.get('serviceFormId').setValue(this.formId);

    this.mandatoryFileCheck(this.contractorRegistrationForm.get('serviceFormId').value, this.attachmentList).then(data => {
      if (data.status) {
        this.engineer.vendorSaveFormData(this.contractorRegistrationForm.getRawValue()).subscribe(res => {
          if (Object.keys(res).length) {
            this.router.navigateByUrl(ManageRoutes.getFullRoute('CITIZENDASHBOARD'));
            this.commonService.openAlert("Application Submitted Successful", "", "success", `</b>`);
            this.resetForm();
          } else {
            this.commonService.openAlert("File Upload", `Please upload file for "${data.fileName}"`, "warning");
            return
          }
        }, (err) => {
          this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
        });
        return;

      }
    });
  }

  resetForm(isBtnClicked?: boolean) {
    if (isBtnClicked) {
      this.commonService.confirmAlert('Are you sure?', 'question', 'Reset', cb => {
        this.conditionallyResetFields();
      });
    } else {
      this.conditionallyResetFields();
    }
  }


  conditionallyResetFields() {

    this.contractorRegistrationForm.enable();

  }

  patchValue() {
    const obj = {


    }

    this.contractorRegistrationForm.patchValue(obj);
  }
}