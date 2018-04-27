import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { UploadFileService } from './../../upload-file.service';

@Component({
	selector: 'file-upload',
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

	@ViewChild('fileInput')
	fileInput: any;

	selectedFiles: FileList
	currentFileUpload: File
	progress: { percentage: number } = { percentage: 0 }
	fileData: any;

	color = 'primary';
	mode = 'determinate';

	@Input()
	uploadModel: any;

	constructor(private uploadFileService: UploadFileService) { }

	ngOnInit() { }

	/**
	 * This method is use for select the file 
	 * @param event - get selected file event
	 */
	selectFile(event) {
		this.selectedFiles = event.target.files;
	}

	/**
	 * This method is use for upload attachments on server using API
	 */
	upload() {

		if (!this.selectedFiles) {
			return false;
		}

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
			console.log(successResponse);
			this.currentFileUpload = undefined;
			this.selectedFiles = undefined;
			this.fileInput.nativeElement.value = "";
		});

	}

}
