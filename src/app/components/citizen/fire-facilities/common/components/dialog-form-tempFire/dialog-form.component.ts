import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '../../../../../../shared/modules/translate/translate.service';
import { shopData } from './dialog-data-tempFire';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component-tempFire.html',
  styleUrls: ['./dialog-form.component-tempFire.scss']
})
export class DialogFormComponentTempFire implements OnInit {
  form: FormGroup;
  formTitle = 'Shop Details'
  translateKey: string = 'temporaryStructureFireNocScreen';

  constructor(
    private fb: FormBuilder,
    private TranslateService: TranslateService,
    private dialogRef: MatDialogRef<DialogFormComponentTempFire>,
    @Inject(MAT_DIALOG_DATA) { id, shopNo, shopName }: shopData) {

    this.form = fb.group({
      id: [id ? id : null],
      shopNo: [shopNo ? shopNo : null, [Validators.required, Validators.maxLength(150)]],
      shopName: [shopName ? shopName : null, [Validators.required, Validators.maxLength(5)]],
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
