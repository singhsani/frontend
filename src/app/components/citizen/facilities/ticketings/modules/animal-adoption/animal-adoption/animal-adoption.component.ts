import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TicketingsService } from '../../../shared-ticketing/services/ticketings.service';
import { MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { TicketingConstants } from '../../../config/ticketing-config';
import { ToastrService } from 'ngx-toastr';

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
  selectedAnimalAnnualBoardingExpenses: number;
  selectedAnimalAnnualMaintainanceExpenses: number;


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

  /**
   * language translate key.
  */
  translateKey = 'animalAodptionScreen';

  constructor(
    private fb: FormBuilder,
    private ticketingService: TicketingsService,
    private commonService: CommonService,
    private router: Router,
    private toster: ToastrService
  ) {
    this.ticketingService.resourceType = 'zooanimaladoption';
  }

  ngOnInit() {
    this.generateAnimalAdoptionForm();
    this.getZooVisitingRates();

    this.animalAdoptionForm.valueChanges.subscribe( v => {
      // console.log(this.animalAdoptionForm);
    });
   this.profileData();
  }

  /**
   * get login user data
   */
  profileData(){
    this.ticketingService.getUserProfile().subscribe(res=>{
      this.animalAdoptionForm.get('adopterEmailId').setValue(res.data.email);
      this.animalAdoptionForm.get('adopterContactNumber').setValue(res.data.cellNo);
      this.animalAdoptionForm.get('adoptingPersonOrganizationName').setValue(res.data.firstName + ' ' + res.data.lastName);
    },
    err =>{
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

      adoptingPersonOrganizationName: [null, Validators.required],
      adoptersAddress: [null, Validators.required],
      adopterContactNumber: [null, Validators.required],
      adopterEmailId: [null, [Validators.email]],
      animalName: [null, Validators.required],
      totalAdoptionCost: [null, Validators.required],
      message: [null, Validators.required],
      agree: [],
      termsCondition: [null, Validators.required]
    });
  }

  selectAnimal(animal) {
    this.animalAdoptionForm.get('animalName').setValue(animal.animalBirdName);
    this.animalAdoptionForm.get('totalAdoptionCost').setValue(animal.totalExpenses);
    this.selectedAnimalAnnualMaintainanceExpenses = animal.annualMaintainanceExpenses;
    this.selectedAnimalAnnualBoardingExpenses = animal.annualBoardingExpenses;
  }

  submitAnimalAdoptionRequest() {
    this.ticketingService.animalAdoptionRequest(this.animalAdoptionForm.value).subscribe(resp => {
      this.ticketingService.printAcknowledgementReceipt(resp.data.refNumber).subscribe(acknowledgementHTML => {
        let sectionToPrint: any = document.getElementById('sectionToPrint');
        sectionToPrint.innerHTML = acknowledgementHTML;
        setTimeout(() => {
          window.print();
          this.router.navigate([this.ticketingConstants.MY_TICKETINGS_URL]);
        },300);
      }, err => {
        this.commonService.openAlert("Error", err.error[0].message, "warning")
      });
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
