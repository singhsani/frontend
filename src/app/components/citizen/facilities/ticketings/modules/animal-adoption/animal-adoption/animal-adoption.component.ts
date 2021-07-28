import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TicketingsService } from '../../../shared-ticketing/services/ticketings.service';
import { MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { TicketingConstants, TicketingUtils } from '../../../config/ticketing-config';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';

@Component({
  selector: 'app-animal-adoption',
  templateUrl: './animal-adoption.component.html',
  styleUrls: ['./animal-adoption.component.scss']
})
export class AnimalAdoptionComponent implements OnInit {

  // Flags to display/hide view
  showAnimalAdoptionPricingTable: boolean = true;
  showAnimalAdoptionForm: boolean = false;

  // Loading Ticketing Configurations

  ticketingConstants = TicketingConstants;

  // animpal adoption pricing
  animalAdoptionPricing: any[];
  selectedAnimalAnnualBoardingExpenses: number = 0;
  selectedAnimalAnnualMaintainanceExpenses: number = 0;


  animalAdoptionForm: FormGroup;

 

  /**
    * displayColumns are used for display the columns in material table.
  */
  displayColumnsForAnimalAdoptionPricingTable: string[] = [
    'id',
    'animalBirdName',
    'annualBoardingExpenses',
    'annualMaintainanceExpenses',
    'totalExpenses'
  ];

  /**
   * Used for material table data population and pagination.
  */
  dataSourceForPricing = new MatTableDataSource();

  mySelectModel: any;

  animalName: any = [];
  animalAdopationFromArray = [];
  totalExpenses: any = 0;
  annualMaintainanceExpenses: Number = 0;

  /**
   * language translate key.
  */
  translateKey = 'animalAodptionScreen';

  @ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;
  // Loading Ticketing Configurations
  
  ticketingUtils: TicketingUtils;

  constructor(
    private fb: FormBuilder,
    private ticketingService: TicketingsService,
    private commonService: CommonService,
    private router: Router,
    private toster: ToastrService,
    protected formService: FormsActionsService
  ) {
    this.ticketingService.resourceType = 'zooanimaladoption';
    this.ticketingUtils = new TicketingUtils(formService,toster);
  }

  ngOnInit() {
    this.generateAnimalAdoptionForm();
    this.getZooVisitingRates();

    this.animalAdoptionForm.valueChanges.subscribe(v => {
      // console.log(this.animalAdoptionForm);
    });
    //this.profileData();
  }

  /**
   * get login user data
   */
  profileData() {
    this.ticketingService.getUserProfile().subscribe(res => {
      this.animalAdoptionForm.get('adopterEmailId').setValue(res.data.email);
      this.animalAdoptionForm.get('adopterContactNumber').setValue(res.data.cellNo);
      this.animalAdoptionForm.get('adoptingPersonOrganizationName').setValue(res.data.firstName + ' ' + res.data.lastName);
    },
      err => {
        this.toster.error("Server Error");
      })
  }

  /**
   * get rates of animal
   */
  getZooVisitingRates() {
    this.ticketingService.getAnimalAdoptionFeesList().subscribe(d => {
      this.animalAdoptionPricing = d.data;
      this.dataSourceForPricing.data = d.data;
    });
  }

  /**
   * Generat form controls
   */
  generateAnimalAdoptionForm() {
    this.animalAdoptionForm = this.fb.group({
      id: null,
      uniqueId: null,
      version: null,
      cancelledDate: null,
      bookingDate: null,
      status: null,
      refNumber: null,
      resourceType: null,
      payableServiceType: null,
      resourceCode: null,
      accountHolderName: null,
      accountNo: null,
      bankName: null,
      ifscCode: null,
      scheduleList: null,
      attachments: null,
      adoptionRequestDate: moment().format('YYYY-MM-DD'),
      animalNameList : null,
      adoptingPersonOrganizationName: [null, Validators.required],
      adoptersAddress: [null, Validators.required],
      adopterContactNumber: [null, Validators.required],
      adopterEmailId: [null, [ValidationService.emailValidator]],
      animalName: [null, Validators.required],
      totalAdoptionCost: [null, Validators.required],
      message: [null, Validators.required],
      agree: [],
      termsCondition: [null, Validators.required]
    });
  }

  getValues(animal){
    this.resetCalculations(animal);
    this.animalName = animal;
    animal.forEach((value) => {
      this.totalExpenses = this.totalExpenses + value.totalExpenses;
      this.animalAdoptionForm.get('animalName').setValue(value.animalBirdName);
      this.animalAdoptionForm.get('totalAdoptionCost').setValue(this.totalExpenses);
      this.selectedAnimalAnnualMaintainanceExpenses = this.selectedAnimalAnnualMaintainanceExpenses + value.annualMaintainanceExpenses;
      this.selectedAnimalAnnualBoardingExpenses = this.selectedAnimalAnnualBoardingExpenses + value.annualBoardingExpenses;
    });
  }

  resetCalculations(animal){
    this.animalName = [];
    this.totalExpenses = 0;
    this.animalAdoptionForm.get('animalName').setValue(0);
    this.animalAdoptionForm.get('totalAdoptionCost').setValue(0);
    this.selectedAnimalAnnualMaintainanceExpenses = 0;
    this.selectedAnimalAnnualBoardingExpenses = 0;
  }
  // selectAnimal(animal) {

  //   let obj = {
  //     'animalName': animal.animalBirdName,
  //     'totalAdoptionCost': animal.totalExpenses
  //   };
  //   this.animalName.push(obj);
  //   this.totalExpenses = this.totalExpenses + animal.totalExpenses;

  //   this.animalAdoptionForm.get('animalName').setValue(animal.animalBirdName);
  //   this.animalAdoptionForm.get('totalAdoptionCost').setValue(this.totalExpenses);
  //   this.selectedAnimalAnnualMaintainanceExpenses = this.selectedAnimalAnnualMaintainanceExpenses + animal.annualMaintainanceExpenses;
  //   this.selectedAnimalAnnualBoardingExpenses = this.selectedAnimalAnnualBoardingExpenses + animal.annualBoardingExpenses;


  // }

  submitAnimalAdoptionRequest() {

    //this.animalName.forEach((value) => {
      //this.animalAdoptionForm.get('animalName').setValue(value.animalName);
      //this.animalAdoptionForm.get('totalAdoptionCost').setValue(value.totalAdoptionCost);
      //this.animalAdopationFromArray.push(this.animalAdoptionForm.value);
    //});

    this.animalAdoptionForm.get('animalNameList').setValue(this.animalName);

    this.ticketingService.animalAdoptionRequest(this.animalAdoptionForm.value).subscribe(resp => {
     
    },
      err => {
        if (err.status === 402) {
          this.animalAdoptionForm.get('refNumber').setValue(err.error.data.refNumber);
          
             this.ticketingUtils.redirectToCCAvenuePayment(err, this.commonService, this.ticketingService, this.paymentGateway ,this.animalAdoptionForm, this.router);
             
         
        }
      });
    
    }


  /**
   * Link for agreement.
   */
  // loadGuideLine() {
  //   //   w.document.title = "Planetarium Guide Line"
  //   let sectionToPrint;
  //   this.ticketingService.loadGuideLine().subscribe(resp => {
  //     sectionToPrint = document.getElementById('sectionTextPrint');
  //     sectionToPrint.innerHTML = resp;
  //   });

  //   const dialogRef = this.dialog.open(GuidelinePopupComponent, sectionToPrint);

  //   dialogRef.afterClosed().subscribe(result => {
  //     // console.log(`Dialog result: ${result}`);
  //   });
  // }
}

