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
          this.toster.error(err.error.error_description);
        })
    }
  }

  onCitizen()
  {
		this.router.navigateByUrl(ManageRoutes.getFullRoute("CITIZENMYAPPS"));
  }


}
