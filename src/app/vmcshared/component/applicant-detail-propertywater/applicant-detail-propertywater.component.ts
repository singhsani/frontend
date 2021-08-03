import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ApplicantDetailDTO, CitizenAddressDTO } from 'src/app/components/citizen/tax/Models/applicant-details.model';
import { CountryService } from 'src/app/shared/services/country.service';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { CommonService } from 'src/app/vmcshared/Services/common-service';
import { ApplicantAddressService } from '../../Services/applicant-address.service';
import { TransferPropertyDataSharingService } from 'src/app/components/citizen/tax/property/transfer-property/Services/transfer-property-data-sharing.service';



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


  
  constructor(
	  private countryService: CountryService,
	  private commonService: CommonService,
	  private addressService: ApplicantAddressService,
	  private transferPropertyDataSharingService: TransferPropertyDataSharingService
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
			this.model.uniqueId = this.transferPropertyDataSharingService.applicationNo;
			this.addressService.saveApplicantDetail(this.model).subscribe(
				(data) => {
					this.commonService.applicationNo = data.body.applicationNo;
					if(this.serviceType === 'PRO-TRAN'){
						this.stepChange.emit(3);
					}else{
						this.stepChange.emit(1);
					}
				},
				(error) => {
					this.commonService.callErrorResponse(error);
				});
		}
	}

	onBack(){
		this.stepChange.emit(1);
	}

}
