import { Component, OnInit } from '@angular/core';
import { RenewalPlumberLicenseDataSharingService } from '../../Services/new-plumber-license-data-sharing.service';

@Component({
    selector: 'app-renewal-plumber-license',
    templateUrl: './renewal-plumber-license.component.html'
})

export class RenewalPlumberLicenseComponent implements OnInit {
   
    isShowForm: boolean = true;
    isShowApproval: boolean = false;
    constructor(
        private renewalPlumberLicenseDataSharingService: RenewalPlumberLicenseDataSharingService) { }

    ngOnInit() {        
        this.renewalPlumberLicenseDataSharingService.getIsShowForm().subscribe(data => {
            this.isShowForm = data;
        });
        this.renewalPlumberLicenseDataSharingService.getIsShowApproval().subscribe(data => {
            this.isShowApproval = data;
        });
        this.renewalPlumberLicenseDataSharingService.setIsShowForm(true);
       
    }
}