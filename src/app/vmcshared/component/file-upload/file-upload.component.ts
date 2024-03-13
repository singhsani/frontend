import { Component, OnInit, Input, ViewChild } from '@angular/core';


import { ToastrService } from 'ngx-toastr';
import { UploadFileService } from 'src/app/shared/upload-file.service';

import { TranslateService } from 'src/app/shared/modules/translate/translate.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
	selector: 'file-upload-water-tax',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponentWaterTax implements OnInit {

	@ViewChild('fileInput') fileInput: any;

	@Input() uploadModel: any;
	@Input() form: any;
	/**
	 * File Upload related variables
	 */
	selectedFiles: FileList
	selectedId: string;
	currentFileUpload: File
	progress: { percentage: number } = { percentage: 0 }
	fileData: any;
	canUpload: boolean = true;
	isUploaded: boolean = true;
	id: any;
	type: any;
	docIndex: any;

	color = 'primary';
	mode = 'determinate';

	//file and image  upload
	priviewImage: string = null;
	fileName: string = '';
	fromAdmin: boolean = false;

	getFile: any = "";
	attachments: any[];

	/**
	 *
	 * @param uploadFileService - for common upload file service
	 * @param commonService - common service for alerts
	 */
	constructor(
		private uploadFileService: UploadFileService,
		private commonService: CommonService,
		private TranslateService: TranslateService,
		private tostr: ToastrService
	) { }


	/**
	 * Initialize first component loads.
	 */

	ngOnInit() {

		this.attachments = this.form && this.form ? this.form : [];

		this.disableOrEnableButton();
		this.fromAdmin = this.commonService.fromAdmin();

		if (this.attachments && this.attachments.length > 0) {
			this.getFile = this.form.find(data => data.fieldIdentifier.toString() === this.uploadModel.fieldIdentifier.toString())

		}
	}

	/**
	 * This method is use for select the file
	 * @param event - get selected file event
	 */
	selectFile(event) {
		if (event) {
			this.selectedFiles = event.target.files;
			let fileType = this.selectedFiles[0].type;
			this.fileName = this.selectedFiles[0].name;
			this.canUpload = true;
			if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg' || fileType === 'image/gif' || fileType === 'application/pdf') {
				let reader = new FileReader();
				reader.onload = (e: any) => {
					this.priviewImage = e.target.result;
				}
				reader.readAsDataURL(event.target.files[0]);
				this.upload();
			}
			else {
				this.canUpload = false;
				this.fileName = '';
				this.getFile = '';
				this.priviewImage = '';
				this.commonService.openAlert("Warning", "Uploaded file is not a valid format. Only JPG, PNG, GIF and PDF", "warning");
			}
		}

	}

	/**
	 * This method is use for upload attachments on server using API
	 */
	upload() {
		if (!this.selectedFiles) {
			this.commonService.openAlert("Warning", "Please Select File to Upload", "warning");
		} else {

			if (this.selectedFiles[0].size > Math.floor(this.uploadModel.maxFileSizeInMB * 1000000)) {
				this.fileName = ''
				this.canUpload = false;
				this.fileInput.nativeElement.value = "";
				this.commonService.openAlert("Warning", "File Size should be less than " + this.uploadModel.maxFileSizeInMB + " MB", "warning");
				return;
			} else if (this.selectedFiles[0].size <= 0) {
				this.fileName = ''
				this.canUpload = false;
				this.fileInput.nativeElement.value = "";
				this.commonService.openAlert("Warning", `File must have some contents and size should not be 0 MB `, "warning");
				return;
			} else {
				let formData = new FormData();

				formData.append('fieldIdentifier', this.uploadModel.fieldIdentifier.toString());
				formData.append('labelName', this.uploadModel.documentLabelEn);
				formData.append('formPart', this.uploadModel.formPart);
				formData.append('variableName', this.uploadModel.documentIdentifier);
				formData.append('serviceFormId', this.uploadModel.id.toString());

				this.progress.percentage = 0;
				this.currentFileUpload = this.selectedFiles.item(0);

				formData.append('file', this.currentFileUpload);
				if (this.uploadModel.dmsEnabled) {
					this.uploadFileService.processFileToDMSServer(formData, setProgressBar => {
						this.progress.percentage = setProgressBar;
					}, successres => {
						this.tostr.success(this.uploadModel.labelName ? this.uploadModel.labelName : this.uploadModel.documentLabelEn + " uploaded successfully", "File Uploaded");
						this.canUpload = true;
						this.isUploaded = false;
						this.id = successres.data.id;
						this.type = successres.data.mimeType;
						this.docIndex = successres.data.docIndex;
						this.currentFileUpload = undefined;
						this.selectedFiles = undefined;
						this.fileInput.nativeElement.value = "";
					},failureResponse => {
						this.fileName = ''
						this.canUpload = false;
					});
				}
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
					this.docIndex = this.attachments[i].docIndex;
					return;
				}
			}
			this.canUpload = false;
			return;
		}
	}

	/**
	 * Method is used to view or download the file
	 * @param obj - selected file data
	 */
	view(obj) {
		if (!this.docIndex) {
			this.commonService.openAlert("Warning", `Please save the application first`, "warning");
			return;
		}
		this.uploadFileService.getBase64StringURL((this.uploadModel.id && this.uploadModel.id) ? this.uploadModel.id.toString() : this.uploadModel.id.toString(), this.id, this.docIndex).subscribe(res => {
			this.viewBase64File(res.data);
		});
	}

	/**
	 * This method is used to view base 64 file came from server
	 * @param url - base 64 url
	 */
	viewBase64File(url) {

		/** This code is used to download the file */
		// let a = document.createElement('a
		// a.href = url
		// a.download = url.split('/.pop()
		// document.body.appendChild(a)
		// a.click()
		// document.body.removeChild(a);

		/** This code is used to view the file */
		var iframe = "<iframe allowfullscreen border='0' style='margin:-8px' width='100%' height='100%' src='" + url + "'></iframe>"
		var x = window.open();
		if (!x || x.closed || typeof x.closed == 'undefined') {
			this.commonService.openAlert('Pop-up!', 'Please disable your Pop-up blocker and try again.', 'warning');
			return false;
		}
		x.document.open();
		x.document.write(iframe);
		x.document.close();
	}

	/**
	 * Method is use to download file.
	 * @param data - Array Buffer data
	 * @param type - type of the document.
	 */
	downLoadFile(data: any, type: string) {
		let blob = new Blob([data], { type: type.toString() });
		let url = window.URL.createObjectURL(blob);
		let pwa = window.open(url);
		if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
			this.commonService.openAlert('Pop-up!', 'Please disable your Pop-up blocker and try again.', 'warning');
		}
	}

	/**
	 * Method is used to delete file using service form id.
	 */
	deleteFile() {
		if (this.uploadModel.id) { //for coomon file upload
			this.commonService.deleteAlert('Are you sure?', '', 'warning', '', performDelete => {
				this.uploadFileService.deleteFile(this.uploadModel.id.toString(), this.id).subscribe(
					(respData: any) => {
						if (respData.body) {
							this.tostr.success(this.uploadModel.documentLabelEn + " deleted successfully", "File Deleted");
							this.canUpload = false;
							this.fileName = '';
							this.getFile = '';
							this.priviewImage = '';
							this.isUploaded = true;
						}
					});
			});
		}
	}

}
