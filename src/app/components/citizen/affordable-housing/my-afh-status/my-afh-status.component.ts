import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AffodableService } from '../services/AffordableService';

@Component({
  selector: 'app-my-afh-status',
  templateUrl: './my-afh-status.component.html',
  styleUrls: ['./my-afh-status.component.scss']
})
export class MyAfhStatusComponent implements OnInit {

  constructor(private toster: ToastrService,
    private affodableService: AffodableService) { }

  applicationStatus: any;

  ngOnInit() {
  }


  searchApplication(event, refNo) {

    if (event && refNo != "") {
      this.affodableService.getMyAfhStatus(refNo).subscribe(
        (res: any) => {

          this.applicationStatus = res;

        }, (err: any) => {
          this.toster.error(err.error.error_description);
        })
    }
  }


}
