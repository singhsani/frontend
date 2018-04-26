import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatHorizontalStepper, MatStep, MatStepLabel } from '@angular/material';

import { ValidationService } from '../../../../shared/services/validation.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
	selector: 'app-property-tax',
	templateUrl: './property-tax.component.html',
	styleUrls: ['./property-tax.component.scss']
})
export class PropertyTaxComponent implements OnInit {

	@ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
	@ViewChild(MatStepLabel) steplable: MatStepLabel;

	propertyTaxForm: FormGroup;
	propertyOwner: any = [];
	occupierDetails: any = [];
	isAddressDifferent: boolean = true;

	// Step Titles
	stepLable1: string = "Address Detail";
	stepLable2: string = "Owner Detail";
	stepLable3: string = "Unit Details";

	// for progress bar
	color = 'primary';
	mode = 'determinate';
	progressvalue = 33;
	bufferValue = 0;


	constructor(private fb: FormBuilder, private validationService: ValidationService) { }

	ngOnInit() {

		this.propertyTaxFormControls();
	}

	propertyTaxFormControls(){

		this.propertyTaxForm = this.fb.group({

			// step 1 form controls starts 
			PropertyNo: ['', Validators.required],
			oldPropertyNo: '',
			referencePropertyNo: '',
			serialNo: '',
			ward: ['', Validators.required],
			block: ['', Validators.required],
			zone: ['', Validators.required],

			plotNo: '',
			FPNo: '',
			TPNo: '',
			surveyNo: '',
			buildingName: '',
			societyName: '',
			nameOfStreet: ['', Validators.required],
			landMark: '',
			pinCode: ['', Validators.required],
			postalAddress: '',
			// step 1 form controls ends 

			// step 2 form controls starts 
			propertyOwner: this.fb.array([this.createOwner(), this.createOwner()]),// property owner form array

			propertyType: ['', Validators.required],
			propertySubType: ['', Validators.required],
			tikkaNo: '',
			tikkaDate: '',
			buildingPermNo: '',
			buildingPermDate: '',
			occupancyCertNo: '',
			occupancyCertDate: '',
			withinWaterZone: ['', Validators.required],
			highRise: ['', Validators.required],
			landClass: '',
			// step 2 form controls ends 

			// step 3 form controls starts 
			unitNo: ['', Validators.required],
			floorNo: ['', Validators.required],
			usage: ['', Validators.required],
			subUsage: ['', Validators.required],
			constructionClass: '',
			firstAssessmentDate: ['', Validators.required],
			occupancyStatus: ['', Validators.required],
			constructionYear: '',
			unitStatus: ['', Validators.required],

			occupierDetails: this.fb.array([this.createOwner(), this.createOwner()]),

			builtUpArea: ['', Validators.required],
			carpetArea: ['', Validators.required],
			exemptedArea: ['', Validators.required],
			AssembleArea: ['', Validators.required],
			AnnualRent: ['', Validators.required],
			valuation: ['', Validators.required],
			generalTax: ['', Validators.required],
			drainageConnection: '',
			gasConnection: ''
			// step 3 form controls ends 
		});
	}

	/**
	 * This method is use to create multiple property owners
	 */
	createOwner(): FormGroup {
		return this.fb.group({
			title: ['mr', Validators.required],
			firstName: ['', Validators.required],
			middleName: '',
			lastName: ['', Validators.required],
			aadharNo: '',
			mobileNo: ''
		});
	}

	/**
	 * This method use to add more owner names
	 */
	addMoreOwner(): void {
		this.propertyOwner = this.propertyTaxForm.get('propertyOwner') as FormArray;
		this.propertyOwner.push(this.createOwner());
	}

	/**
	 * This method use to add more occupier names
	 */
	addMoreOccupier(): void {
		this.occupierDetails = this.propertyTaxForm.get('occupierDetails') as FormArray;
		this.occupierDetails.push(this.createOwner());
	}

	/**
	 * This method use to remeove selected owner names
	 */
	removeOwner(i) {
		this.propertyOwner.removeAt(i);
	}

	/**
	 * This method use to remeove selected occupier names
	 */
	removeOccupier(i) {
		this.occupierDetails.removeAt(i);
	}

	/**
	 * This method use to submit property tax form
	 */
	onSubmit(value){
		console.log(value);
	}

	/**
	 * This method use to save as draft property tax form
	 */
	saveAsDraft(value){
		console.log(value);
	}


	// property block list
	propertyBlockArray: any = [
		{ name: 'Block 1', id: 'Block1' },
		{ name: 'Block 2', id: 'Block2' },
		{ name: 'Block 3', id: 'Block3' }
	];

	// property zone list
	propertyZoneArray: any = [
		{ name: 'Zone 1', id: 'Zone1' },
		{ name: 'Zone 2', id: 'Zone2' },
		{ name: 'Zone 3', id: 'Zone3' }
	];

	// property ward list
	propertyWardArray: any = [
		{ name: 'Ward 1', id: 'Ward1' },
		{ name: 'Ward 2', id: 'Ward2' },
		{ name: 'Ward 3', id: 'Ward3' }
	];

	// property type list
	propertyTypeArray: any = [
		{ name: 'COMMERCIAL', id: 'COMMERCIAL' },
		{ name: 'RESIDENTIAL', id: 'RESIDENTIAL' }
	];

	// property sub type list
	propertySubTypeArray: any = [
		{ name: 'FLAT', id: 'FLAT' },
		{ name: 'OWN', id: 'OWN' }
	];

	// property floor nos list
	propertyFloorArray: any = [
		{ name: 'Ground Floor', id: 'ground' },
		{ name: '1st Floor', id: '1st' },
		{ name: '2nd Floor', id: '2nd' },
		{ name: '3rd Floor', id: '3rd' },
	];

	// property Usage list
	propertyUsageArray: any = [
		{ name: 'COMMERCIAL', id: 'COMMERCIAL' },
		{ name: 'RESIDENTIAL', id: 'RESIDENTIAL' }
	];

	// property Sub Usage list
	propertySubUsageArray: any = [
		{ name: 'Tenament', id: 'Tenament' },
		{ name: 'Temporary', id: 'Temporary' }
	]

	// property construction class list
	propertyContruClassArray: any = [
		{ name: 'RCC Construction', id: 'RCC' },
		{ name: 'VMC COnstruction', id: 'VMC' }
	]

	// property construction class list
	propertyOccStatusArray: any = [
		{ name: 'Owner', id: 'Owner' },
		{ name: 'Tenant', id: 'Tenant' }
	]

	// property unit status list
	propertyUnitStatusArray: any = [
		{ name: 'Legal', id: 'Legal' },
		{ name: 'Illegal', id: 'Illegal' }
	]

}
