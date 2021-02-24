import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { Router } from '@angular/router';
import { UpdateService } from './updateService';



@Component({
  selector: 'app-update-email-mobile',
  templateUrl: './update-email-mobile.component.html',
  styleUrls: ['./update-email-mobile.component.scss']
})
export class UpdateEmailMobileComponent implements OnInit {

  updateEmailMobileForm: FormGroup;
  saveEmailMobileForm: FormGroup;

  searchBtn: boolean = false;
  showEdit: boolean = false;
  showEmail: boolean = false;
  showMobile: boolean = false;
  emailOTP: string = null;
  mobileOTP: string = null;
  insertedEmailOTP: any = null;
  insertedMobileOTP: any = null;
  showEditBtn: boolean = false
  showEditEmail: boolean = false;
  showEditMobile: boolean = false;


  constructor(
    private fb: FormBuilder,
    private toster: ToastrService,
    private router: Router,
    private updateService: UpdateService,

  ) { }

  ngOnInit() {
    this.createUpdateEmailMobileForm();
    this.createsaveEmailMobileForm();
  }

  createUpdateEmailMobileForm() {
    this.updateEmailMobileForm = this.fb.group({
      propertyNo: [null, [Validators.required]],
    });
  }

  createsaveEmailMobileForm() {
    this.saveEmailMobileForm = this.fb.group({
      email: [null, [Validators.required]],
      mobile: [null, [Validators.required]],
      optVerifyEmail: [null, [Validators.required]],
      optVerifyMobile: [null, [Validators.required]],

    });
  }

  showBoth() {

    this.showEditEmail = true;
    this.showEditMobile = true;
    this.showEmail = false;
    this.showMobile = false;
  }
  showForEditEmail() {

    this.showEditEmail = true;
    this.showEditMobile = false;
    this.showMobile = false;

  }
  showForEditMobile() {

    this.showEditMobile = true;
    this.showEditEmail = false;
    this.showEmail = false;
  }


  searchByPropertyNo() {

    this.updateService.serchByPropertyno(this.updateEmailMobileForm.get('propertyNo').value).subscribe(resp => {

      // this.showEmail = false;
      // this.showMobile = false;

      this.saveEmailMobileForm.reset();

      if (resp.data != null) {
        this.saveEmailMobileForm.patchValue(resp.data);
        this.showEdit = true;
        //this.searchBtn = true;
        this.showEditBtn = true;
      }

    });
  }
  sendOnEmail() {

    if (this.saveEmailMobileForm.get('email').value) {

      this.updateService.sendOnEmail(this.saveEmailMobileForm.get('email').value).subscribe(resp => {

        // this.showEmail = false;
        if (resp != null) {
          this.emailOTP = resp;
          this.showEmail = true;
        } else {
          this.toster.warning('Please insert valid Email');
        }

      });

    } else {
      this.toster.warning('Please insert Email first');
    }

  }

  verifyEmail() {

    if (this.saveEmailMobileForm.get('optVerifyEmail').valid) {

      this.insertedEmailOTP = this.saveEmailMobileForm.get('optVerifyEmail').value;

      if (this.insertedEmailOTP == this.emailOTP) {

        this.saveEmail();

      } else {
        this.toster.warning('Please insert valid OTP');
      }

    } else {
      this.toster.warning('Please insert OTP first');
    }

  }


  saveEmail() {

    let email = this.saveEmailMobileForm.get('email').value;
    let propertyNo = this.updateEmailMobileForm.get('propertyNo').value;

    this.updateService.saveEmail(propertyNo, email).subscribe(resp => {

      console.log(resp);
      if (resp != null) {
        this.showEmail = false;
        this.toster.success('Successfully Saved');
      }
    });

  }


  sendOnMobile() {

    if (this.saveEmailMobileForm.get('mobile').value) {

      this.updateService.sendOnMobile(this.saveEmailMobileForm.get('mobile').value).subscribe(resp => {

        if (resp != null) {
          this.mobileOTP = resp;
          // this.showEdit = true;
          this.showMobile = true;

        } else {
          this.toster.warning('Please insert valid Mobile Number');
        }
      });
    } else {
      this.toster.warning('Please insert Mobile Number first');
    }

  }

  verifyMobile() {

    if (this.saveEmailMobileForm.get('optVerifyMobile').valid) {

      this.insertedMobileOTP = this.saveEmailMobileForm.get('optVerifyMobile').value;

      if (this.insertedMobileOTP == this.mobileOTP) {

        this.saveMobile();

      } else {
        this.toster.warning('please insert valid OTP');
      }

    } else {
      this.toster.warning('Please insert OTP first');
    }

  }

  saveMobile() {

    let mobile = this.saveEmailMobileForm.get('mobile').value;
    let propertyNo = this.updateEmailMobileForm.get('propertyNo').value;

    this.updateService.saveMobile(propertyNo, mobile).subscribe(resp => {

      console.log(resp);
      if (resp != null) {
        this.showMobile = false;
        this.toster.success('Successfully Saved');
      }

    });

  }

}
