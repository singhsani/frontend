import { FormsActionsService } from 'src/app/core/services/citizen/data-services/forms-actions.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TicketingsService } from '../../../shared-ticketing/services/ticketings.service';
import { TicketingConstants, TicketingUtils } from '../../../config/ticketing-config';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { ValidationService } from '../../../../../../../shared/services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from 'src/app/shared/modules/translate/translate.pipe';
import { Constants } from 'src/app/vmcshared/Constants';

@Component({
  selector: 'app-book-planetarium',
  templateUrl: './book-planetarium.component.html',
  styleUrls: ['./book-planetarium.component.scss'],
  providers: [TranslatePipe]
})
export class BookPlanetariumComponent implements OnInit {

  @ViewChild("paymentGateway") paymentGateway: TemplateRef<any>;

  translateKey: string = 'planetariumScreen';

  ticketBookingForm: FormGroup;
  subTotal: number;
  totalAmount: number;
  numberOfVisitors: number;
  isLoadingResults: boolean = false;
  isVisibleIdNumber = false;
  isPanCardVisibleIdNumber = false;
  showType : any;

  minDate = moment(new Date()).add(0, 'day').toISOString();
  maxDate = moment(new Date()).add(6, 'day').toISOString();

  // Loading Ticketing Configurations
  ticketingConstants = TicketingConstants;
  ticketingUtils: TicketingUtils;
  planetariumVisitingRates: any;
  totalVisitorLimit: number = 5;
  seatAvailable: boolean = true;
  isFileUploaded: boolean = false;
  remainSeats:number;
  /**
   * Lookups & Data
   */
  BANKS: Array<any> = [];
  idTypes: Array<any> = [];
  CANCELLATION_TYPE: Array<any> = [];
  PLANETARIUM_SHOWS_TIMING: Array<any> = [];
  PLANETARIUM_SPECIAL_SHOWS_LAG: Array<any> = [];
  PLANETARIUM_SHOW_CATEGORY: Array<any> = [];
  FINAL_PLANETARIUM_SHOW_CATEGORY: Array<any> = [];
  PLANETARIUM_VISITOR: Array<any> = [];
  PURPOSE: Array<any> = [];
  resourceName: Array<any> = [];
  DateFormate: string = 'Hint: DD/MM/YYYY';

  guideLineFlag: boolean = true;
    showPlanetariumSearchForm: boolean = false;
    head_lines: string;
    checkProceed: boolean = false;

  constants = Constants;
  rupeeSign: string;
  showSelectLanguage : boolean = true;
  btnProceed : boolean = true;
  gujheadLine : string;

  /**
   * @param fb - Declare FormBuilder property.
   * @param ticketingService - Declare Ticketing Service
   * @param commonService - Declare sweet alert.
   * @param router - Declare Routing Property.
  */
  constructor(
    private _fb: FormBuilder,
    public ticketingService: TicketingsService,
    private commonService: CommonService,
    private router: Router,
    private toster: ToastrService,
    public validationError: ValidationService,
    public pipe: TranslatePipe,
    protected formService: FormsActionsService
  ) {
    this.ticketingService.resourceType = 'planetarium';
    this.ticketingUtils = new TicketingUtils(formService, toster);
  }

  ngOnInit() {
  this.head_lines = `Online Planetarium Booking facility is the convenient and easy way to book the Planetarium of Vadodara Municipal Corporation. You can view the availability details of the Planetarium and select booking date. The booking is confirmed on successful payment of the rent amount for selected date.`;
  this.gujheadLine = `ઓનલાઈન પ્લેનેટોરિયમ બુકિંગ સુવિધા એ વડોદરા મ્યુનિસિપલ કોર્પોરેશનના પ્લેનેટોરિયમ બુક કરવાની અનુકૂળ અને સરળ રીત છે. તમે પ્લેનેટેરિયમની ઉપલબ્ધતા વિગતો જોઈ શકો છો અને બુકિંગ તારીખ પસંદ કરી શકો છો. પસંદ કરેલી તારીખ માટે ભાડાની રકમની સફળ ચુકવણી પર બુકિંગની પુષ્ટિ થાય છે.`
  this.createTicketBookingForm();
    this.getLookUps();
    this.getListData();
    this.profileData();
    this.setDefaultDate();
    this.rupeeSign = this.constants.rupeeSymbol;
  }

  setDefaultDate(){
    if (this.ticketBookingForm.get('showCategory').get('code').value == 'PLANETARIUM_GENERAL_SHOW') {
        let dd = new Date();
        if(dd.getDay()==4){
           let plusDay = moment().add(1, 'day').format("YYYY-MM-DD");
           this.ticketBookingForm.get('visitingDate').setValue(plusDay);
           this.maxDate = moment(new Date()).add(7, 'day').toISOString();
        }
    }
  }
  /**
	* Get all booking category list from api.
	*/
  getLookUps() {
    this.ticketingService.getDataFromLookups().subscribe((respLookUp) => {
      this.BANKS = respLookUp.BANK;
      this.idTypes = respLookUp.IDTYPE;
      this.CANCELLATION_TYPE = respLookUp.CANCELLATION_TYPE;
      this.PLANETARIUM_SHOWS_TIMING = respLookUp.PLANETARIUM_SHOWS_TIMING;
      this.PLANETARIUM_SPECIAL_SHOWS_LAG = respLookUp.PLANETARIUM_SPECIAL_SHOWS_LANGUAGE;
      this.PLANETARIUM_SHOW_CATEGORY = respLookUp.PLANETARIUM_SHOW_CATEGORY;
      this.FINAL_PLANETARIUM_SHOW_CATEGORY.push(this.PLANETARIUM_SHOW_CATEGORY[0]);
      this.FINAL_PLANETARIUM_SHOW_CATEGORY.push(this.PLANETARIUM_SHOW_CATEGORY[1]);
      this.PLANETARIUM_VISITOR = respLookUp.PLANETARIUM_VISITOR;
      this.PURPOSE = respLookUp.PURPOSE;
    }, err => {
      this.toster.error("Server Error");
    });
  }

  /**
	  * disble thursday for vistior date.
	*/
  disableThursday(d: Date) {
    if(d.getDay() != 4) {
      return d;
    }
  }

  changeDateAndSetDate(){
        let dd = new Date();
        if(dd.getDay()==2){
           let plusDay = moment().add(3, 'day').format("YYYY-MM-DD");
           this.ticketBookingForm.get('visitingDate').setValue(plusDay);
           this.maxDate = moment(new Date()).add(17, 'day').toISOString();
        }else{
          let plusDay = moment().add(2, 'day').format("YYYY-MM-DD");
          this.ticketBookingForm.get('visitingDate').setValue(plusDay);
        }
  }

  /* Jan = 0 & Dec = 11 */
  disableDates(d: Date) {
      if (d.getMonth() == 2 && d.getFullYear() == new Date().getFullYear()) {
          if(d.getDay()==4){
              return [29].indexOf(+d.getDate()) == -1 && d.getDay() == 4;
          }else{
              return [29].indexOf(+d.getDate()) == -1 && d.getDay() != 4;
          }
      } else if (d.getMonth() == 6 && d.getFullYear() == new Date().getFullYear()) {
          if(d.getDay()==4){
              return [21].indexOf(+d.getDate()) == -1 && d.getDay() == 4;
          }else{
              return [21].indexOf(+d.getDate()) == -1 && d.getDay() != 4;
          }
      } else if (d.getMonth() == 7 && d.getFullYear() == new Date().getFullYear()) {
          if(d.getDay()==4){
              return [22].indexOf(+d.getDate()) == -1 && d.getDay() == 4;
          }else{
              return [22].indexOf(+d.getDate()) == -1 && d.getDay() != 4;
          }
      } else if (d.getMonth() == 9 && d.getFullYear() == new Date().getFullYear()) {
          if(d.getDay()==4){
              return [25].indexOf(+d.getDate()) == -1 && d.getDay() == 4;
          }else{
              return [25].indexOf(+d.getDate()) == -1 && d.getDay() != 4;
          }

      } else if (d.getMonth() == 10 && d.getFullYear() == new Date().getFullYear()) {
          if(d.getDay()==4){
              return [5, 19, 26].indexOf(+d.getDate()) == -1 && d.getDay() != 4;
          }else{
              return [5, 19, 26].indexOf(+d.getDate()) == -1 && d.getDay() != 4;
          }
      }
      else {
        return d.getDay() != 4;
      }
    }

  CheckType(idCode){
    this.isVisibleIdNumber = false;
    this.isPanCardVisibleIdNumber = false;
    if(idCode === 'AADHARCARD'){
      this.isVisibleIdNumber = true;
      this.isPanCardVisibleIdNumber = false;
      this.ticketBookingForm.controls['idNumber'].setValue('');
      this.ticketBookingForm.controls['idNumber'].setValidators([Validators.required]);
      this.ticketBookingForm.controls['idNumber'].updateValueAndValidity();
    }else if(idCode === 'PANCARD'){
      this.isPanCardVisibleIdNumber = true;
      this.isVisibleIdNumber = false;
      this.ticketBookingForm.controls['idNumber'].setValidators([Validators.required, ValidationService.panValidatorforlastfour]);
      this.ticketBookingForm.controls['idNumber'].updateValueAndValidity();
    }else if(idCode === 'VOTINGCARD' || idCode === 'PASSPORT'){
      this.isVisibleIdNumber = true;
      this.isPanCardVisibleIdNumber = false;
      this.ticketBookingForm.controls['idNumber'].setValue('');
      this.ticketBookingForm.controls['idNumber'].setValidators([Validators.required]);
      this.ticketBookingForm.controls['idNumber'].updateValueAndValidity();
    }

  }

  /**
   * get form data
   */
  getListData() {
    this.ticketingService.getListData().subscribe(resList => {
      this.resourceName = resList.data;
    },
      err => {
        this.toster.error("Server Error");
      });

    //visitor rate chart
    if (this.ticketBookingForm.get('showCategory').get('code').value == 'PLANETARIUM_GENERAL_SHOW') {
      this.visitorRateChartCall();
    }
    // this.ticketingService.getFormData();
  }

  /**
   * Show applicant data(login user)
   */
  profileData() {
    this.ticketingService.getUserProfile().subscribe(res => {
      this.ticketBookingForm.get('firstName').setValue(res.data.firstName);
      this.ticketBookingForm.get('lastName').setValue(res.data.lastName);
      this.ticketBookingForm.get('applicantMobile').setValue(res.data.cellNo);

    },
      err => {
        this.toster.error("Server Error");
      });
  }

  /**
   * Change Date format
   */
  changeDateFormat(e) {
    this.ticketBookingForm.get('visitingDate').setValue(moment(e.value).format('YYYY-MM-DD'));
    this.ticketBookingForm.get('planetariumShowTiming').get('code').reset();
    this.ticketBookingForm.get('totalVisitor').reset();
    this.ticketBookingForm.get('specialShowLanguage').get('code').reset();
    this.ticketBookingForm.get('visitors').reset();
  }

  /**
   * set ShiftType as per planetarium_shows_timing
   */
  setShiftType() {
    this.ticketBookingForm.get('visitors').reset();
    this.ticketBookingForm.get('totalVisitor').reset();
    if (this.ticketBookingForm.get('showCategory').get('code').value != 'PLANETARIUM_SPECIAL_SHOW') {
      let type = this.ticketBookingForm.get('planetariumShowTiming').get('code').value;
      this.ticketBookingForm.get('shiftType').setValue(type);
    }
  }

  /**
   * set visitors as per lookup selection
   */
  setVisitors() {
    if ((this.ticketBookingForm.get('visitors').get('code').value) != null) {
      let visitors = Number(this.ticketBookingForm.get('visitors').get('code').value);
      this.ticketBookingForm.get('totalVisitor').setValue(visitors);
    }
  }
  /**
   * this method for check seats availability
   */
  getPlanetariumShowAvailability() {

    if (this.ticketBookingForm.get('totalVisitor').value && this.ticketBookingForm.get('specialShowLanguage').get('code').value) {
      this.ticketingService.getPlanetariumShowAvailability(
        this.ticketBookingForm.get('resourceCodeLK').get('code').value,
        this.ticketBookingForm.get('specialShowLanguage').get('code').value,
        this.ticketBookingForm.get('visitingDate').value,
        this.ticketBookingForm.get('totalVisitor').value,
         this.ticketBookingForm.get('showCategory').get('code').value).subscribe(
          (respSwiftData) => {
//             if(respSwiftData.statusCode == '401' ){
//               //this.toster.error(respSwiftData.message);
//               this.ticketBookingForm.get('totalVisitor').setValue(15);
//               this.computeTotalAndVisitors();
//               return;
//             }
            if(respSwiftData.success){
               if (!respSwiftData.data.seatAvailable) {
                  this.toster.success('Total '+ respSwiftData.data.availableSeats + ' seats are available');
               }
            }else{
              this.toster.error(respSwiftData.message);
              this.ticketBookingForm.get('totalVisitor').reset();
            }
            this.seatAvailable = respSwiftData.data.seatAvailable;
            // this.commonService.successAlert('success', 'Available', 'success');
            if (this.seatAvailable) {
              this.toster.success(this.ticketBookingForm.get('totalVisitor').value + ' ' + this.ticketingConstants.AVAILABLE_SEATS);
            }
            else {
              this.toster.error(this.ticketBookingForm.get('totalVisitor').value + ' ' + this.ticketingConstants.NOT_AVAILABLE);
              this.ticketBookingForm.get('totalVisitor').reset();
            }
          },
          err => {
            this.commonService.openAlert("Error", err.error[0].message, "warning");
          });
    }
    else {
      this.ticketBookingForm.controls['totalVisitor'].markAsTouched();
      // this.markFormGroupTouched(this.ticketBookingForm);
      // this.toster.error(this.ticketingConstants.ALL_FEILD_REQUIRED_MESSAGE);
    }

  }

  getPlanetariumGeneralShowAvailability() {
    if (this.ticketBookingForm.get('planetariumShowTiming').get('code').value &&
      this.ticketBookingForm.get('visitors').get('code').value) {
      this.ticketingService.getPlanetariumShowAvailability(
        this.ticketBookingForm.get('resourceCodeLK').get('code').value,
        this.ticketBookingForm.get('planetariumShowTiming').get('code').value,
        this.ticketBookingForm.get('visitingDate').value,
        this.ticketBookingForm.get('visitors').get('code').value,
        this.ticketBookingForm.get('showCategory').get('code').value).subscribe(
          (respData) => {
            if(respData.statusCode == '401' ){
              this.toster.error(respData.message);
              return;
            }
            this.seatAvailable = respData.data.seatAvailable;
            this.remainSeats = respData.data.availableSeats;
            this.ticketBookingForm.get('remainSeats').setValue(this.remainSeats);
            //this.commonService.successAlert('success', 'Available', 'success');
            if (this.seatAvailable) {
              this.toster.success(this.ticketBookingForm.get('visitors').get('code').value + ' ' + this.ticketingConstants.AVAILABLE_SEATS);
            }
            else {
              this.toster.error(this.ticketBookingForm.get('visitors').get('code').value + ' ' + this.ticketingConstants.NOT_AVAILABLE);
            }
          },
          err => {
            this.commonService.openAlert("Error", err.error[0].message, "warning");
          });
    }
    else {
      // this.ticketBookingForm.controls['totalVisitor'].markAsTouched();
      // this.markFormGroupTouched(this.ticketBookingForm);
      // this.toster.error(this.ticketingConstants.ALL_FEILD_REQUIRED_MESSAGE);
    }
  }


  /**
   *  Will Compute total amount
   */
  computeTotalAndVisitors() {

    this.getPlanetariumShowAvailability();
    const f = this.ticketBookingForm.getRawValue();
    if (this.ticketBookingForm.get('totalVisitor').valid) {
      this.totalAmount = Number(f.totalVisitor) * (Number(f.rate));

      this.ticketBookingForm.get('amount').setValue(this.totalAmount);

    }
  }


  /**
    * Get Show timming slots.
   */
  getPlanetariumShowTimeSlot(e) {
    let showDate = moment(e.value).format('YYYY-MM-DD');
    if (!this.ticketBookingForm.get('visitingDate').invalid) {
      this.ticketingService.getPlanetariumShowTimeSlot(showDate, this.ticketBookingForm.get('resourceCodeLK').get('code').value).subscribe((respTimeSlotData) => {
        // let planetariumVisitingSlot = respTimeSlotData.data;
        // this.ticketBookingForm.get('rate').setValue(this.planetariumVisitingSlot.visitorCharge)
      },
        err => {
          this.toster.error("Server Error");
        });
    }

  }

  /**
   * Create form controls.
   */
  createTicketBookingForm() {
    this.ticketBookingForm = this._fb.group({
      id: null,
      uniqueId: null,
      version: null,
      cancelledDate: null,
      bookingDate: [moment(new Date()).format('YYYY-MM-DD')],
      status: null,
      refNumber: null,
      bookingFormId : null,
      remainSeats:[{value: null}],
      resourceType: null,
      payableServiceType: null,
      resourceCode: 'SARDAR_PATEL_PLANETARIUM',
      resourceCodeLK: this._fb.group({
        name: null,
        code: ['SARDAR_PATEL_PLANETARIUM', [Validators.required]]
      }),
      visitingDate: [moment().format('YYYY-MM-DD'), [Validators.required]],
      showCategory: this._fb.group({
        name: [null],
        code: ['PLANETARIUM_GENERAL_SHOW']
      }),
      planetariumShowTiming: this._fb.group({
        name: null,
        code: [null]
      }),
      specialShowLanguage: this._fb.group({
        name: null,
        code: null
      }),
      seatNo: null,
      totalVisitor: [null],
      visitors: this._fb.group({
        name: null,
        code: [null]
      }),
      rate: [{ value: null }],
      amount: [null],

      showStartTime: null,
      showEndTime: null,

      schoolName: null,
      schoolMobileNumber: [null],
      schoolEmailId: [null, [ ValidationService.emailValidator ,Validators.maxLength(50)]],

      shiftType: null,
      specialShow: null,

      idType: this._fb.group({
        name: null,
        code: [null, Validators.required]
      }),
      // idNumber: [null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      idNumber: [null, [Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
      applicantName: null,
      applicantMobile: [null, [Validators.required]],
      applicantEmailID: [null, [ValidationService.emailValidator]],
      paymentMode: this._fb.group({
        name: null,
        code: null
      }),

      firstName: [null, [Validators.required, ValidationService.nameValidator]],
      middleName: null,
      lastName: [null, [Validators.required, ValidationService.nameValidator]],

      accountHolderName: null,
      accountNo: null,
      bankName: null,
      ifscCode: null,
      attachments: [],

      scheduleList: [],
      // {
      //   id: null,
      //   uniqueId: null,
      //   version: null,
      //   cancellationType: null,
      //   cancelledDate: null,
      //   status: "PAYMENT_REQUIRED",
      //   shiftType: "GUJARATI",
      //   bookingDate: "2019-06-06",
      //   startTime: "04:01:00",
      //   endTime: "04:30:00",
      //   bookingNo: null
      // }],
      bookingPurposeMaster: this._fb.group({
        name: null,
        code: null
      }),
      agree: null,
      attachment: null
    })
  }

  /**
   * This method for set and remove validation as per show selection
   * @param event
   */
  setValidationForSpecialShow(event) {
    this.ticketBookingForm.reset();
     this.showType = event;
    // set default value
    this.ticketBookingForm.get('resourceCodeLK').get('code').setValue('SARDAR_PATEL_PLANETARIUM');
    this.ticketBookingForm.get('resourceCode').setValue('SARDAR_PATEL_PLANETARIUM');
    this.ticketBookingForm.get('visitingDate').setValue(moment().format('YYYY-MM-DD'));
    this.ticketBookingForm.get('bookingDate').setValue(moment(new Date()).format('YYYY-MM-DD'));
    this.ticketBookingForm.get('showCategory').get('code').setValue(event);
    if (event == 'PLANETARIUM_SPECIAL_SHOW') {
      this.minDate = moment(new Date()).add(2, 'day').toISOString();
      this.maxDate = moment(new Date()).add(16, 'day').toISOString();
      this.changeDateAndSetDate();
      this.ticketBookingForm.get('schoolName').setValidators([Validators.required]);
      this.ticketBookingForm.get('schoolEmailId').setValidators([Validators.required, ValidationService.emailValidator]);
      this.ticketBookingForm.get('specialShowLanguage.code').setValidators(Validators.required);
      // this.ticketBookingForm.get('totalVisitor').setValidators([Validators.required, Validators.max(156)]);

      this.ticketBookingForm.get('firstName').clearValidators();
      this.ticketBookingForm.get('lastName').clearValidators();
      this.ticketBookingForm.get('visitors.code').clearValidators();
      this.ticketBookingForm.get('planetariumShowTiming.code').clearValidators();
      this.ticketBookingForm.get('idType.code').clearValidators();
      this.ticketBookingForm.get('idNumber').clearValidators();
      this.ticketBookingForm.controls['applicantMobile'].setErrors(null);
      this.ticketBookingForm.controls['totalVisitor'].setErrors(null);

      //visitor rate chart
      this.visitorRateChartCall();

    }
    else if (event == 'PLANETARIUM_GENERAL_SHOW') {
      this.ticketBookingForm.get('visitingDate').setValue(moment().format('YYYY-MM-DD'));
      this.minDate = moment(new Date()).add(0, 'day').toISOString();
      this.maxDate = moment(new Date()).add(6, 'day').toISOString();
      let dd = new Date();
      if(dd.getDay()==4){
         let plusDay = moment().add(1, 'day').format("YYYY-MM-DD");
         this.ticketBookingForm.get('visitingDate').setValue(plusDay);
         this.maxDate = moment(new Date()).add(7, 'day').toISOString();
      }
      this.ticketBookingForm.get('firstName').setValidators([Validators.required]);
      this.ticketBookingForm.get('lastName').setValidators([Validators.required]);
      this.ticketBookingForm.get('visitors.code').setValidators([Validators.required]);
      this.ticketBookingForm.get('planetariumShowTiming.code').setValidators([Validators.required]);
      this.ticketBookingForm.get('idType.code').setValidators([Validators.required]);
      this.ticketBookingForm.get('idNumber').setValidators([Validators.required, Validators.maxLength(4), Validators.minLength(4)]);
      this.ticketBookingForm.get('schoolMobileNumber').clearValidators();
      this.ticketBookingForm.get('schoolName').clearValidators();
      this.ticketBookingForm.get('schoolEmailId').clearValidators();
      this.ticketBookingForm.get('specialShowLanguage.code').clearValidators();
      this.ticketBookingForm.get('totalVisitor').clearValidators();
      this.ticketBookingForm.controls['schoolMobileNumber'].setErrors(null);

      //visitor rate chart
      this.visitorRateChartCall();
    }
    else {
      this.ticketBookingForm.reset();
    }
    //this.ticketBookingForm.get('visitingDate').setValue('');
    /* After perform set or remove validator action this will update value and validity */
    this.ticketBookingForm.get('firstName').updateValueAndValidity();
    this.ticketBookingForm.get('lastName').updateValueAndValidity();
    this.ticketBookingForm.get('visitors.code').updateValueAndValidity();
    this.ticketBookingForm.get('planetariumShowTiming.code').updateValueAndValidity();
    this.ticketBookingForm.get('idType.code').updateValueAndValidity();
    this.ticketBookingForm.get('idNumber').updateValueAndValidity();

    this.ticketBookingForm.get('schoolName').updateValueAndValidity();
    this.ticketBookingForm.get('schoolEmailId').updateValueAndValidity();
    this.ticketBookingForm.get('specialShowLanguage.code').updateValueAndValidity();
    this.ticketBookingForm.get('totalVisitor').updateValueAndValidity();

  }

  /**
   * This method for get rate chart data
   */
  visitorRateChartCall() {
    //visitor rate chart
    this.ticketingService.getZooVisitingRates().subscribe((respRates) => {
      this.planetariumVisitingRates = respRates.data;
      if(this.showType=='PLANETARIUM_SPECIAL_SHOW'){
        this.ticketBookingForm.get('rate').setValue(this.planetariumVisitingRates.specialShowVisitorCharge);
      }else{
        this.ticketBookingForm.get('rate').setValue(this.planetariumVisitingRates.visitorCharge);
      }
      // this.ticketBookingForm.get('rate').setValue(this.planetariumVisitingRates.specialShowVisitorCharge);
      this.totalVisitorLimit = this.planetariumVisitingRates.totalOccupancy;
    },
      err => {
        this.commonService.openAlert("Error", err.error[0].message, "warning");
      });
  }

  /**
   * Save form data
   */
  savePlanetariumTickets() {
    if (this.ticketBookingForm.get('visitingDate').value
      && this.ticketBookingForm.get('resourceCodeLK').get('code').value
      && this.ticketBookingForm.get('showCategory').get('code').value == 'PLANETARIUM_SPECIAL_SHOW') {
      this.ticketBookingForm.get('resourceCode').setValue(this.ticketBookingForm.get('resourceCodeLK').get('code').value);
      this.ticketingService.saveDraftTickets(this.ticketBookingForm.getRawValue(), this.ticketBookingForm.get('resourceCodeLK').get('code').value).subscribe(
        resp => {
          this.ticketBookingForm.get('refNumber').setValue(resp.refNumber);
          this.ticketBookingForm.get('bookingFormId').setValue(resp.bookingFormId);
          this.ticketBookingForm.get('id').setValue(resp.id);
        },
        err => {
          this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
        });
    }
  }

  /**
     * Marks all controls in a form group as touched
     * @param formGroup - The form group to touch
     */
  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }


  /**
   * This method submit for varify application at department
   */
  submitForVarification() {


     if (this.ticketBookingForm.get('specialShowLanguage').get('code').value == null
      && this.ticketBookingForm.get('schoolName').value == null
      && this.ticketBookingForm.get('schoolEmailId').value == null
      && this.ticketBookingForm.get('totalVisitor').value == null) {

      this.commonService.openAlert("Field Error", this.ticketingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
      this.markFormGroupTouched(this.ticketBookingForm);
    }else{
      this.isLoadingResults = true;
      this.ticketingService.specialShowTicketsBooking(this.ticketBookingForm.getRawValue(), this.ticketBookingForm.get('resourceCodeLK').get('code').value).subscribe(
        resData => {
          if(resData.statusCode == '401'){
            this.toster.error(resData.message);
            setTimeout(() => {
                this.router.navigate(['/citizen/ticketings/planetarium/book']);
            },6000);
            return;
          }
          this.commonService.commonAlert("Booking", "Planetarium Booking Request", "success", "Print Acknowledgement Receipt", false, '', pA => {
            this.ticketingService.printAcknowledgementReceipt(resData.data.refNumber).subscribe(acknowledgementHTML => {
              let sectionToPrint: any = document.getElementById('sectionToPrint');
              sectionToPrint.innerHTML = acknowledgementHTML;
              setTimeout(() => {
                window.print();
                this.router.navigate([this.ticketingConstants.MY_TICKETINGS_URL]);
              });
            }, err => {
              this.commonService.openAlert("Error", err.error[0].message, "warning")
            })
          }, rA => {
            this.router.navigate([this.ticketingConstants.MY_TICKETINGS_URL]);
          })
          // }
          this.isLoadingResults = false;
        },
        err => {
          this.isLoadingResults = false;
          this.commonService.openAlertFormSaveValidation('Warning!', err.error, 'warning');
        });
    }

    // else {
    //   this.commonService.openAlert('Field Error', this.ticketingConstants.TERMS_AND_CONDITION_MESSAGE, 'warning');
    //   this.markFormGroupTouched(this.ticketBookingForm);
    // }
    this.printFormInvalidControl(this.ticketBookingForm," ");

  }

  /**
   * redirect to Payment
   */
  redirecToPayment() {
    if (!this.ticketBookingForm.get('visitors').get('code').value
      || !this.ticketBookingForm.get('idType').get('code').value
      || !this.ticketBookingForm.get('idNumber').value
      || !this.ticketBookingForm.get('firstName').value
      || !this.ticketBookingForm.get('lastName').value
      || !this.ticketBookingForm.get('planetariumShowTiming').get('code').value
      //|| !this.ticketBookingForm.get('visitingDate').value
      ) {
      this.commonService.openAlert("Field Error", this.ticketingConstants.ALL_FEILD_REQUIRED_MESSAGE, 'warning');
      this.markFormGroupTouched(this.ticketBookingForm);
    }
    else {
      this.isLoadingResults = true;
      this.ticketingService.bookPlanetariumTickets(this.ticketBookingForm.getRawValue(), this.ticketBookingForm.get('resourceCodeLK').get('code').value).subscribe(
        respData => {
        /* Applicant can not booking after 2 P.M. */
          if(respData.statusCode == '401'){
            this.toster.error(respData.message);
            setTimeout(() => {
                this.router.navigate(['/citizen/dashboard']);
            },6000);
            return;
          }
          this.commonService.commonAlert("Booking", "Planetarium Booked Successfully", "success", "Print Acknowledgement Receipt", false, '', pA => {
            this.ticketingService.printAcknowledgementReceipt(respData.data.refNumber).subscribe(
              acknowledgement => {
                let sectionToPrint: any = document.getElementById('sectionToPrint');
                sectionToPrint.innerHTML = acknowledgement;
                setTimeout(() => {
                  window.print();
                  this.router.navigate([this.ticketingConstants.MY_TICKETINGS_URL]);
                });
              }, resErr => {
                this.commonService.openAlert("Error", resErr.error[0].message, "warning")
              })
          }, rA => {
            this.router.navigate([this.ticketingConstants.MY_TICKETINGS_URL]);
          })
          // }
          this.isLoadingResults = false;
        },
        err => {
          if (err.status === 402) {

            this.ticketBookingForm.get('refNumber').setValue(err.error.data.refNumber);
            // this.ticketingUtils.redirectToPayment(err, this.commonService, this.ticketingService, this.ticketBookingForm, this.router);
            this.ticketingUtils.redirectToCCAvenuePayment(err, this.commonService, this.ticketingService, this.paymentGateway, this.ticketBookingForm, this.router);
          }
          else {
            this.commonService.openAlert("Error", err.error[0].message, "warning")
          }
        });
    }
    this.printFormInvalidControl(this.ticketBookingForm," ");

  }


  printFormInvalidControl(form,indent) {
    for (const field in form.controls) { // 'field' is a string
      if (!form.get(field).valid) {
        console.log(indent + field);
        const innerForm =form.get(field) as FormGroup;
        if(innerForm && innerForm.controls ) {
          this.printFormInvalidControl(innerForm, indent + " ");
        }

      }; // 'control' is a FormControl

    }
  }

  selectLanguage(event) {
		this.btnProceed = true
		if (event == 'gu') {
			this.showSelectLanguage = true
		}
		else {
			this.showSelectLanguage = false
		}

	}


  clickProcess(event){
		if(event.checked == true){
        this.btnProceed = false;
	    }else{
	      this.btnProceed = true;
	    }
	  }
}
