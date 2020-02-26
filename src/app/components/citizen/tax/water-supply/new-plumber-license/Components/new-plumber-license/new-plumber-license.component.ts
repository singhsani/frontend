import { Component, OnInit } from '@angular/core';
import { NewPlumberLicenseDataSharingService } from '../../Services/new-plumber-license-data-sharing.service';



@Component({
    selector: 'app-new-plumber-license',
    templateUrl: './new-plumber-license.component.html'
})

export class NewPlumberLicenseComponent implements OnInit {

    isShowForm: boolean = true;
    isShowApproval: boolean = false;
    constructor(
        private newPlumberLicenseDataSharingService: NewPlumberLicenseDataSharingService) { }

    ngOnInit() {        
        this.newPlumberLicenseDataSharingService.getIsShowForm().subscribe(data => {
            this.isShowForm = data;
        });
        this.newPlumberLicenseDataSharingService.getIsShowApproval().subscribe(data => {
            this.isShowApproval = data;
        });
        this.newPlumberLicenseDataSharingService.setIsShowForm(true);
    }
}