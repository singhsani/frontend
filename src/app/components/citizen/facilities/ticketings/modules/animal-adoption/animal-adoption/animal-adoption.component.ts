import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
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
  // selectedAnimalAnnualBoardingExpenses: number = 0;
  selectedAnimalAnnualMaintainanceExpenses: number = 0;


  animalAdoptionForm: FormGroup;



  /**
    * displayColumns are used for display the columns in material table.
  */
  displayColumnsForAnimalAdoptionPricingTable: string[] = [
    'id',
    'animalBirdName',
    // 'annualBoardingExpenses',
    // 'annualMaintainanceExpenses',
    'totalExpenses'
  ];

  /**
   * Used for material table data population and pagination.
  */
  dataSourceForPricing = new MatTableDataSource();
  dataSourceForGujPricing = new MatTableDataSource();

  mySelectModel: any;
  animalName: any = [];
  animalAdopationFromArray = [];
  totalExpenses: any = 0;
  annualMaintainanceExpenses: Number = 0;
  animalCount : number = 0;
  animalAdoptionYear:Number=0;
  animalBirdName : string;
  checkProceed : boolean = false;
  btnProceed: boolean = true; 
  totalCostOfAnimal:Number=0;
  showSelectLanguage :boolean = true
  /**
   * language translate key.
  */
  translateKey = 'animalAodptionScreen';

  @ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;
  // Loading Ticketing Configurations

  ticketingUtils: TicketingUtils;
  gujratiPrcingtable = [
    {
      "srNo": "૧",
      "animalBirdName": "વાઘણ",
      "totalExpenses": "૯૬૫૦૦"
    },
    {
      "srNo": "૨",
      "animalBirdName": "સિંહ",
      "totalExpenses": "૧૧૪૫૦૦"

    },
    {
      "srNo": "૩",
      "animalBirdName": "સિંહણ",
      "totalExpenses": "૯૬૫૦૦"

    },
    {
      "srNo" : "૪",
      "animalBirdName": "વાઘ",
      "totalExpenses": "૧૧૪૫૦૦"

    },
    {
      "srNo" : "૫",
      "animalBirdName": "ચિત્તો",
      "totalExpenses": "૯૬૫૦૦"

    },
    {
      "srNo" : "૬",
      "animalBirdName": "રીંછ",
      "totalExpenses": "૪૬૫૦૦"
    },
    {
      "srNo" : "૭",
      "animalBirdName": "વાનર",
      "totalExpenses": "૮૦૦૦"

    },
    {
      "srNo" : "૮",
      "animalBirdName": "હરણ",
      "totalExpenses": "૭૦૦૦૦"
    },
    {
      "srNo" : "૯",
      "animalBirdName": "સાંભર",
      "totalExpenses": "૯૫૦૦"
    },
    {
      "srNo" : "૧૦",
      "animalBirdName": "કાચબો",
      "totalExpenses": "૨૫૦૦"
    },
    {
      "srNo" : "૧૧",
      "animalBirdName": "પારકીટ",
      "totalExpenses": "૩૦૦૦૦"
    },
    {
      "srNo" : "૧૨",
      "animalBirdName": "લોરિકીત",
      "totalExpenses": "૩૦૦૦"
    },
    {
      "srNo" : "૧૩",
      "animalBirdName": "વાદળી તાજવાળું કબૂતર",
      "totalExpenses": "૪૦૦૦૦"
    },
    {
      "srNo" : "૧૪",
      "animalBirdName": "ભારતીય પીડ હોર્નબિલ",
      "totalExpenses": "૫૦૦૦૦"
    },
    {
      "srNo" : "૧૫",
      "animalBirdName": "કોકટુ",
      "totalExpenses": "૪૦૦૦૦"
    },
    {
      "srNo" : "૧૬",
      "animalBirdName": "મકાઉ",
      "totalExpenses": '૫૦૦૦૦'
    },
    {
      "srNo" : "૧૭",
      "animalBirdName": "બતક/તેતર",
      "totalExpenses": "૬૦૦૦"
    },
    {
      "srNo" : "૧૮",
      "animalBirdName": "પેલિકન",
      "totalExpenses": "૭૦૦૦"
    },
    {
      "srNo" : "૧૯",
      "animalBirdName": "ઇગ્રેટ",
      "totalExpenses": "૬૦૦૦"
    },
    {
      "srNo" : "૨૦",
      "animalBirdName": "બડેરીગર",
      "totalExpenses": "૨૦૦૨"
    },
    {
      "srNo" : "૨૧",
      "animalBirdName": "પ્રેમી પંખીડા",
      "totalExpenses": "૨૦૦૦"
    },
    {
      "srNo" : "૨૨",
      "animalBirdName": "મોર",
      "totalExpenses": "૫૦૦૦૦"
    },
    {
      "srNo" : "૨૩",
      "animalBirdName": "ઇમુ",
      "totalExpenses": "૧૪૦૦૦"
    },
    {
      "srNo" : "૨૪",
      "animalBirdName": "કબૂતર",
      "totalExpenses": "૨૦૦૦"
    },
    {
      "srNo" : "૨૫",
      "animalBirdName": "સસલું",
      "totalExpenses": "૨૦૦૦"
    },
    {
      "srNo" : "૨૬",
      "animalBirdName": "હંસ",
      "totalExpenses": "૬૦૦૦૦"
    },
    {
      "srNo" : "૨૭",
      "animalBirdName": "નીલગાય",
      "totalExpenses": "૯૦૦૦"
    },
    {
      "srNo" : "૨૮",
      "animalBirdName": "જાવા",
      "totalExpenses": "૨૦૦૦"
    },
    {
      "srNo" : "૨૯",
      "animalBirdName": "ફિન્ચ",
      "totalExpenses": "૨૦૦૦"
    },
    {
      "srNo" : "૩૦",
      "animalBirdName": "મુનિયા",
      "totalExpenses": "૨૦૦૦"
    },
    {
      "srNo" : "૩૧",
      "animalBirdName": "હોલા",
      "totalExpenses": "૨૦૦૦"
    }
  ]

  constructor(
    private fb: FormBuilder,
    private ticketingService: TicketingsService,
    private commonService: CommonService,
    private router: Router,
    private toster: ToastrService,
    protected formService: FormsActionsService
  ) {
    this.ticketingService.resourceType = 'zooanimaladoption';
    this.ticketingUtils = new TicketingUtils(formService, toster);
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
      this.dataSourceForGujPricing.data = this.gujratiPrcingtable
    });
  }

  calculateTotalExpenses() {
    this.totalCostOfAnimal=0;
     const animalNameList = this.animalAdoptionForm.get('animalNameList')['controls'];
     for (let i = 0; i < animalNameList.length; i++) {
      this.totalCostOfAnimal += animalNameList[i].get('totalExpenses').value;
      //this.totalCostOfAnimal = this.animalAdoptionForm.get('totalAdoptionCost').value
    }
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
      canEdit: true,
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
      adopterEmailId: [null, [ValidationService.emailValidator]],
      animalName: [null],
      noOfAdoptionCount:[null],
      existingCount :[{value: null,disabled:true }],
      totalAdoptionCost: [{value:null, disabled:true }],
      adoptionYears: [null],
      message: [null],
      agree: [],
    //  termsCondition: [null, Validators.required],
      animalNameList: this.fb.array([])
    });
  }
  getAnimalAdoptionFormStatus(){
    if((this.animalAdoptionForm.get('adoptingPersonOrganizationName').value && this.animalAdoptionForm.get('adoptingPersonOrganizationName').value.trim().length > 0) && 
    (this.animalAdoptionForm.get('adoptersAddress').value && this.animalAdoptionForm.get('adoptersAddress').value.trim().length > 0) &&
    (this.animalAdoptionForm.get('adopterContactNumber').value && this.animalAdoptionForm.get('adopterContactNumber').value.trim().length > 0 && this.animalAdoptionForm.get('adopterContactNumber').status == 'VALID') &&
    (this.animalAdoptionForm.get('animalNameList').value).length > 0){
      return false;
    }else{
      return true;
    }
  }

  getValues(animal) {
    this.animalAdoptionForm.get('noOfAdoptionCount').setValue(null)
    this.animalAdoptionForm.get('totalAdoptionCost').setValue(null)
    this.animalName = animal;
    this.animalBirdName = animal.animalBirdName
    this.animalCount = animal.animalCount
    this.animalAdoptionForm.get('existingCount').setValue(this.animalCount)
    this.animalAdoptionForm.get('existingCount').disable()
    this.animalAdoptionForm.get('totalAdoptionCost').disable();
  
  }

  deleteOT(OTData: any, index: number) {

    let returnArray = this.animalAdoptionForm.get('animalNameList') as FormArray;

    this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {

      if (OTData.id == null) {
        returnArray.removeAt(index);
        this.toster.success(OTData.animalBirdName + ' has been removed.');
      } else {
        returnArray.removeAt(index);
        this.toster.success(OTData.animalBirdName + ' has been removed.');
      }
      
      this.calculateTotalExpenses();
    }
    );
  }

  openDialog() {
    if(this.validateAnimalAdoptionYear()){
      this.toster.warning('Select Adoption Year');
      return;
    }
    if (this.validateAnimal()) {
      this.toster.warning('Select Animal and No of count');
      return;
    }

    let returnArray = this.animalAdoptionForm.get('animalNameList') as FormArray;
    this.animalAdoptionYear=this.animalAdoptionForm.get('adoptionYears').value;
    if(returnArray.length!=0 && returnArray.value[0].noOfYear != this.animalAdoptionYear){
      this.toster.warning('Please Enter Same No Of Adoption Year');
      this.animalAdoptionForm.get('animalName').setValue(null);
      this.animalAdoptionForm.get('totalAdoptionCost').setValue(null);
      this.animalAdoptionForm.get('noOfAdoptionCount').reset();
      this.animalAdoptionForm.get('adoptionYears').reset();
      this.animalAdoptionForm.get('existingCount').reset();
      this.animalAdoptionForm.get('adoptionYears').setValue( returnArray.value[0].noOfYear);
      
    }else{
    for (let control of returnArray.controls) {
      if (control instanceof FormGroup) {
        
         if(control.get('id').value == this.animalName.id){
           this.toster.warning(this.animalName.animalBirdName +' already added Please Select another Animal');
           return this.resetCalculations(" ");
         }
      }
   }
   this.toster.success(this.animalBirdName +'  has been added successfully');
    this.animalName['totalQty'] = this.animalAdoptionForm.get('noOfAdoptionCount').value;
    this.animalName['noOfYear'] = this.animalAdoptionForm.get('adoptionYears').value;
   // this.animalName['total'] = this.animalName.totalExpenses;
    if (this.animalAdoptionForm.get('canEdit').value) {
      returnArray.push(this.createOTDetailArray(this.animalName));
      this.resetCalculations("");
      this.calculateTotalExpenses();
    }
  }
}
  calculateAmount(event) {
  
    if(event.target.value == '' || event.target.value == undefined){
      return false
    }
    else{
      let data ={
        animalName: this.animalBirdName,
        animalCount: this.animalCount,
     //    adoptionAnimalCount:event.target.focus()

      }
      let adoptionYear=this.animalAdoptionForm.get('adoptionYears').value;
      if(this.animalCount>=event.target.value){
        this.animalAdoptionForm.get('totalAdoptionCost').setValue(this.animalAdoptionForm.get('noOfAdoptionCount').value * this.animalName.totalExpenses * adoptionYear);
      } else {
          this.commonService.openAlert('Warning','Please Enter Valid Count' , 'warning', '',)
          this.animalAdoptionForm.get('noOfAdoptionCount').setValue(null)  
    
      }
    }
  }
  
  onChange(){
    let adoptionYear=this.animalAdoptionForm.get('adoptionYears').value;
    this.animalAdoptionForm.get('totalAdoptionCost').setValue(this.animalAdoptionForm.get('noOfAdoptionCount').value * this.animalName.totalExpenses * adoptionYear);
  }

  createOTDetailArray(data?: any) {
    return this.fb.group({
      // serviceFormId: this.formId,
      id: data.id ? data.id : null,
      activationEndDate: data.activationEndDate ? data.activationEndDate : null,
      activationStartDate: data.activationStartDate ? data.activationStartDate : null,
      active: data.active ? data.active : null,
      animalBirdName: data.animalBirdName ? data.animalBirdName : null,
      annualBoardingExpenses: data.annualBoardingExpenses ? data.annualBoardingExpenses : null,
      annualMaintainanceExpenses: data.annualMaintainanceExpenses ? data.annualMaintainanceExpenses : null,
      totalExpenses: this.animalAdoptionForm.get('totalAdoptionCost').value ? this.animalAdoptionForm.get('totalAdoptionCost').value : null,
      totalQty: data.totalQty ? data.totalQty : null,
      noOfYear : data.noOfYear ? data.noOfYear :null,
      total:this.animalAdoptionForm.get('totalAdoptionCost').value?this.animalAdoptionForm.get('totalAdoptionCost').value:null

    })

  }

  resetCalculations(data) {
    this.animalName = [];
    this.totalExpenses = 0;
    this.animalAdoptionForm.get('animalName').setValue(null);
    this.animalAdoptionForm.get('totalAdoptionCost').setValue(null);
    this.animalAdoptionForm.get('noOfAdoptionCount').reset();
    this.animalAdoptionForm.get('adoptionYears').setValue(this.animalAdoptionYear);
    this.animalAdoptionForm.get('existingCount').reset();
    //this.animalAdoptionForm.get('totalAdoptionCost').setValue(0);
    this.selectedAnimalAnnualMaintainanceExpenses=0;
    
  }


  validateAnimal() {
    if (this.animalAdoptionForm.get('animalName').value == null || this.animalAdoptionForm.get('totalAdoptionCost').value == null || this.animalAdoptionForm.get('noOfAdoptionCount').value == 0) {
      return true;
    } else {
      return false;
    }
  }

  validateAnimalAdoptionYear(){
    if(this.animalAdoptionForm.get('adoptionYears').value == null){
      return true;
    }else{
      return false;
    }
  }


  submitAnimalAdoptionRequest() {
    let returnArray = this.animalAdoptionForm.get('animalNameList') as FormArray;
    if(returnArray.length == 0){
      this.toster.warning('Please add Animal');
      return false;
    }
    if(this.animalAdoptionForm.get('animalName').value != null || this.animalAdoptionForm.get('totalAdoptionCost').value != null || this.animalAdoptionForm.get('noOfAdoptionCount').value != null){
      this.toster.warning('Please add Animal');
    }else{
    this.animalAdoptionForm.get('adoptionYears').setValue(this.animalAdoptionYear);
    this.ticketingService.animalAdoptionRequest(this.animalAdoptionForm.value).subscribe(resp => {

    },
      err => {
        if (err.status === 402) {
          this.animalAdoptionForm.get('refNumber').setValue(err.error.data.refNumber);

          this.ticketingUtils.redirectToCCAvenuePayment(err, this.commonService, this.ticketingService, this.paymentGateway, this.animalAdoptionForm, this.router);


        }
      });
    }

  }

  clickProcess(event){
    if(event.checked == true){
            this.btnProceed = false;
      }else{
          this.btnProceed = true;
      }
    }

    validateAdoptionYear(event){
      if(event.target.value == '' || event.target.value == undefined){
        return false
      }
      let adoptionYear=this.animalAdoptionForm.get('adoptionYears').value;
      if(adoptionYear == 0){
        this.commonService.openAlert('Warning','Adoption Year Must Be Greater Than 0' , 'warning', '',);
         this.animalAdoptionForm.get('adoptionYears').reset();
      }
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
  selectLanguage(event) {
		this.btnProceed = true
		if (event == 'gu') {
			this.showSelectLanguage = true
		}
		else {
			this.showSelectLanguage = false
		}

	}
}

