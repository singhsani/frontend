import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-details-dialog',
  templateUrl: './employee-details-dialog.component.html',
  styleUrls: ['./employee-details-dialog.component.scss']
})
export class EmployeeDetailsDialogComponent {

  commonFormGroup: any;
  translateKey: string = 'shopLicNewScreen';
  shopLicNewForm: FormGroup;

  applicantrelationArray = [];

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.commonFormGroup = data.commonFormGroup;

    this.shopLicNewForm = this.fb.group({
      firstName: [null, Validators.required],
      middleName: [null, Validators.required],
      lastName: [null, Validators.required],
      address: [null, Validators.required],
      relestionship: this.fb.group({
        code: [null]
      }),
      gender: this.fb.group({
        code: [null]
      }),
      age: [null, Validators.required],
      action: ''
    });

  }


}                                                         
