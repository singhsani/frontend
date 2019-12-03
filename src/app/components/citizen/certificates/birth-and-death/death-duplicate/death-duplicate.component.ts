import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { MatHorizontalStepper, MatStepLabel } from '@angular/material';
import { Location } from '@angular/common';
import { CommonService } from '../../../../../shared/services/common.service';
import { ManageRoutes } from './../../../../../config/routes-conf';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-death-duplicate',
    templateUrl: './death-duplicate.component.html',
    styleUrls: ['./death-duplicate.component.scss']
})

export class DeathDuplicateComponent implements OnInit {

	// /**
	//  * get element from html having id MatHorizontalStepper
	//  */
    // @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;

	// /**
	//  * get element from html having id MatStepLabel
	//  */
    // @ViewChild(MatStepLabel) steplable: MatStepLabel;

	/**
	 * Routing configuration
	 */
    manageRoutes: any = ManageRoutes;

	/**
	 * flag to show/hide search form.
	 */
    showSearchForm: boolean = false;

	/**
	 * flag to show duplicate application
	 */
    isVisibeDuplicateForm: boolean = true;

	/**
	 * death duplicate form group.
	 */
    deathDuplicateForm: FormGroup;

	/**
	 * language translate key.
	 */
    translateKey: string = 'DeathDuplicateScreen';

	/**
	 * application id or service form id.
	 */
    appId: number;

	/**
	 * api code
	 */
    apiCode: string;

	/**
	 * Yes/no lookup
	 */
    ISYESNO: Array<any> = [];

	/**
	 * Maximum date validation
	 */
    maxDeathDate = new Date();

	/**
	 * Min date validation
	 */
    minDeathDate;

	/**
	 * Duplicate copy mode lookup.
	 */
    DuplicateCopyMode: Array<any> = [];
    public NDCtoDuplicateDeath: any;
	/**
	 * constructor
	 * @param location 
	 * @param commonService 
	 * @param fb 
	 * @param validationService 
	 * @param router 
	 * @param route 
	 * @param formService 
	 */
    constructor(
        private location: Location,
        private commonService: CommonService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private formService: FormsActionsService
    ) { }

	/**
	 * Method initializes first.
	 */
    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            this.appId = Number(param.get('id'));
            this.apiCode = param.get('apiCode');
            this.formService.apiType = ManageRoutes.getApiTypeFromApiCode(this.apiCode);
        });

        this.DeathDuplicateFormControls();

        if (this.appId) {
            this.isVisibeDuplicateForm = false;
            this.formService.getNDCtoDuplicateDeath().subscribe(data => this.NDCtoDuplicateDeath = data)
            this.getDeathDuplicateData();
            this.getLookupData();
        } else {
            this.showSearchForm = true;
        }
    }

	/**
	 * Method is used to create death record after application found.
	 * @param data - original json.
	 */
    createDeathDuplicateRecord(data) {
        
        this.formService.createFormData().subscribe(res => {

            this.deathDuplicateForm.patchValue(res);

            this.updateDuplicateRecordValue(data);

            this.appId = res.serviceFormId;

            let cururl = this.location.path().replace('false', this.appId.toString());

            this.location.go(cururl);
        }, err => {
            this.commonService.openAlert("Warning", "Something Went Wrong", "warning");
        });
    }

	/**
	 * Method is used to update duplicate form data with original json.
	 * @param data - original json.
	 */
    updateDuplicateRecordValue(data) {
        this.deathDuplicateForm.get('deathDate').setValue(data.deathDate);
    }

	/**
	 * Method is used to get death duplicate data.
	 */
    getDeathDuplicateData() {
        this.formService.getFormData(this.appId).subscribe(res => {
            this.deathDuplicateForm.patchValue(res);
            this.deathDuplicateForm.patchValue(this.NDCtoDuplicateDeath);
            this.deathDuplicateForm.get('deathRegNumber').setValue(this.NDCtoDuplicateDeath.certificateno)
        },
        err => {});
    }

	/**
	 * Method is used to handle error/validation on submit
	 * @param count - count of invalid control.
	 */
    handleErrorsOnSubmit(count) {
        let step1 = 6;
        if (count <= step1) {
            return false;
        }
    }

	/**
	 * This method is use for get lookup data
	 */
    getLookupData() {
        this.formService.getDataFromLookups().subscribe(res => {
            
            this.DuplicateCopyMode = res.DUPLICATE_COPY_MODE;
            this.ISYESNO = res.YES_NO;
        });
    }

	/**
	 * Method is used to craete death duplicate controls.
	 */
    DeathDuplicateFormControls() {
        this.deathDuplicateForm = this.fb.group({
            deathRegNumber: [null],
            deathRegYear: [null],
            deathDate: [null],
            deathRegDate: [null],
            duplicateCopies: this.fb.group({
                code: [null, [Validators.required]],
                id: null,
                name: null,
            }),
            duplicateCopyMode: this.fb.group({
                code: [null, [Validators.required]],
                gujName: null,
                id: null,
                name: null,
                orderSequence: null,
                type: null,
                uniqueId: null,
                version: null
            }),
            totalCopies: [null, Validators.required],
            apiType: ManageRoutes.getApiTypeFromApiCode(this.apiCode)
        });
    }

	/**
	 * Method is used to calculate death date.
	 * @param event - date event.
	 */
    deathDateCalculator(event) {
        this.deathDuplicateForm.get('deathDate').setValue(moment(event.value).format("YYYY-MM-DD"));
        this.minDeathDate = event.value;
    }

	/**
	 * Method is used to calculate death Registration date.
	 * @param event - date event.
	 */
    deathRegCalculator(event) {
        this.deathDuplicateForm.get('deathRegDate').setValue(moment(event.value).format("YYYY-MM-DD"));
    }

	/**
	 * method is outpu event from search record.
	 * @param event - returned event.
	 */
    showDuplicateForm(event) {
        if (event) {
            this.getLookupData();
            this.createDeathDuplicateRecord(event);
            this.isVisibeDuplicateForm = false;
            this.showSearchForm = false;
        }
        else{
			this.formService.apiType = ManageRoutes.getApiTypeFromApiCode('HEL-NRCDR');
			this.formService.createFormData().subscribe(res => {
				let redirectUrl = ManageRoutes.getFullRoute('HEL-NRCDR');
				this.router.navigate([redirectUrl, res.serviceFormId, 'HEL-NRCDR']);
			});
		}
    }
}
