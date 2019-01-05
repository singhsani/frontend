import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OTData } from './dialog-data';
@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {
  form: FormGroup;
 formTitle = 'OT Detail'

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) { id, otFacilities, areaInSquareMeterLength,
      areaInSquareMeterBreadth, areaInSquareMeter }: OTData) {

    this.form = fb.group({
      id: [id ? id : null],
      otFacilities: [otFacilities ? otFacilities : null, Validators.required],
      areaInSquareMeterLength: [areaInSquareMeterLength ? areaInSquareMeterLength : null, Validators.required],
      areaInSquareMeterBreadth: [areaInSquareMeterBreadth ? areaInSquareMeterBreadth : null, Validators.required],
      areaInSquareMeter: [areaInSquareMeter ? areaInSquareMeter : null, Validators.required]
    });
  }

  ngOnInit() { 
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close(null);
  }

}
