import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/vmcshared/data-table/validator.service';

@Injectable()
export class DocumentReferenceValidatorService implements ValidatorService {
  getRowValidator(): FormGroup {
    return new FormGroup({
      'documentTypeLookupId': new FormControl(null, Validators.required),
      'documentNo': new FormControl(null, Validators.required),
      'documentDate': new FormControl(null, Validators.required)      
    });
  }
}
