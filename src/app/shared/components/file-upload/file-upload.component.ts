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
	canUpload: boolean;
	id: any;
	type: any;

	color = 'primary';
	mode = 'determinate';

	//file and image  upload
	priviewImage: string = null;
	fileName: string = '';
	fromAdmin: boolean = false;

	getFile: string = ""

	@Input() uploadModel: any;

	@Input() form: any;

	attachments: any[];

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
		this.attachments = this.form.get('attachments').value;

		this.disableOrEnableButton();
		this.fromAdmin = this.commonService.fromAdmin();
		
		if (this.attachments && this.form.get('attachments').value.length) {
			this.getFile = this.form.get('attachments').value.find(data => data.fieldIdentifier.toString() === this.uploadModel.fieldIdentifier.toString())
		}
	}

	/**
	 * This method is use for select the file 
	 * @param event - get selected file event
	 */
	selectFile(event) {
		this.selectedFiles = event.target.files;
		let fileType = this.selectedFiles[0].type;
		this.fileName = this.selectedFiles[0].name;
		this.canUpload = true;

		if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg' || fileType === 'image/gif') {
			let reader = new FileReader();
			reader.onload = (e: any) => {
				this.priviewImage = e.target.result;
			}
			reader.readAsDataURL(event.target.files[0]);
		}
		this.upload();

	}

	/**
	 * This method is use for upload attachments on server using API
	 */
	upload() {
		if (!this.selectedFiles) {
			this.commonService.openAlert("Warning", "Please Select File to Upload", "warning");
		} else {
			if (this.selectedFiles[0].size > 5000000) {
				this.fileName = ''
				this.canUpload = false;
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
			this.canUpload = false;
		} else {
			for (let i = 0; i < this.attachments.length; i++) {
				if (this.attachments[i].fieldIdentifier === this.uploadModel.fieldIdentifier.toString()) {
					this.canUpload = true;
					this.id = this.attachments[i].id;
					this.type = this.attachments[i].mimeType;
					return;
				}
			}
			this.canUpload = false;
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

		});
	}

	/**
	 * Method is use to download file.
	 * @param data - Array Buffer data
	 * @param type - type of the document.
	 */
	downLoadFile(data: any, type: string) {
		var blob = new Blob([data], { type: type.toString() });
		var url = window.URL.createObjectURL(blob);
		var pwa = window.open(url);
        if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
            this.commonService.openAlert('Pop-up!', 'Please disable your Pop-up blocker and try again.', 'warning');
        }
	}

	/**
	 * Method is used to delete file using service form id.
	 */
	deleteFile() {
		this.commonService.deleteAlert('Are you sure?', '', 'warning', '', performDelete => {
			this.uploadFileService.deleteFile(this.uploadModel.serviceFormId.toString(), this.id).subscribe(
				(respData: any) => {
					if(respData.body){
						this.commonService.successAlert("File Deleted", this.uploadModel.labelName + " successfully deleted", "success");
						this.canUpload = false;
						this.fileName = '';
						this.getFile = '';
						this.priviewImage = '';
					}
				});
		});
	}

}
