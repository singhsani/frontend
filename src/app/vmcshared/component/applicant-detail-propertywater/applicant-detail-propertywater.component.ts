import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApplicantDetailDTO, CitizenAddressDTO } from 'src/app/components/citizen/tax/Models/applicant-details.model';
import { CountryService } from 'src/app/shared/services/country.service';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-applicant-detail-propertywater',
  templateUrl: './applicant-detail-propertywater.component.html',
  styleUrls: ['./applicant-detail-propertywater.component.scss']
})
export class ApplicantDetailPropertywaterComponent implements OnInit {

	
  model = new ApplicantDetailDTO();
  countryListArray: any = [];
  stateListArray:any = [];
  cityListArray: any = [];
  editMode: boolean = false;


  @Input() serviceType : string;
  @Output() stepChange = new EventEmitter();
  @Output() applicantDetails = new EventEmitter();
  @Input() showSkipButton = false;


  
  constructor(
	  private countryService: CountryService,
) { }

  ngOnInit() {
    this.model.citizenAddressDTO = new CitizenAddressDTO();
    this.editMode = true;
    this.getCountryLists();
  }

  /**
	 * This method is use for change the country
	 * @param country - name of country
	 */
	onCountryChange(country: string) {

		this.stateListArray = [];
		this.cityListArray = [];

    	this.model.citizenAddressDTO.state = null;
    	this.model.citizenAddressDTO.city = null;
		
		if (country) {
			this.getStateLists(country);
		}

  }
  
  /**
	 * This method is use for change the state
	 * @param state - name of state
	 */
	onStateChange(state: string) {
		this.cityListArray = [];
		this.model.citizenAddressDTO.city = null;

		if (state) {
			this.getCityLists(state);
		}
	}

  /**
	 * This method is use to get country list using api
	 */
	getCountryLists() {
		this.countryService.countriesData.subscribe(data => {
			this.countryListArray = _.cloneDeep(data);
			this.countryListArray = _.orderBy(this.countryListArray, ['name'],['asc']);
			setTimeout(() => {
				if (this.editMode && this.model.citizenAddressDTO.country) {
        //   console.log(this.model.citizenAddressDTO.country.code);
					this.getStateLists(this.model.citizenAddressDTO.country);
				}
			}, 1000);
		});

  }
  
  /**
	 * This method is use to get state list using api
	 * @param name - country name
	 */
	getStateLists(country) {
		this.stateListArray = this.countryListArray.find(con => con.name === country.name).states;
		this.stateListArray = _.orderBy(this.stateListArray, ['name'],['asc']);
		if (this.editMode && this.model.citizenAddressDTO.state) {
			this.getCityLists(this.model.citizenAddressDTO.state);
		}

	}

	/**
	 * This method is use to get city list using api
	 * @param name - state name
	 */
	getCityLists(state) {
		this.cityListArray = this.stateListArray.find(obj => obj.name === state.name).cities;
		this.cityListArray = _.orderBy(this.cityListArray, ['name'],['asc']);
	}

	saveApplicantDetails(form: NgForm) {
		if (form.form.valid) {
			this.model.citizenServiceType = this.serviceType;
			this.applicantDetails.emit(this.model);	
		}
	}

	onBack(){
		if (this.serviceType === 'PRO-VAC' || this.serviceType === 'PRO-TAX-REBATE'){
			this.stepChange.emit(0);
		}else{
			this.stepChange.emit(1);
		}
		
	}

}
