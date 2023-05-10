import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import swal from "sweetalert2";


@Injectable({
    providedIn: 'root'
})

export class AlertService {
    private isConfirm = new Subject<any>();

    constructor() { }

    imageUrls(type: string) {
        if (type === 'warning') {
            return "assets/icons/warning.svg";
        } else if (type === 'success') {
            return "assets/icons/done.svg";
        } else if (type === 'info') {
            return "assets/icons/info.svg";
        } else if (type === 'error') {
            return "assets/icons/error.svg";
        } else if (type === 'question') {
            return "assets/icons/question.svg";
        }
    }

    success(message: string, title?: string) {
        title = title ? title : 'Success!';
        swal({
            title: title,
            html: message,
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            imageUrl: this.imageUrls('success'),
            imageClass: 'doneIcon',
            confirmButtonText: 'OK'
        })
    }

    error(message?: string, title?: string) {
        title = title ? title : 'Error!';
        message = message ? message : 'Oops... Something went wrong!<br>Please try again!';
        swal({
            title: title,
            html: message,
            type: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            imageUrl: this.imageUrls('error'),
            imageClass: 'doneIcon',
            confirmButtonText: 'OK'
        })
    }

    warning(message: string, title?: string) {
        title = title ? title : 'Warning!';
        swal({
            title: title,
            html: message,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            imageUrl: this.imageUrls('warning'),
            imageClass: 'doneIcon',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.value) {
                this.isConfirm.next(true);
            }
            else {
                this.isConfirm.next(false);
            }
        })
    }

    info(message: string, title?: string) {
        title = title ? title : 'Info!';
        swal({
            title: title,
            html: message,
            type: 'info',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            imageUrl: this.imageUrls('info'),
            imageClass: 'doneIcon',
            confirmButtonText: 'OK'
        })
    }

    confirm(message?: string, title?: string) {
        title = title ? title : 'Are you sure?';
        swal({
            title: title,
            html: message,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            imageUrl: this.imageUrls('question'),
            imageClass: 'doneIcon',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.value) {
                this.isConfirm.next(true);
            }
            else {
                this.isConfirm.next(false);
            }
        })
    }

    getConfirm(): Observable<any> {
        return this.isConfirm.asObservable();
    }



    propertyConfirm(message?: string, title?: string) {
      //  title = title ? title : 'Do you want to print receipt ? click yes';
          message = "Application submitted successfully and your application number is "+"'"+ message+"'"+". Do you want to print receipt ? click yes ";
        swal({
            title: title,
            html: message,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            imageUrl: this.imageUrls('question'),
            imageClass: 'doneIcon',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.value) {
                this.isConfirm.next(true);
            }
            else {
                this.isConfirm.next(false);
            }
        })
    }


    propertyConfirmForTransfer(message?: string, title?: string) {
        //  title = title ? title : 'Do you want to print receipt ? click yes';
          swal({
              title: title,
              html: message,
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              imageUrl: this.imageUrls('question'),
              imageClass: 'doneIcon',
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
          }).then((result) => {
              if (result.value) {
                  this.isConfirm.next(true);
              }
              else {
                  this.isConfirm.next(false);
              }
          })
      }


      successsAlert(title: string, message: string, type: string ,width?:number,height?:number,imageHeight?:number,imageWidth?:number,padding?:number){

		let options = {
            title:title,
			text: message,
			type: type,
            imageUrl: this.imageUrls(type),
			imageClass: 'doneIcon',
            width:width,
            height:height,
            imageHeight:imageHeight,
            imageWidth:imageWidth,
            padding:padding
        }
        swal(options as any);
      }


}