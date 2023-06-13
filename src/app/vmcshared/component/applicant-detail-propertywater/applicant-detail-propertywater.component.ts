import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ApplicantDetailDTO, CitizenAddressDTO } from 'src/app/components/citizen/tax/Models/applicant-details.model';
import { CountryService } from 'src/app/shared/services/country.service';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { CommonService } from '../../Services/common-service';
import { CommonService as CommonServiceTwo} from 'src/app/shared/services/common.service';
import { DataSharingService } from '../../Services/data-sharing.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-applicant-detail-propertywater',
  templateUrl: './applicant-detail-propertywater.component.html',
  styleUrls: ['./applicant-detail-propertywater.component.scss']
})
export class ApplicantDetailPropertywaterComponent implements OnInit, OnDestroy {


  model = new ApplicantDetailDTO();
  countryListArray: any = [];
  stateListArray:any = [];
  cityListArray: any = [];
  editMode: boolean = false;

  @Input() serviceType : string;
  @Output() stepChange = new EventEmitter();
  @Output() applicantDetails = new EventEmitter();
  @Input() showSkipButton = false;

  subscription : Subscription;


  constructor(
	  private countryService: CountryService,
	  private commonService:CommonService,
	  private commonServcie2 : CommonServiceTwo,
	  private  propertyEntryAddDataSharingService : DataSharingService,
) { }

  ngOnInit() {
    this.model.citizenAddressDTO = new CitizenAddressDTO();
    this.editMode = true;
	this.getCountryLists();
	// this.getUserProfile();

	this.subscription = this.propertyEntryAddDataSharingService.getApplicantDetailsEditModel().subscribe(data => {
		if (data) {
			delete data.detail
			delete data.ownerDetail
			this.model = data;
			this.model.email = data.emailAddress ? data.emailAddress : data.email
			this.model.mobileNo = data.contactNo ? data.contactNo : data.mobileNo
			this.model.citizenAddressDTO = data.citizenAddressDTO
		}
		else {
			this.getUserProfile();
		}

	});
  }

  ngOnDestroy() {	
	this.propertyEntryAddDataSharingService.setApplicantDetailsEditModel(null);
	this.subscription.unsubscribe();
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
		const ele = country.name || country;
		this.stateListArray = this.countryListArray.find(con => con.name === ele).states;
		this.stateListArray = _.orderBy(this.stateListArray, ['name'], ['asc']);
		setTimeout(() => {
			if (this.editMode && this.model.citizenAddressDTO.state) {
                this.getCityLists(this.model.citizenAddressDTO.state);
			}
		}, 1000);
	}

	/**
	 * This method is use to get city list using api
	 * @param name - state name
	 */
	getCityLists(state) {
        const ele = state.name || state;
		this.cityListArray = this.stateListArray.find(obj => obj.name.toLowerCase() === ele.toLowerCase()).cities;
		this.cityListArray = _.orderBy(this.cityListArray, ['name'], ['asc']);
	}

	saveApplicantDetails(form: NgForm) {
		if (form.form.valid) {
			this.model.citizenServiceType = this.serviceType;
			this.applicantDetails.emit(this.model);
		}
	}

	onBack(){
		if (this.serviceType === 'PRO-VAC' || this.serviceType === 'PRO-TAX-REBATE' || this.serviceType === 'PRO-REFUND') {
			this.stepChange.emit(0);
		}else{
			this.stepChange.emit(1);
		}

	}

	getUserProfile(){

		if(!this.commonServcie2.fromAdmin()) {
			this.commonService.getUserProfile().subscribe(res => {
				const userData = res['data'];
				if(userData){
					this.model.firstName = userData.firstName;
					this.model.lastName = userData.lastName;
					this.model.middleName = userData.middleName;
					this.model.mobileNo = userData.cellNo;
					this.model.email = userData.email;
					this.model.citizenAddressDTO.buildingName = userData.buildingName;
					this.model.citizenAddressDTO.streetName = userData.streetName;
					this.model.citizenAddressDTO.landmark = userData.landmark;
					this.model.citizenAddressDTO.area = userData.area;
					this.model.citizenAddressDTO.pincode = userData.pincode;
					this.model.citizenAddressDTO.city = userData.city;
					this.model.citizenAddressDTO.state = userData.state.toUpperCase();
					this.model.citizenAddressDTO.country = userData.country.toUpperCase();
					this.getStateListsForDefaltCountry(this.model.citizenAddressDTO.country);
				}
			});
		}
	}

	getStateListsForDefaltCountry(country:any) {
		this.stateListArray = this.countryListArray.find(con => con.name.toUpperCase() === country).states;
		this.stateListArray = _.orderBy(this.stateListArray, ['name'],['asc']);
		setTimeout(() => {
			if (this.editMode && this.model.citizenAddressDTO.state) {
				this.getCityListsForDefaultState(this.model.citizenAddressDTO.state);
			}
		}, 1000);
	}

	getCityListsForDefaultState(state :any) {
		this.cityListArray = this.stateListArray.find(obj => obj.name.toUpperCase() === state.toUpperCase()).cities;
		this.stateListArray.find(obj => obj.name.toLowerCase() === state.toLowerCase()).cities
		this.cityListArray = _.orderBy(this.cityListArray, ['name'],['asc']);
	}

}
