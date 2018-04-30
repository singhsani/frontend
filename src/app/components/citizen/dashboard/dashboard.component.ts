import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileService } from '../../../shared/upload-file.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	/**
	 * file upload related declaration
	 */

	selectedFiles: FileList
	currentFileUpload: File
	progress: { percentage: number } = { percentage: 0 }
	fileData: any;

	/**
	 * Constructor to declare defualt propeties of class
	 * @param formService - Declare form service property
	 * @param paginationService - Declare pagination service property
	 * @param router - Declare router property
	 */
	constructor(
		private router: Router,
		private formService: FormsActionsService,
		private uploadFileService: UploadFileService
	) {}

	ngOnInit() {

	}

	/**
	 * This method is use to create new record for citizen
	 */
	createRecord(apiType: string, routeType:string) {
		this.formService.apiType = apiType;
		this.formService.createFormData().subscribe(res => {
			let redirectUrl = 'citizen/'+routeType + apiType;
			this.router.navigate([redirectUrl, res.serviceFormId]);
		});
	}

	selectFile(event) {
		this.selectedFiles = event.target.files;
	}

	upload() {

		let formData = new FormData();

		formData.append('fieldIdentifier', '1');
		formData.append('labelName', 'test');
		formData.append('formPart', '2');
		formData.append('variableName', 'test');
		formData.append('serviceFormId', '2');
		
		this.progress.percentage = 0;
		
		this.currentFileUpload = this.selectedFiles.item(0);
		
		formData.append('file', this.currentFileUpload);
		
		this.uploadFileService.processFileToServer(formData, setProgressBar => {
			this.progress.percentage = setProgressBar;
		}, successResponse => {
			console.log(successResponse);
		});

		this.selectedFiles = undefined;
	}

}