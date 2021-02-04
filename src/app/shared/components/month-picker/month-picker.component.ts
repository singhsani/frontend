import { Component, forwardRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
    selector: 'month-picker',
    templateUrl: './month-picker.component.html',
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AppMonthPicker),
            multi: true
         }
      ]
})
export class AppMonthPicker implements ControlValueAccessor, OnChanges{

    formGroup;
    value;
    onChange: any = () => {
    };
    onTouched: any = () => {};
    disabled = false;
    @Output()
    change = new EventEmitter();

    @Input("min") min : any;
    @Input("max") max : any;

    constructor(
        private fb: FormBuilder
    ) {
        this.formGroup = this.fb.group({
            dateControl: null
        })
        this.formGroup.get('dateControl').disable();
    }   

    ngOnChanges(value) {
        console.log(value);
    }

    writeValue(value) {
        this.value = value;
        this.formGroup.get('dateControl').setValue(this.value);
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    chosenMonthHandler(event, datepicker: MatDatepicker<moment.Moment>) {
        console.log(event);
        // this.dateFormat(event,'applicantBirthDate');
        this.formGroup.get('dateControl').setValue(event);
        this.writeValue(event);
        this.onChange(this.value);
        this.change.emit(this.value);

        if (datepicker)
        datepicker.close();
      }

}