import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AffodableService } from '../services/AffordableService';
import { Router, ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { ManageRoutes } from 'src/app/config/routes-conf';

@Component({
  selector: 'app-my-afh-status',
  templateUrl: './my-afh-status.component.html',
  styleUrls: ['./my-afh-status.component.scss']
})
export class MyAfhStatusComponent implements OnInit {

  constructor(private toster: ToastrService,
    private router: Router,
    private affodableService: AffodableService) { }

  applicationStatus: any;
	actionBarKey: string = 'adminActionBar';
  tabIndex: number = 0;
  isFormApproved: boolean = true;
  isShortListed: boolean = true;
  isFinalDraw: boolean = true;
  isAllotmentLetter: boolean = true;
  isGenerateNoc: boolean = true;
  isSaleDeedLetter: boolean = true;
  isFinalPossession: boolean = true;
  isShowValidationlessthen12 :boolean = false
  isShowValidationGreaterThen22 : boolean = false
  ngOnInit() {
  }


  searchApplication(event, refNo) {

    if (event && refNo != "") {
      this.affodableService.getMyAfhStatus(refNo).subscribe(
        (res: any) => {

          this.applicationStatus = res;
          if (res.fileStatus = 'PAYMENT_RECEIVED') {
            this.isFormApproved = false;
          }
          if (res.isShortListed == true) {
            this.isShortListed = false;
          }
          if (res.isFinalDraw == true) {
            this.isFinalDraw = false;
          }
          if (res.isAllotted == true) {
            this.isAllotmentLetter = false;
          }
          if (res.isGenerateNoc == true) {
            this.isGenerateNoc = false;
          }
          if (res.isSaleDeed == true) {
            this.isSaleDeedLetter = false;
          }
          if (res.isFinalPossession == true) {
            this.isFinalPossession = false;
          }
        }, (err: any) => {
          this.toster.error(err.error[0].message);
        })
    }
  }

  onCitizen()
  {
    this.router.navigate(['/citizen/dashboard']);
  }

  getBarAndApplicationNo(event) {
    let countLength = event.target.value.length
    if (countLength < 12) {
      this.isShowValidationGreaterThen22 = false
      this.isShowValidationlessthen12 = true
    } else if (countLength >= 13 && countLength < 22) {
      this.isShowValidationGreaterThen22 = true
      this.isShowValidationlessthen12 = false
    } else {
      this.isShowValidationGreaterThen22 = false
      this.isShowValidationlessthen12 = false
    }
  }


}
