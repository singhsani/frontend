import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { HosUploadFileService } from '../../hos-upload-file.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '../../modules/translate/translate.service';

@Component({
	selector: 'app-hos-file-upload',
	templateUrl: './hos-file-upload.component.html',
	styleUrls: ['./hos-file-upload.component.scss']
})
export class HosFileUploadComponent implements OnInit {

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
	canUpload: boolean;
	id: any;
	type: any;

	color = 'primary';
	mode = 'determinate';

	//file and image  upload
	priviewImage: string = null;
	fileName: string = '';
	fromAdmin: boolean = false;

	getFile: any = "";
	attachments: any[];
	docIndex: any;

	/**
	 * 
	 * @param uploadFileService - for common upload file service
	 * @param commonService - common service for alerts
	 */
	constructor(
		private uploadFileService: HosUploadFileService,
		private commonService: CommonService,
		private TranslateService: TranslateService,
		private tostr: ToastrService
	) { }


	/**
	 * Initialize first component loads.
	 */

	ngOnInit() {
		this.attachments = (this.form.get('attachments') && this.form.get('attachments').value) ? this.form.get('attachments').value : [];

		this.disableOrEnableButton();
		this.fromAdmin = this.commonService.fromAdmin();

		if (this.attachments && this.attachments.length > 0) {
			this.getFile = this.form.get('attachments').value.find(data => data.fieldIdentifier.toString() === this.uploadModel.fieldIdentifier.toString())
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

			if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg' || fileType === 'image/gif') {
				let reader = new FileReader();
				reader.onload = (e: any) => {
					this.priviewImage = e.target.result;
				}
				reader.readAsDataURL(event.target.files[0]);
			}
			this.upload();
		}

	}

	/**
	 * This method is use for upload attachments on server using API
	 */
	upload() {

		/*if (!this.selectedFiles) {
			this.commonService.openAlert("Warning", "Please Select File to Upload", "warning");
		} else {

			if (this.selectedFiles[0].size > Math.floor(this.uploadModel.maxFileSizeInMB * 1000000)) {
				this.fileName = ''
				this.canUpload = false;
				this.commonService.openAlert("Warning", "File Size should be less than " + this.uploadModel.maxFileSizeInMB + " MB", "warning");

			} else {
				let formData = new FormData();

				formData.append('fieldIdentifier', this.uploadModel.fieldIdentifier.toString());
				formData.append('labelName', this.uploadModel.documentLabelEn);
				formData.append('formPart', this.uploadModel.formPart);
				formData.append('variableName', this.uploadModel.documentIdentifier);
				formData.append('serviceFormId', this.form.get('serviceFormId').value.toString());

				this.progress.percentage = 0;
				this.currentFileUpload = this.selectedFiles.item(0);

				formData.append('file', this.currentFileUpload);

				this.uploadFileService.processFileToServer(formData, setProgressBar => {
					this.progress.percentage = setProgressBar;
				}, successResponse => {
					this.commonService.successAlert("File Uploaded", this.TranslateService.getCurrentLanguage()=='en'? this.uploadModel.documentLabelEn : this.uploadModel.documentLabelGuj  + " successfully uploaded", "success");
					this.canUpload = true;
					this.id = successResponse.data.id;
					this.type = successResponse.data.mimeType;
					this.currentFileUpload = undefined;
					this.selectedFiles = undefined;
					this.fileInput.nativeElement.value = "";
				});
			}
		}*/

		if (this.uploadModel.serviceFormId) { //for coomon file upload

			if (!this.selectedFiles) {
				this.commonService.openAlert("Warning", "Please Select File to Upload", "warning");
			} else {
				let fileTypes: string[] = ['application/pdf', 'image/jpg', 'image/jpeg'];

				let size = this.uploadModel.maxFileSizeInMB ? Math.floor(this.uploadModel.maxFileSizeInMB * 1000000) : 5000000;
				if (this.selectedFiles[0].size > size) {
					this.fileName = ''
					this.canUpload = false;
					this.commonService.openAlert("Warning", `File Size should be less than ${this.uploadModel.maxFileSizeInMB ? this.uploadModel.maxFileSizeInMB : 5} MB`, "warning");
					return;
				} else if (this.selectedFiles[0].size <= 0) {
					this.fileName = ''
					this.canUpload = false;
					this.commonService.openAlert("Warning", `File must have some contents and size should not be 0 MB `, "warning");
					return;
				} else if (!fileTypes.includes(this.selectedFiles[0].type)) {
					this.fileName = ''
					this.canUpload = false;
					this.commonService.openAlert("Warning", `File Type "${this.selectedFiles[0].type}" not valid, please select pdf/jpg/jpeg`, 'warning');
				} else {
					let formData = new FormData();

					formData.append('fieldIdentifier', this.uploadModel.fieldIdentifier.toString());
					formData.append('labelName', this.uploadModel.labelName ? this.uploadModel.labelName : this.uploadModel.documentLabelEn);
					formData.append('formPart', this.uploadModel.formPart.toString());
					formData.append('variableName', this.uploadModel.variableName ? this.uploadModel.variableName : this.uploadModel.documentIdentifier);
					formData.append('serviceFormId', this.uploadModel.serviceFormId.toString());

					this.progress.percentage = 0;
					this.currentFileUpload = this.selectedFiles.item(0);

					formData.append('file', this.currentFileUpload);
					if (this.uploadModel.dmsEnabled) {
						this.uploadFileService.processFileToDMSServer(formData, setProgressBar => {
							this.progress.percentage = setProgressBar;
						}, successRes => {
							this.tostr.success(this.uploadModel.labelName ? this.uploadModel.labelName : this.uploadModel.documentLabelEn + " successfully uploaded", "File Uploaded");
							this.canUpload = true;
							this.id = successRes.data.id;
							this.type = successRes.data.mimeType;
							this.docIndex = successRes.data.docIndex;
							this.currentFileUpload = undefined;
							this.selectedFiles = undefined;
							this.fileInput.nativeElement.value = "";
						},failureResponse => {
							this.fileName = '';
							this.canUpload = false;
						});
					}
					else {
						this.uploadFileService.processFileToServer(formData, setProgressBar => {
							this.progress.percentage = setProgressBar;
						}, successResponse => {
							this.tostr.success(this.uploadModel.labelName ? this.uploadModel.labelName : this.uploadModel.documentLabelEn + " successfully uploaded", "File Uploaded");
							this.canUpload = true;
							this.id = successResponse.data.id;
							this.type = successResponse.data.mimeType;
							this.docIndex = successResponse.data.docIndex;
							this.currentFileUpload = undefined;
							this.selectedFiles = undefined;
							this.fileInput.nativeElement.value = "";
						},failureResponse => {
							this.fileName = '';
							this.canUpload = false;
						});
					}
				}
			}
		} else {
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
					formData.append('serviceFormId', this.form.get('serviceFormId').value.toString());

					this.progress.percentage = 0;
					this.currentFileUpload = this.selectedFiles.item(0);

					formData.append('file', this.currentFileUpload);
					if (this.uploadModel.dmsEnabled) {
						this.uploadFileService.processFileToDMSServer(formData, setProgressBar => {
							this.progress.percentage = setProgressBar;
						}, successRes => {
							this.tostr.success(this.uploadModel.labelName ? this.uploadModel.labelName : this.uploadModel.documentLabelEn + " successfully uploaded", "File Uploaded");
							this.canUpload = true;
							this.id = successRes.data.id;
							this.type = successRes.data.mimeType;
							this.docIndex = successRes.data.docIndex;
							this.currentFileUpload = undefined;
							this.selectedFiles = undefined;
							this.fileInput.nativeElement.value = "";
						},failureResponse => {
							this.fileName = '';
							this.canUpload = false;
						});
					} else {
						this.uploadFileService.processFileToServer(formData, setProgressBar => {
							this.progress.percentage = setProgressBar;
						}, response => {
							this.tostr.success(this.TranslateService.getCurrentLanguage() == 'en' ? this.uploadModel.documentLabelEn : this.uploadModel.documentLabelGuj + " successfully uploaded", "File Uploaded");
							// this.commonService.successAlert("File Uploaded", this.TranslateService.getCurrentLanguage() == 'en' ? this.uploadModel.documentLabelEn : this.uploadModel.documentLabelGuj + " successfully uploaded", "success");
							this.canUpload = true;
							this.id = response.data.id;
							this.type = response.data.mimeType;
							this.docIndex = response.data.docIndex;
							this.currentFileUpload = undefined;
							this.selectedFiles = undefined;
							this.fileInput.nativeElement.value = "";
						},failureResponse => {
							this.fileName = '';
							this.canUpload = false;
						});
					}
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
		// if (this.uploadModel.serviceFormId) { 
		// 	this.uploadFileService.getFileFromServer(this.uploadModel.serviceFormId.toString(), this.id, this.type).subscribe(respData => {
		// 		this.downLoadFile(respData, this.type);
		// 	}, error => {

		// 	});
		// } else {
		// 	this.uploadFileService.getFileFromServer(this.form.get('serviceFormId').value.toString(), this.id, this.type).subscribe(respData => {
		// 		this.downLoadFile(respData, this.type);
		// 	}, error => {

		// 	});
		// }

		if (this.uploadModel.dmsEnabled) {
			if (obj && this.uploadModel.serviceFormId) {
				this.uploadFileService.getBase64StringURL(this.uploadModel.serviceFormId.toString(), obj.id, obj.docIndex).subscribe(res => {
					this.viewBase64File(res.data);
				});
			} else {
				if (!this.docIndex) {
					this.commonService.openAlert("Warning", `Please save the application first`, "warning");
					return;
				}
				this.uploadFileService.getBase64StringURL((this.form.get('serviceFormId') && this.form.get('serviceFormId').value) ? this.form.get('serviceFormId').value.toString() : this.uploadModel.serviceFormId.toString(), this.id, this.docIndex).subscribe(res => {
					this.viewBase64File(res.data);
				});
			}
		} else {
			if (this.uploadModel.serviceFormId) { //for common file upload
				this.uploadFileService.getFileFromServer(this.uploadModel.serviceFormId.toString(), this.id, this.type).subscribe(respData => {
					this.downLoadFile(respData, this.type);
				}, error => {

				});
			} else {
				this.uploadFileService.getFileFromServer((this.form.get('serviceFormId') && this.form.get('serviceFormId').value) ? this.form.get('serviceFormId').value.toString() : this.uploadModel.serviceFormId.toString(), this.id, this.type).subscribe(respData => {
					this.downLoadFile(respData, this.type);
				}, error => {

				});
			}
		}

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
	 * This method is used to view base 64 file came from server
	 * @param url - base 64 url
	 */
	viewBase64File(url) {

		/** This code is used to download the file */
		// let a = document.createElement('a')
		// a.href = url
		// a.download = url.split('/').pop()
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
	 * Method is used to delete file using service form id.
	 */
	deleteFile() {
		if (this.uploadModel.serviceFormId) { //for coomon file upload
			this.commonService.deleteAlert('Are you sure?', '', 'warning', '', performDelete => {
				this.uploadFileService.deleteFile(this.uploadModel.serviceFormId.toString(), this.id).subscribe(
					(respData: any) => {
						if (respData.body) {
							this.tostr.success(this.uploadModel.labelName + " successfully deleted", "File Deleted");
							this.canUpload = false;
							this.fileName = '';
							this.getFile = '';
							this.priviewImage = '';
						}
					});
			});
		} else {
			this.commonService.deleteAlert('Are you sure?', '', 'warning', '', performDelete => {
				this.uploadFileService.deleteFile(this.form.get('serviceFormId').value.toString(), this.id).subscribe(
					(respData: any) => {
						if (respData.body) {
							this.commonService.successAlert("File Deleted", this.uploadModel.documentLabelEn + " successfully deleted", "success");
							this.canUpload = false;
							this.fileName = '';
							this.getFile = '';
							this.priviewImage = '';
						}
					});
			});
		}
	}

}
