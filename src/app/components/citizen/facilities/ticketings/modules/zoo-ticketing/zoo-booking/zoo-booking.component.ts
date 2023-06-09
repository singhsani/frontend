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
    'Withoutprice',
    'Withprice'
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
  changedValue : any;
  editMode : boolean= false;
  /**
    * Pricing data for ticket bookings for visiting zoo
   */
  pricing: any[] = [
    {
      categoryName: 'Children',
      description: this.pipe.transform("children_below_5_years_of_age", this.translateKey),
      WithoutpriceField: 'CHILDREN',
      WithpriceField : 'CHILDRENS'
    },
    {
      categoryName: 'Children',
      description: this.pipe.transform("children_below_12_years_of_age", this.translateKey),
      WithoutpriceField: 'CHILD',
      WithpriceField : 'CHILDS'
    },
    {
      categoryName: 'Adults',
      description: this.pipe.transform("adults", this.translateKey),
      WithoutpriceField: 'ADULT',
      WithpriceField :'ADULTS'
    },
    {
      categoryName: 'Camera',
      description: this.pipe.transform("camera_fees", this.translateKey),
      WithoutpriceField: 'CAMERA',
      WithpriceField :'CAMERAS'
    },
    {
      categoryName: 'Video Camera',
      description: this.pipe.transform("video_camera_fees", this.translateKey),
      WithoutpriceField: 'VIDEOCAMERA',
      WithpriceField :'VIDEOCAMERAS'
    },
    {
      categoryName: 'Educational Institute',
      description: this.pipe.transform("for_educational_institute", this.translateKey),
      WithoutpriceField: 'NUMBER_OF_VISITORS_EDUCATIONAL_WITHOUT',
      WithpriceField :'NUMBER_OF_VISITORS_EDUCATIONAL_WITH'
    }
  ];

  gujPricing: any[] = [
    {
      srNo : '૧',
      categoryName: 'Children',
      description: this.pipe.transform("બાળકો (૫ વર્ષ સુધી)", this.translateKey),
      WithoutpriceField: 'માફી',
      WithpriceField : 'માફી'

    },
    {
      srNo:'૨',
      categoryName: 'Children',
      description: this.pipe.transform("બાળકો (૫ વર્ષ થી ૧૨ વર્ષ સુધી)", this.translateKey),
      WithoutpriceField: '૨૦',
      WithpriceField : '૫૦'
    },
    {
      srNo:'૩',
      categoryName: 'Adults',
      description: this.pipe.transform("પુખ્ત વયના લોકો (૧૨ વર્ષ થી ઉપર)", this.translateKey),
      WithoutpriceField: '૩૦',
      WithpriceField :'૮૦'
    },
    {
      srNo:'૪',
      categoryName: 'Camera',
      description: this.pipe.transform("કૅમેરા ફી", this.translateKey),
      WithoutpriceField: '૧૦૦',
      WithpriceField :'૧૦૦'
    },
    {
      srNo:'૬',
      categoryName: 'Video Camera',
      description: this.pipe.transform("વિડિઓ કૅમેરા ફી", this.translateKey),
      WithoutpriceField: '૧૫૦',
      WithpriceField :'૧૫૦'
    },
    {
      srNo:'૭',
      categoryName: 'Educational Institute',
      description: this.pipe.transform("શૈક્ષણિક સંસ્થા માટે", this.translateKey),
      WithoutpriceField: '૧૦',
      WithpriceField :'૩૦'
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
    * Timing data for ticket bookings for visiting zoo in gujrati
  */
   Gujtiming: any[] = [
    {
      srNo : '૧',
      'months': 'જુલાઈ થી માર્ચ',
      'slot': 'સવારે ૯:૦૦ થી સાંજે ૬:૦૦ સુધી'
    },
    {
      srNo:'૨',
      'months': 'એપ્રિલ થી જૂન',
      'slot': 'સવારે ૯:૦૦ થી સાંજે  ૬:૩૦ સુધી'
    }
  ];


  /**
   * Used for material table data population and pagination.
  */
  dataSourceForPricing = new MatTableDataSource();
  dataSourceForTiming = new MatTableDataSource();
  dataSourceForGujPricing = new MatTableDataSource();
  dataSourceForgujTiming = new MatTableDataSource();


  // Ticket Details

  ticketBookingForm: FormGroup;
  ticketBookingDetails : FormArray;
  subTotal: number = 0;
  amount: number = 0;
  totalAmount: number = 0;
  numberOfVisitors: number = 0;
  withAndWithoutWalkListForDuplicate: any = [];

  defaultDateForReset : Date;

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
  showSelectLanguage : boolean = true
  


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
    this.dataSourceForGujPricing.data = this.gujPricing;
    this.dataSourceForTiming.data = this.timing;
    this.dataSourceForgujTiming.data = this.Gujtiming
    this.isVisibleIdNumber = false;
    this.isPanCardVisibleIdNumber = false;

    this.ticketBookingFormControls();
    this.getLookUps();
    this.getZooVisitingRates();
    this.setDefaultDate();  

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
  setDefaultDate(){

    var defaultDate  = moment(new Date()).add(1, 'day').toDate();
     if(this.disableThursday(defaultDate)){
       this.ticketBookingForm.get('visitingDate').setValue(moment(defaultDate).format('YYYY-MM-DD')); 
     }else{
       defaultDate.setDate(defaultDate.getDate()+1);
       this.ticketBookingForm.get('visitingDate').setValue(moment(defaultDate).format('YYYY-MM-DD')); 
     }
     this.defaultDateForReset= defaultDate
   }

  /**
    * Get Zoo Visiting Rates from api.
  */
  getZooVisitingRates() {
    this.ticketingService.getZooVisitingRates().subscribe((respRates) => {
      this.zooVisitingRates = respRates.data ; 
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
      visitingDate: [null, Validators.required],
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
      totalChildBelows:[0,Validators.max[100]],
      totalChildBelow:[0,Validators.max[100]],

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
    if(this.totalAmountZoo==0){
      this.commonService.openAlert('Warning', 'Invalid Ticket! Amount is 0', 'warning');
        return;
    }
    if(this.totalVisitorZoo==0){
      this.commonService.openAlert('Warning', 'Invalid Ticket! Visitor is 0', 'warning');
        return;
    }
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
    this.ticketBookingForm.reset({
      visitingDate :  moment(this.defaultDateForReset).format('YYYY-MM-DD')

    });
    this.visitorsTypesChange=[];
    this.numberOfVisitors = 0;
    this.subTotal = 0;
    this.totalAmount = 0;
    this.totalVisitorZoo = 0;
    this.totalAmountZoo = 0;
    this.withAndWithoutWalkListForDuplicate = [];
    for (let i = this.ticketBookingForm.get('withAndWithoutWalkList')['controls'].length-1; i >=0; i--) {
      this.addItem('withAndWithoutWalkList').removeAt(i)
    }
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
    
    this.calculateAmount(event);
      this.ticketBookingForm.get('amounts').get('code').setValue(this.totalAmount);
     
     
  }

  calculateAmount(event){
    let numberOfVisitors = event.target.value;
    this.numberOfVisitor = event.target.value
      const f = this.ticketBookingForm.value;
      if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Children (Age 5 to 12 )")
      {
      this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CHILD']);
      }
      else if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Adults (Above age 12)"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['ADULT']);
      }
      else if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CAMERA']);
      }

      else if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Video Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['VIDEOCAMERA']);
      }
      else if(f.typeOfTicket.code == 'WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Children Below 5 Free"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CHILDBELOW']);

      }

      else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Children (Age 5 to 12 )"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CHILDS']);
      }
      else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Adults (Above age 12)"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['ADULTS']);
      }
      else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CAMERAS']);
      }
      else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Video Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['VIDEOCAMERAS']);
      }
      else if(f.typeOfTicket.code == 'WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Children Below 5 Free"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CHILDBELOW']);
      }else if(f.typeOfTicket.code == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Educational Visitors"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['NUMBER_OF_VISITORS_EDUCATIONAL_WITHOUT'])
      }
      else if(f.typeOfTicket.code == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CAMERAS_EDUCATIONAL_WITHOUT'])
      }
      else if(f.typeOfTicket.code == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Video Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['VIDEOCAMERAS_EDUCATIONAL_WITHOUT'])

      }
      else if(f.typeOfTicket.code == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Educational Visitors"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['NUMBER_OF_VISITORS_EDUCATIONAL_WITH'])
      }
      else if(f.typeOfTicket.code == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['CAMERAS_EDUCATIONAL_WITH'])
      }
      else if(f.typeOfTicket.code == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && f.typeOfVisitor.name == "Video Camera Fee"){
        this.totalAmount = numberOfVisitors * (this.zooVisitingRates['VIDEOCAMERAS_EDUCATIONAL_WITH'])
      }
  }

  addTicketData(data: any){
    if(data.typeOfTicket == 'WITHOUT_WALK_IN_AVIARY' && data.typeOfVisitor == "Children (Age 5 to 12 )"){
      this.ticketBookingForm.get('totalChild').setValue(data.numberOfVisitors);
      }
      else if(data.typeOfTicket == 'WITHOUT_WALK_IN_AVIARY' && data.typeOfVisitor == "Adults (Above age 12)"){
        this.ticketBookingForm.get('totalAdult').setValue(data.numberOfVisitors);
      }
      else if(data.typeOfTicket == 'WITHOUT_WALK_IN_AVIARY' && data.typeOfVisitor == "Camera Fee"){
        this.ticketBookingForm.get('totalCamera').setValue(data.numberOfVisitors);
      }
      else if(data.typeOfTicket == 'WITHOUT_WALK_IN_AVIARY' && data.typeOfVisitor == "Video Camera Fee"){
        this.ticketBookingForm.get('totalVideoCamera').setValue(data.numberOfVisitors);
      }
      else if(data.typeOfTicket == 'WITHOUT_WALK_IN_AVIARY' && data.typeOfVisitor == "Children Below 5 Free"){
        this.ticketBookingForm.get('totalChildBelow').setValue(data.numberOfVisitors);
      }

  else if(data.typeOfTicket == 'WITH_WALK_IN_AVIARY' && data.typeOfVisitor == "Children (Age 5 to 12 )"){
    this.ticketBookingForm.get('totalChilds').setValue(data.numberOfVisitors);
  }
  else if(data.typeOfTicket == 'WITH_WALK_IN_AVIARY' && data.typeOfVisitor == "Adults (Above age 12)"){
    this.ticketBookingForm.get('totalAdults').setValue(data.numberOfVisitors);
  }
  else if(data.typeOfTicket == 'WITH_WALK_IN_AVIARY' && data.typeOfVisitor == "Camera Fee"){
    this.ticketBookingForm.get('totalCameras').setValue(data.numberOfVisitors);
  }
  else if(data.typeOfTicket == 'WITH_WALK_IN_AVIARY' && data.typeOfVisitor == "Video Camera Fee"){
    this.ticketBookingForm.get('totalVideoCameras').setValue(data.numberOfVisitors);
  }
  else if(data.typeOfTicket == 'WITH_WALK_IN_AVIARY' && data.typeOfVisitor == "Children Below 5 Free"){
    this.ticketBookingForm.get('totalChildBelows').setValue(data.numberOfVisitors);
  }
  else if(data.typeOfTicket == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && data.typeOfVisitor == "Educational Visitors"){
    this.ticketBookingForm.get('educationalVisitor').setValue(data.numberOfVisitors);
  }
  else if(data.typeOfTicket == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && data.typeOfVisitor == "Camera Fee"){
    this.ticketBookingForm.get('cameraEducationalWithout').setValue(data.numberOfVisitors);
  }
  else if(data.typeOfTicket == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY' && data.typeOfVisitor == "Video Camera Fee"){
    this.ticketBookingForm.get('vcameraEducationalWithout').setValue(data.numberOfVisitors);
  }
  else if(data.typeOfTicket == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && data.typeOfVisitor == "Educational Visitors"){
    this.ticketBookingForm.get('educationalVisitors').setValue(data.numberOfVisitors);
  }
  else if(data.typeOfTicket == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && data.typeOfVisitor == "Camera Fee"){
    this.ticketBookingForm.get('cameraEducationalWith').setValue(data.numberOfVisitors);
  }
  else if(data.typeOfTicket == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && data.typeOfVisitor == "Video Camera Fee"){
    this.ticketBookingForm.get('vcameraEducationalWith').setValue(data.numberOfVisitors);
  }
   
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
        this.commonService.openAlert('Warning', 'Duplicate Data Not Allowed', 'warning');
        return false;
      }
      else if (data.typeOfTicket == 'WITH_WALK_IN_AVIARY' || data.typeOfTicket == 'WITHOUT_WALK_IN_AVIARY') {
        if( currentItem.typeOfTicket !='WITH_WALK_IN_AVIARY' && currentItem.typeOfTicket !='WITHOUT_WALK_IN_AVIARY'){
          this.commonService.openAlert('Warning', 'Please select either the "General" or "Educational"  ticket type at a time !', 'warning');
          return false;
        }
      }else if (data.typeOfTicket == 'EDUCATIONAL_WITH_WALK_IN_AVIARY' || data.typeOfTicket == 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY'){
      if(currentItem.typeOfTicket != 'EDUCATIONAL_WITH_WALK_IN_AVIARY' && currentItem.typeOfTicket != 'EDUCATIONAL_WITHOUT_WALK_IN_AVIARY'){
        this.commonService.openAlert('Warning', 'Please select either the "General" or "Educational"  ticket type at a time !', 'warning');
        return false;
        }
      }
    }

    this.addItem('withAndWithoutWalkList').push(this.addTicketData(data));
    this.totalAmountZoo = this.ticketBookingForm.get('amounts').get('code').value + this.totalAmountZoo

    if (!(this.ticketBookingForm.get('typeOfVisitor').get('name').value =='Camera Fee' || this.ticketBookingForm.get('typeOfVisitor').get('name').value =='Video Camera Fee')){
      this.totalVisitorZoo = parseInt(this.ticketBookingForm.get('numberOfVisitors').get('code').value) + this.totalVisitorZoo
    }

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

      if (item.id == null) {
        returnArray.removeAt(index);

        this.commonService.successAlert('Deleted Successfully!', '', 'success');
      } else {

        returnArray.removeAt(index);
			this.commonService.successAlert('Deleted Successfully!', '', 'success');
      }
     
    this.totalAmountZoo =  this.totalAmountZoo- item.amounts;

    if(!(item.typeOfVisitor == 'Camera Fee' || item.typeOfVisitor == 'Video Camera Fee' )){
      this.totalVisitorZoo =  this.totalVisitorZoo- item.numberOfVisitors;
    }
  }

  checkFormInvalid(){
   return  (this.ticketBookingForm.get('withAndWithoutWalkList').value == null 
        || this.ticketBookingForm.get('withAndWithoutWalkList').value.length==0) 
        || this.ticketBookingForm.get('applicantName').invalid 
        || this.ticketBookingForm.get('applicantMobile').invalid
        ||this.ticketBookingForm.get('idType').invalid
        ||this.ticketBookingForm.get('idNumber').invalid
        || this.ticketBookingForm.get('visitingDate').invalid
        || this.editMode

  }

  selectLanguage(event) {
		if (event == 'gu') {
			this.showSelectLanguage = true
		}
		else {
			this.showSelectLanguage = false
		}

	}

  editRecord(item: any){
    item.isEditMode=true;
    this.editMode=true;
  }

  saveRecord(index: number,item: any){
    let returnArray = this.ticketBookingForm.get('withAndWithoutWalkList') as FormArray;
    let data ={
      isEditMode: false,
      typeOfTicket : returnArray.controls[index].get('typeOfTicket').value,
      typeOfVisitor : returnArray.controls[index].get('typeOfVisitor').value,
      charges : returnArray.controls[index].get('charges').value,
      amounts :  returnArray.controls[index].get('amounts').value,
      numberOfVisitors : returnArray.controls[index].get('numberOfVisitors').value,
      typeOfTicketName : returnArray.controls[index].get('typeOfTicketName').value
    }

    this.addTicketData(data);
    this.totalAmountZoo=0;
    this.totalVisitorZoo=0;
    
    returnArray.value.forEach(element => {
      this.totalAmountZoo = this.totalAmountZoo + parseInt(element.amounts)
      if (!(element.typeOfVisitor=='Camera Fee' || element.typeOfVisitor =='Video Camera Fee')){
        this.totalVisitorZoo = parseInt(element.numberOfVisitors) + this.totalVisitorZoo
      }
    });
    item.isEditMode=false;
    this.editMode=false;
  }

  changeData(event,index:number,item:any){
    this.changedValue=event.target.value;
    let returnArray = this.ticketBookingForm.get('withAndWithoutWalkList') as FormArray;
    returnArray.controls[index].get('numberOfVisitors').setValue(event.target.value);

    console.log("Return Array:",returnArray);
    console.log("With and without list:",this.ticketBookingForm.get('withAndWithoutWalkList'));

    this.totalAmount= returnArray.controls[index].get('charges').value * returnArray.controls[index].get('numberOfVisitors').value;
    returnArray.controls[index].get('amounts').setValue(this.totalAmount);
  }

}
