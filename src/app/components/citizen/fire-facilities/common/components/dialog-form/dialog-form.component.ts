import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OTData } from './dialog-data';
import { TranslateService } from '../../../../../../shared/modules/translate/translate.service';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {
  form: FormGroup;
  formTitle = 'OT Detail'
  translateKey: string = 'provisionalHospitalNocScreen';

  constructor(
    private fb: FormBuilder,
    private TranslateService: TranslateService,
    private dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) { id, otFacilities, areaInSquareMeterLength,
      areaInSquareMeterBreadth, areaInSquareMeter }: OTData) {

    this.form = fb.group({
      id: [id ? id : null],
      otFacilities: [otFacilities ? otFacilities : null, [Validators.required, Validators.maxLength(150)]],
      areaInSquareMeterLength: [areaInSquareMeterLength ? areaInSquareMeterLength : null, [Validators.required, Validators.maxLength(5)]],
      areaInSquareMeterBreadth: [areaInSquareMeterBreadth ? areaInSquareMeterBreadth : null, [Validators.required, Validators.maxLength(5)]],
      areaInSquareMeter: [areaInSquareMeter ? areaInSquareMeter : null, [Validators.required, , Validators.maxLength(5)]]
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
