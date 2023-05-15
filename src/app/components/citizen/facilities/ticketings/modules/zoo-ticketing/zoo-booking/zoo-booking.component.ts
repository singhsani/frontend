import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { TicketingsService } from '../../../shared-ticketing/services/ticketings.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { TicketingConstants, TicketingUtils } from '../../../config/ticketing-config';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { TranslatePipe } from 'src/app/shared/modules/translate/translate.pipe';
import { ToastrService } from 'ngx-toastr';
import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';

@Component({
  selector: 'app-zoo-booking',
  templateUrl: './zoo-booking.component.html',
  styleUrls: ['./zoo-booking.component.scss'],
  providers: [TranslatePipe]
})
export class ZooBookingComponent implements OnInit {

  @ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;
  // Loading Ticketing Configurations
  ticketingConstants = TicketingConstants;
  ticketingUtils: TicketingUtils;
  isVisibleIdNumber = false;
  Charge:number;
  isDisable = false;
  isPanCardVisibleIdNumber = false;
  /**
   * language translate key.
  */
  translateKey = 'citizenZooTicketingScreen';
  /**
    * displayColumns are used for display the columns in material table.
  */
  displayedColumnsForPricingTable: string[] = [
    'id',
    'description',
    'price'
  ];

  displayedColumnsForTimingTable: string[] = [
    'id',
    'months',
    'slot'
  ];

  /**
    * Flags
  */
  guideLineFlag = true;
  showTicketsBookingForm = false;
  bankDetailsFlag = false;
  numberOfVisitor : string;
  totalAmountZoo: number = 0;
  totalVisitorZoo: number =0 ;
  /**
    * Pricing data for ticket bookings for visiting zoo
   */
  pricing: any[] = [
    {
      categoryName: 'Children',
      description: this.pipe.transform("children_below_12_years_of_age", this.translateKey),
      priceField: 'CHILD'
    },
    {
      categoryName: 'Adults',
      description: this.pipe.transform("adults", this.translateKey),
      priceField: 'ADULT'
    },
    {
      categoryName: 'Camera',
      description: this.pipe.transform("camera_fees", this.translateKey),
      priceField: 'CAMERA'
    },
    {
      categoryName: 'Video Camera',
      description: this.pipe.transform("video_camera_fees", this.translateKey),
      priceField: 'VIDEOCAMERA'
    }
  ];

  zooVisitingRates: any = [];

  /**
    * Timing data for ticket bookings for visiting zoo
  */
  timing: any[] = [
    {
      'months': 'July to March',
      'slot': '9:00 AM To 6:00 PM'
    },
    {
      'months': 'April to June',
      'slot': '9:00 AM To 6:30 PM'
    }
  ];


  /**
   * Used for material table data population and pagination.
  */
  dataSourceForPricing = new MatTableDataSource();
  dataSourceForTiming = new MatTableDataSource();


  // Ticket Details

  ticketBookingForm: FormGroup;
  ticketBookingDetails : FormArray;
  subTotal: number = 0;
  amount: number = 0;
  totalAmount: number = 0;
  numberOfVisitors: number = 0;
  withAndWithoutWalkListForDuplicate: any = [];

  // Ticket Booking Table Row Data:

  ticketBookingRows: any[] = [
    {
      name: this.pipe.transform("children_below_12_years_of_age", this.translateKey),
      formGroupName: 'children',
      formControlName: 'totalChild',
      placeHolder: this.pipe.transform("number_of_children", this.translateKey),
      max: 3,
      priceField: 'CHILD'
    },
    {
      name: this.pipe.transform("adults", this.translateKey),
      formGroupName: 'adults',
      formControlName: 'totalAdult',
      placeHolder: this.pipe.transform("number_of_adults", this.translateKey),
      max: 3,
      priceField: 'ADULT'
    },
    {
      name: this.pipe.transform("camera", this.translateKey),
      formGroupName: 'camera',
      formControlName: 'totalCamera',
      placeHolder: this.pipe.transform("number_of_camera", this.translateKey),
      max: 3,
      priceField: 'CAMERA'
    },
    {
      name: this.pipe.transform("video_camera", this.translateKey),
      formGroupName: 'videoCamera',
      formControlName: 'totalVideoCamera',
      placeHolder: this.pipe.transform("number_of_video_camera", this.translateKey),
      max: 3,
      priceField: 'VIDEOCAMERA'
    }
  ];

  // Bank Details
  bankDetailsForm: FormGroup;

  /**
   * LookUps & Arrays.
  */

  BANKS: Array<any> = [];

  /**
   * Minimum start date.
  */
   startMinDate: Date = moment(new Date()).add(1, 'day').toDate();

  // Contact Details

  idTypes: any[];
  ticketTypes: any[];
  visitorsTypes: any[];
  visitorsTypesChange: any[] = [];
  ticketName: any;

  


  /**
   * @param fb - Declare FormBuilder property.
   * @param ticketingService - Declare Ticketing Service
   * @param commonService - Declare sweet alert.
   * @param router - Declare Routing Property.
  */

  constructor(
    private fb: FormBuilder,
    private ticketingService: TicketingsService,
    private commonService: CommonService,
    private router: Router,
    public pipe: TranslatePipe,
    private toster: ToastrService,
    protected formService: FormsActionsService
  ) {
    this.ticketingUtils = new TicketingUtils(formService, toster);
    this.ticketingService.resourceType = 'zoo';
  }

  ngOnInit() {

    // Initialise ticket pricing and timing tables
    this.dataSourceForPricing.data = this.pricing;
    this.dataSourceForTiming.data = this.timing;
    this.isVisibleIdNumber = false;
    this.isPanCardVisibleIdNumber = false;

    this.ticketBookingFormControls();
    this.getLookUps();
    this.getZooVisitingRates();
    //this.profileData();
  }

  /**
    * Get all booking category list from api.
  */
  getLookUps() {
    this.ticketingService.getDataFromLookups().subscribe((respData) => {
      this.BANKS = respData.BANK;
      this.idTypes = respData.IDTYPE;
      this.ticketTypes = respData.TICKETTYPE;
      this.visitorsTypes = respData.VISITORTYPE;
    });
  }

  /**
    * disble thursday for vistior date.
  */
  disableThursday(d: Date) {
    if (d.getDay() != 4) {
      return d;
    }
  }

  /**
    * Get Zoo Visiting Rates from api.
  */
  getZooVisitingRates() {
    this.ticketingService.getZooVisitingRates().subscribe((respRates) => {
      this.zooVisitingRates = respRates.data;
    });
  }

  changeDateFormat(e) {
    this.ticketBookingForm.get('visitingDate').setValue(moment(e.value).format('YYYY-MM-DD'));
  }

  setVisitorsType(){
    this.ticketBookingForm.get('typeOfVisitor').reset();
    this.ticketBookingForm.get('amounts').reset();
    this.ticketBookingForm.get('numberOfVisitors').reset();
    this.ticketBookingForm.get('charges').reset();
    this.visitorsTypesChange=[];
    if(this.ticketBookingForm.get('typeOfTicket').get('code').value=='WITH_WALK_IN_AVIARY' ||this.ticketBookingForm.get('typeOfTicket').get('code').value=='WITHOUT_WALK_IN_AVIARY' ){
      this.visitorsTypes.forEach(res =>{
        console.log(res);
        if(res.code == 'CHILDREN_BELOW' || res.code == 'CHILD' || res.code == 'ADULT' || res.code =='CAMERA' || res.code == 'VIDEOCAMERA'){
          this.visitorsTypesChange.push(res)
        }
        
      })

    }else{
      
      this.visitorsTypes.forEach(res =>{
        console.log(res);
        if(res.code == 'VISITORS' || res.code =='CAMERA' || res.code == 'VIDEOCAMERA'){
          this.visitorsTypesChange.push(res)
        }
        
      })
    }
  }


  ticketBookingFormControls() {
    // Currently the form is filled temporarily with some dummy data
    this.ticketBookingForm = this.fb.group({
      id: null,
      uniqueId: null,
      version: null,
      cancelledDate: null,
      status: null,
      refNumber: null,
      resourceType: null,
      payableServiceType: null,
      resourceCode: 'SARDARBAUGHZOO',
      scheduleList: null,
      attachments: null,
      canEdit: true,
      bookingDate: null,
      personSubTotal: null,
      totalAmount: null,
      paymentMode: null,
      totalPayableAmount: null,
      applicantName: ['', Validators.required],
      applicantMobile: ['', Validators.required],
      idType: this.fb.group({
        code: [null, Validators.required]
      }),
      typeOfTicket: this.fb.group({
        code: [null,Validators.required]
      }),
      typeOfVisitor:this.fb.group({
        name: [null, Validators.required],
      }),
      charges: this.fb.group({
        code: [null, Validators.required]
      }),
      numberOfVisitors: this.fb.group({
        code: [null, Validators.required]
      }),
      amounts: this.fb.group({
        code: [null, Validators.required]
      }),
      idNumber: [null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      visitingDate: [, Validators.required],
      totalChild: [0, Validators.max(30)],
      totalAdult: [0, Validators.max(30)],
      totalCamera: [0, Validators.max(100)],
      totalVideoCamera: [0, Validators.max(100)],
      totalChilds: [0, Validators.max(30)],
      totalAdults: [0, Validators.max(30)],
      totalCameras: [0, Validators.max(100)],
      totalVideoCameras: [0, Validators.max(100)],
      educationalVisitors:[0,Validators.max[100]],
      educationalVisitor:[0,Validators.max[100]],
      cameraEducationalWithout:[0,Validators.max[100]],
      cameraEducationalWith:[0,Validators.max[100]],
      vcameraEducationalWithout:[0,Validators.max[100]],
      vcameraEducationalWith:[0,Validators.max[100]],


      bankName: this.fb.group({
        code: [null],
      }),
      accountHolderName: [null],
      accountNo: [null],
      ifscCode: [null],
      termsCondition: [true],
      agree: [true],
      withAndWithoutWalkList: this.fb.array([])
    });

  }
  /**
   * Show applicant data(login user)
   */
  profileData() {
    this.ticketingService.getUserProfile().subscribe(res => {
      this.ticketBookingForm.get('applicantName').setValue(res.data.firstName + ' ' + res.data.lastName);
      this.ticketBookingForm.get('applicantMobile').setValue(res.data.cellNo);

    },
      err => {
        this.toster.error("Server Error");
      });
  }

  // Will Compute total amount based on the user input
  // computeTotalAndVisitors() {
  //   const f = this.ticketBookingForm.value;
  //   this.numberOfVisitors = Number(f.totalChild) + Number(f.totalAdult);
  //   this.totalAmount = (Number(f.totalChild) * this.zooVisitingRates['CHILD']) + (Number(f.totalAdult) * this.zooVisitingRates['ADULT']) + (Number(f.totalCamera) * this.zooVisitingRates['CAMERA']) + (Number(f.totalVideoCamera) * this.zooVisitingRates['VIDEOCAMERA']);

  //  // this.ticketBookingForm.get('amount').setValue(this.totalAmount);
  //   this.ticketBookingForm.get('totalAmount').setValue(this.totalAmount);
  //   this.ticketBookingForm.get('personSubTotal').setValue(this.numberOfVisitors);
  //   if (this.numberOfVisitors > 30) {
  //     this.toster.error("Please Enter Total Limited Person(30)");
  //   }
  // }

  redirecToPayment() {
    this.ticketingService.bookZooTickets(this.ticketBookingForm.value).subscribe(res => {
      console.log(res);
      if (!this.ticketBookingForm.get('agree').value) {
        this.commonService.openAlert('Feild Error', this.ticketingConstants.AGREE_MESSAGE, 'warning');
        return;
      } else if (!this.ticketBookingForm.get('termsCondition').value) {
        this.commonService.openAlert('Feild Error', this.ticketingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning');
        return;
      }
    },
      err => {
        if (err.status === 402) {
          this.resetForm();
          this.ticketBookingForm.get('refNumber').setValue(err.error.data.refNumber);
          // this.ticketingService.getTotalAmount(err.error.data.refNumber).subscribe(data => {
          // console.log(data);
          this.router.navigate([this.ticketingConstants.MY_TICKETINGS_URL]);
          // this.ticketBookingForm.get('totalAmount').setValue(err.error.data.TOTAL);
          // this.ticketingUtils.redirectToPayment(err, this.commonService, this.ticketingService, this.ticketBookingForm, this.router);
          this.ticketingUtils.redirectToCCAvenuePayment(err, this.commonService, this.ticketingService, this.paymentGateway, this.ticketBookingForm, this.router);

          // return;
          // });
        }
        if (err.status === 400) {
          this.commonService.openAlert('Error', err.error[0].code, 'warning');
        }
      });
  }

  resetForm() {
    this.ticketBookingForm.reset();
    this.numberOfVisitors = 0;
    this.subTotal = 0;
    this.totalAmount = 0;
  }

  CheckType(idCode) {
    this.isVisibleIdNumber = false;
    this.isPanCardVisibleIdNumber = false;
    if (idCode === 'AADHARCARD') {
      this.isVisibleIdNumber = true;
      this.isPanCardVisibleIdNumber = false;
      this.ticketBookingForm.controls['idNumber'].setValue('');
      this.ticketBookingForm.controls['idNumber'].setValidators([Validators.required]);
      this.ticketBookingForm.controls['idNumber'].updateValueAndValidity();
    } else if (idCode === 'PANCARD') {
      this.isPanCardVisibleIdNumber = true;
      this.isVisibleIdNumber = false;
      this.ticketBookingForm.controls['idNumber'].setValidators([Validators.required, ValidationService.panValidatorforlastfour]);
      this.ticketBookingForm.controls['idNumber'].updateValueAndValidity();
    } else if (idCode === 'VOTINGCARD' || idCode === 'PASSPORT') {
      this.isVisibleIdNumber = true;
      this.isPanCardVisibleIdNumber = false;
      this.ticketBookingForm.controls['idNumber'].setValue('');
      this.ticketBookingForm.controls['idNumber'].setValidators([Validators.required]);
      this.ticketBookingForm.controls['idNumber'].updateValueAndValidity();
    }

  }
  
  getChargesValue(event){    
    const f = this.ticketBookingForm.value;
  
if(f.typeOfTicket.code == "WITHOUT_WALK_IN_AVIARY" && f.typeOfVisitor.name == 'Adults (Above age 12)'){
    this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['ADULT']) 
    }  
    else if(f.typeOfTicket.code == "WITHOUT_WALK_IN_AVIARY" && f.typeOfVisitor.name == 'Children (Age 5 to 12 )')
    {
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['CHILD']) 

    }
    else if(f.typeOfTicket.code == "WITHOUT_WALK_IN_AVIARY" && f.typeOfVisitor.name == 'Camera Fee')
    {
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['CAMERA']) 

    }
    else if(f.typeOfTicket.code == "WITHOUT_WALK_IN_AVIARY" && f.typeOfVisitor.name == 'Video Camera Fee')
    {
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['VIDEOCAMERA']) 

    }
    else if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Children Below 5 Free"){
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['CHILDBELOW'])
    }
    else if(f.typeOfTicket.code == "WITH_WALK_IN_AVIARY" && f.typeOfVisitor.name == 'Children (Age 5 to 12 )')
    {
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['CHILDS'])

    }
    else if(f.typeOfTicket.code == "WITH_WALK_IN_AVIARY" && f.typeOfVisitor.name == 'Adults (Above age 12)')
    {
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['ADULTS'])

    }
    else if(f.typeOfTicket.code == "WITH_WALK_IN_AVIARY" && f.typeOfVisitor.name == 'Camera Fee')
    {
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['CAMERAS'])

    }
    else if(f.typeOfTicket.code == "WITH_WALK_IN_AVIARY" && f.typeOfVisitor.name == 'Video Camera Fee')
    {
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['VIDEOCAMERAS'])

    }
    else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Children Below 5 Free"){
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['CHILDBELOW'])
    }else if(f.typeOfTicket.code == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Educational Visitors"){
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['NUMBER_OF_VISITORS_EDUCATIONAL_WITHOUT'])
    }
    else if(f.typeOfTicket.code == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Camera Fee"){
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['CAMERAS_EDUCATIONAL_WITHOUT'])
    }
    else if(f.typeOfTicket.code == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Video Camera Fee"){
      this.ticketBookingForm.get('charges').get('code').setValue(this.zooVisitingRates['VIDEOCAMERAS_EDUCATIONAL_WITHOUT'])
    }
    else if(f.typeOfTicket.code == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Educational Visitors"){
      this.ticketBookingForm.get('charges').get('code').setValue (this.zooVisitingRates['NUMBER_OF_VISITORS_EDUCATIONAL_WITH'])
    }
    else if(f.typeOfTicket.code == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Camera Fee"){
      this.ticketBookingForm.get('charges').get('code').setValue (this.zooVisitingRates['CAMERAS_EDUCATIONAL_WITH'])
    }
    else if(f.typeOfTicket.code == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Video Camera Fee"){
      this.ticketBookingForm.get('charges').get('code').setValue (this.zooVisitingRates['VIDEOCAMERAS_EDUCATIONAL_WITH'])
    }
    else  
    {
      this.ticketBookingForm.get('charges').get('code').setValue(0) 
    }

  } 

  getTotalAmount(event)
  { 
     let numberOfVisitors = event.target.value;
    this.numberOfVisitor = event.target.value
      const f = this.ticketBookingForm.value;
      if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Children (Age 5 to 12 )")
      {
      this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CHILD']);
      this.ticketBookingForm.get('totalChild').setValue(parseInt(this.ticketBookingForm.get('totalChild').value)+parseInt(numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Adults (Above age 12)"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['ADULT']);
        this.ticketBookingForm.get('totalAdult').setValue((numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CAMERA']);
        this.ticketBookingForm.get('totalCamera').setValue((numberOfVisitors));
      }

      else if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Video Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['VIDEOCAMERA']);
        this.ticketBookingForm.get('totalVideoCamera').setValue((numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Children Below 5 Free"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CHILDBELOW']);
        this.ticketBookingForm.get('totalChild').setValue(parseInt(this.ticketBookingForm.get('totalChild').value)+parseInt(numberOfVisitors));

      }

      else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Children (Age 5 to 12 )"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CHILDS']);
        this.ticketBookingForm.get('totalChilds').setValue(parseInt(this.ticketBookingForm.get('totalChilds').value)+parseInt(numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Adults (Above age 12)"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['ADULTS']);
        this.ticketBookingForm.get('totalAdults').setValue((numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CAMERAS']);
        this.ticketBookingForm.get('totalCameras').setValue((numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Video Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['VIDEOCAMERAS']);
        this.ticketBookingForm.get('totalVideoCameras').setValue((numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Children Below 5 Free"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CHILDBELOW']);
        this.ticketBookingForm.get('totalChilds').setValue(parseInt(this.ticketBookingForm.get('totalChilds').value)+parseInt(numberOfVisitors));
      }else if(f.typeOfTicket.code == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Educational Visitors"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['NUMBER_OF_VISITORS_EDUCATIONAL_WITHOUT'])
        this.ticketBookingForm.get('educationalVisitor').setValue((numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CAMERAS_EDUCATIONAL_WITHOUT'])
        this.ticketBookingForm.get('cameraEducationalWithout').setValue((numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Video Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['VIDEOCAMERAS_EDUCATIONAL_WITHOUT'])
        this.ticketBookingForm.get('vcameraEducationalWithout').setValue((numberOfVisitors));

      }
      else if(f.typeOfTicket.code == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Educational Visitors"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['NUMBER_OF_VISITORS_EDUCATIONAL_WITH'])
        this.ticketBookingForm.get('educationalVisitors').setValue((numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CAMERAS_EDUCATIONAL_WITH'])
        this.ticketBookingForm.get('cameraEducationalWith').setValue((numberOfVisitors));
      }
      else if(f.typeOfTicket.code == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Video Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['VIDEOCAMERAS_EDUCATIONAL_WITH'])
        this.ticketBookingForm.get('vcameraEducationalWith').setValue((numberOfVisitors));
      }
      this.ticketBookingForm.get('amounts').get('code').setValue(this.totalAmount);
     
     
  }

  addTicketData(data: any){
   
    return this.fb.group({
  
      typeOfTicket: data.typeOfTicket ? data.typeOfTicket : null,
      typeOfVisitor: data.typeOfVisitor ? data.typeOfVisitor : null,
      charges: data.charges ? data.charges : 0,
      numberOfVisitors : data.numberOfVisitors ? data.numberOfVisitors : 0,
      amounts: data.amounts ? data.amounts :0,
      typeOfTicketName : this.ticketName
    })
  
  }
  
  getTicketData(){
    
   this.ticketTypes.forEach(res=>{
      if(res.code == this.ticketBookingForm.get('typeOfTicket').get('code').value){
        this.ticketName = res.name
      }
    })
    let data ={
      typeOfTicket : this.ticketBookingForm.get('typeOfTicket').get('code').value,
      typeOfVisitor : this.ticketBookingForm.get('typeOfVisitor').get('name').value,
      charges : this.ticketBookingForm.get('charges').get('code').value,
      amounts :  this.ticketBookingForm.get('amounts').get('code').value,
      numberOfVisitors : parseInt(this.numberOfVisitor),
      typeOfTicketName : this.ticketName
    }
    
   
    let returnArray: any;
    returnArray = this.ticketBookingForm.get('withAndWithoutWalkList') as FormArray;
    this.withAndWithoutWalkListForDuplicate= returnArray.value;
        
    for(let i=0; i<this.withAndWithoutWalkListForDuplicate.length; i++){
      const currentItem = this.withAndWithoutWalkListForDuplicate[i];

      if(data.typeOfVisitor==currentItem.typeOfVisitor && data.typeOfTicket==currentItem.typeOfTicket){
        this.commonService.openAlert('Info', 'Duplicate Data Not Allowed', 'warning');
        return false;
      }
    }

    this.addItem('withAndWithoutWalkList').push(this.addTicketData(data));
    this.totalAmountZoo = this.ticketBookingForm.get('amounts').get('code').value + this.totalAmountZoo

    this.totalVisitorZoo = parseInt(this.ticketBookingForm.get('numberOfVisitors').get('code').value) + this.totalVisitorZoo

    this.ticketBookingForm.get('typeOfTicket').reset();
    this.ticketBookingForm.get('typeOfVisitor').reset();
    this.ticketBookingForm.get('amounts').reset();
    this.ticketBookingForm.get('numberOfVisitors').reset();
    this.ticketBookingForm.get('charges').reset();

}

  /**
	 * Method is used to add recode in array control
	 */
	addItem(controlName: string) {
		let returnArray: any;
		returnArray = this.ticketBookingForm.get(controlName) as FormArray;
 
		return returnArray;

	}

  deleteRecord(index: number,item: any,gridType: string,) {

    let returnArray = this.ticketBookingForm.get('withAndWithoutWalkList') as FormArray;

    this.commonService.deleteAlert('Are you sure?', "You won't be able to revert this!", 'warning', '', performDelete => {

      if (item.id == null) {
        returnArray.removeAt(index);

        this.commonService.successAlert('Deleted Successfully!', '', 'success');
      } else {

        returnArray.removeAt(index);
			this.commonService.successAlert('Deleted Successfully!', '', 'success');
      }
    } 
    );
    this.totalAmountZoo =  this.totalAmountZoo- item.amounts;

    this.totalVisitorZoo =  this.totalVisitorZoo- item.numberOfVisitors;
  }

  checkFormInvalid(){
   return  (this.ticketBookingForm.get('withAndWithoutWalkList').value == null 
        || this.ticketBookingForm.get('withAndWithoutWalkList').value.length==0) 
        || this.ticketBookingForm.get('applicantName').invalid 
        || this.ticketBookingForm.get('applicantMobile').invalid
        ||this.ticketBookingForm.get('idType').invalid
        ||this.ticketBookingForm.get('idNumber').invalid
        || this.ticketBookingForm.get('visitingDate').invalid
  }

}
