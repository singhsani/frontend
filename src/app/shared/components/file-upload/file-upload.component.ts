import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { UploadFileService } from './../../upload-file.service';

import { CommonService } from '../../services/common.service';

@Component({
	selector: 'file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

	@ViewChild('fileInput') fileInput: any;

	/**
	 * File Upload related variables
	 */
	selectedFiles: FileList
	selectedId: string;
	currentFileUpload: File
	progress: { percentage: number } = { percentage: 0 }
	fileData: any;
	showButton: boolean = false;
	canDelete: boolean;
	canView: boolean;
	canUpload: boolean;
	id: any;
	type: any;

	color = 'primary';
	mode = 'determinate';

	//file and image  upload
	priviewImage = '#';

	@Input() uploadModel: any;

	@Input() form: any;

	@Input() attachments: any[];

	fileType: string;
	imagetype: boolean = false;
	fromAdmin: boolean = false;	

	/**
	 * 
	 * @param uploadFileService - for common upload file service
	 * @param commonService - common service for alerts
	 */
	constructor(
		private uploadFileService: UploadFileService,
		private commonService: CommonService
	) { }

	/**
	 * Initialize first component loads.
	 */
	ngOnInit() {
		this.disableOrEnableButton();
		this.showButton = true;
		this.fromAdmin = this.commonService.fromAdmin();
	}

	/**
	 * This method is use for select the file 
	 * @param event - get selected file event
	 */
	selectFile(event) {
		this.selectedFiles = event.target.files;
		this.fileType = this.selectedFiles[0].type;

		if (this.fileType === 'image/png' || this.fileType === 'image/jpg' || this.fileType === 'image/jpeg' || this.fileType === 'image/gif') {
			let reader = new FileReader();
			reader.onload = (e: any) => {
				this.priviewImage = e.target.result;
			}
			this.imagetype = true;
			reader.readAsDataURL(event.target.files[0]);
		}
	}

	/**
	 * This method is use for upload attachments on server using API
	 */
	upload() {
		if (!this.selectedFiles) {
			this.commonService.openAlert("Warning", "Please Select File to Upload", "warning");
		} else {
			if(this.selectedFiles[0].size > 5000000){

				this.commonService.openAlert("Warning", "File Size should be less than 5 MB", "warning");
				
			} else {
				let formData = new FormData();

				formData.append('fieldIdentifier', this.uploadModel.fieldIdentifier.toString());
				formData.append('labelName', this.uploadModel.labelName);
				formData.append('formPart', this.uploadModel.formPart.toString());
				formData.append('variableName', this.uploadModel.variableName);
				formData.append('serviceFormId', this.uploadModel.serviceFormId.toString());
				this.progress.percentage = 0;
				this.currentFileUpload = this.selectedFiles.item(0);

				formData.append('file', this.currentFileUpload);

				this.uploadFileService.processFileToServer(formData, setProgressBar => {
					this.progress.percentage = setProgressBar;
				}, successResponse => {
					this.commonService.successAlert("File Uploaded", this.uploadModel.labelName + " successfully uploaded", "success");
					this.canDelete = false;
					this.canView = false;
					this.canUpload = true;
					this.id = successResponse.data.id;
					this.type = successResponse.data.mimeType;
					this.currentFileUpload = undefined;
					this.selectedFiles = undefined;
					this.fileInput.nativeElement.value = "";
				});
				
			}
			
		}
	}

	/**
	 * Method is used to disable or enable button.
	 */
	disableOrEnableButton() {
		if (this.attachments.length == 0) {
			this.canDelete = true;
			this.canUpload = false;
			this.canView = true;
			return;
		} else {
			for (let i = 0; i < this.attachments.length; i++) {
				if ((this.attachments[i].fieldIdentifier === this.uploadModel.fieldIdentifier.toString()) && (this.attachments[i].labelName === this.uploadModel.labelName)) {
					this.canDelete = false;
					this.canUpload = true;
					this.canView = false;
					this.id = this.attachments[i].id;
					this.type = this.attachments[i].mimeType;
					return;
				}
			}
			this.canDelete = true;
			this.canUpload = false;
			this.canView = true;
			return;
		}
	}

	/**
	 * Method is used to view or download the file
	 */
	view() {
		this.uploadFileService.getFileFromServer(this.uploadModel.serviceFormId.toString(), this.id, this.type).subscribe(respData => {
			this.downLoadFile(respData, this.type);
		}, error => {
			
		}
		)
	}

	/**
	 * Method is use to download file.
	 * @param data - Array Buffer data
	 * @param type - type of the document.
	 */
	downLoadFile(data: any, type: string) {
		var blob = new Blob([data], { type: type.toString() });
		var url = window.URL.createObjectURL(blob);
		window.open(url);
	}

	/**
	 * Method is used to delete file using service form id.
	 */
	deleteFile() {
		this.uploadFileService.deleteFile(this.uploadModel.serviceFormId.toString(), this.id).subscribe(respData => {
			this.commonService.successAlert("File Deleted", this.uploadModel.labelName + " successfully deleted", "success");
			this.canDelete = true;
			this.canView = true;
			this.canUpload = false;
			this.imagetype = false;
		})
	}

}
