
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { UploadFileService } from 'src/app/shared/upload-file.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { TicketingConstants } from '../../../config/ticketing-config';

@Component({
  selector: 'ticketing-file-upload',
  templateUrl: './ticketing-file-upload.component.html',
  styleUrls: ['./ticketing-file-upload.component.scss']
})
export class TicketingFileUploadComponent implements OnInit {

  @ViewChild('fileInput') fileInput: any;
  @Input() uploadModel: any;
  @Input() form: any;
  @Output() uploaded: EventEmitter<any> = new EventEmitter<any>()

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
  getFile: any = null
  attachments: any[];
  ticketingConstants = TicketingConstants;

	/**
	 *
	 * @param uploadFileService - for common upload file service
	 * @param commonService - common service for alerts
	 */
  constructor(
    private uploadFileService: UploadFileService,
    private commonService: CommonService,
    private tostr: ToastrService
  ) {
    this.uploadFileService.uploadFileUrl = this.ticketingConstants.TICKETING_FILE_UPLOAD_URL;
  }

	/**
	 * Initialize first component loads.
	 */
  ngOnInit() { }

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
    if (!this.selectedFiles) {
      this.commonService.openAlert("Warning", "Please Select File to Upload", "warning");
    } else {
      let fileTypes: string[] = ['application/pdf', 'image/jpg', 'image/jpeg'];
      let size = this.uploadModel.maxFileSizeInMB ? Math.floor(this.uploadModel.maxFileSizeInMB * 1000000) : 5000000;
      if (this.selectedFiles[0].size > size) {
        this.fileName = ''
        this.uploaded.emit(false);
        this.canUpload = false;
        this.commonService.openAlert("Warning", `File Size should be less than ${this.uploadModel.maxFileSizeInMB ? this.uploadModel.maxFileSizeInMB : 5} MB`, "warning");
        this.fileInput.nativeElement.value = "";
        return;
      } else if (this.selectedFiles[0].size <= 0) {
        this.fileName = ''
        this.uploaded.emit(false);
        this.canUpload = false;
        this.commonService.openAlert("Warning", `File must have some contents and size should not be 0 MB `, "warning");
        this.fileInput.nativeElement.value = "";
        return;
      } else if (!fileTypes.includes(this.selectedFiles[0].type)) {
        this.fileName = ''
        this.uploaded.emit(false);
        this.canUpload = false;
        this.commonService.openAlert("Warning", `File Type "${this.selectedFiles[0].type}" not valid, please select pdf/jpg/jpeg`, 'warning');
        this.fileInput.nativeElement.value = "";
        return;
      } else {
        let formData = new FormData();
        formData.append('fieldIdentifier', this.uploadModel.fieldIdentifier.toString());
        formData.append('labelName', this.uploadModel.labelName.toString());
        formData.append('formPart', this.uploadModel.formPart.toString());
        formData.append('refNumber', this.uploadModel.refNumber.toString());
        formData.append('variableName', this.uploadModel.variableName.toString());
        this.progress.percentage = 0;
        this.currentFileUpload = this.selectedFiles.item(0);
        formData.append('file', this.currentFileUpload);
        if(this.uploadModel.dmsUpload){
          formData.append('serviceFormId', this.uploadModel.bookingFormId);
          this.uploadFileService.processFileToDMSServerBooking(formData, setProgressBar => {
              this.progress.percentage = setProgressBar;
          }, successResponse => {
              //this.tostr.success(this.uploadModel.labelName + " successfully uploaded", "File Uploaded");
              this.tostr.success("Your file uploaded successfully");
              this.canUpload = true;
              this.id = successResponse.data.id;
              this.type = successResponse.data.mimeType;
              this.currentFileUpload = undefined;
              this.selectedFiles = undefined;
              this.fileInput.nativeElement.value = "";
              this.uploaded.emit(true);
          },failureResponse => {
            this.fileName = ''
            this.uploaded.emit(false);
            this.canUpload = false;
        });
      }else{
        this.uploadFileService.processFileToServer(formData, setProgressBar => {
          this.progress.percentage = setProgressBar;
        }, successResponse => {
          //this.tostr.success(this.uploadModel.labelName + " successfully uploaded", "File Uploaded");
          this.tostr.success("Your file uploaded successfully");
          this.canUpload = true;
          this.id = successResponse.data.id;
          this.type = successResponse.data.mimeType;
          this.currentFileUpload = undefined;
          this.selectedFiles = undefined;
          this.fileInput.nativeElement.value = "";
          this.uploaded.emit(true);
        },failureResponse => {
          this.fileName = ''
          this.uploaded.emit(false);
          this.canUpload = false;
      });
      }

      }
    }
  }

	/**
	 * Method is used to view or download the file
	 */
  view() {
    this.uploadFileService.getFileFromServiceForBookings(this.uploadModel.refNumber.toString(), this.id).subscribe(respData => {
      this.downLoadFile(respData, this.type);
    }, error => {
      this.commonService.openAlert("Error", "Error While Loading File", "warning");
      return;
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
    if (this.uploadModel.refNumber) { //for common file upload
      this.commonService.deleteAlert('Are you sure?', '', 'warning', '', performDelete => {
        this.uploadFileService.deleteFileFromServiceForBookings(this.uploadModel.refNumber.toString(), this.id).subscribe(
          (respData: any) => {
            if (respData.body) {
              this.tostr.success("Your file deleted successfully");
              this.canUpload = false;
              this.fileName = '';
              this.getFile = '';
              this.priviewImage = '';
              this.uploaded.emit(false);
            }
          });
      });
    } else {
      this.commonService.successAlert("", this.uploadModel.documentLabelEn + " file is not found", "warning");
    }
  }
}
