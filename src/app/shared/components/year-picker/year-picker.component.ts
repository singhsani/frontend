import { Component, Input, forwardRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepicker } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
// import { default as _rollupMoment, Moment } from 'moment';
// const moment = _rollupMoment || _moment;

export const YEAR_MODE_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['year-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_MODE_FORMATS },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YearPickerComponent),
      multi: true,
    },
  ],
})
export class YearPickerComponent implements ControlValueAccessor {
  /** Component label */
  formGroup;
  value;
  @Input() label = '';

  constructor(
    private fb: FormBuilder
) {
    this.formGroup = this.fb.group({
        dateControl: [_moment(new Date()).format('YYYY')],
    })
    
}   
  _max: _moment.Moment;
  @Input() get max(): number | Date {
    return this._max ? this._max.year() : undefined;
  }
  set max(max: number | Date) {
    if (max) {
      const momentDate = typeof max === 'number' ? _moment([max, 0, 1]) : _moment(max);
      this._max = momentDate.isValid() ? momentDate : undefined;
    }
  }

  _min: _moment.Moment;
  @Input() get min(): number | Date {
    return this._min ? this._min.year() : undefined;
  }
  set min(min: number | Date) {
    if (min) {
      const momentDate = typeof min === 'number' ? _moment([min, 0, 1]) : _moment(min);
      this._min = momentDate.isValid() ? momentDate : undefined;
    }
  }

  @Input() touchUi = false;

  @ViewChild(MatDatepicker) _picker: MatDatepicker<_moment.Moment>;

  // _inputCtrl: FormControl = new FormControl();

  // Function to call when the date changes.
  onChange = (year: Date) => { };

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  // writeValue(date: Date): void {
  //   if (date && this._isYearEnabled(date.getFullYear())) {
  //     const momentDate = _moment(date);
  //     if (momentDate.isValid()) {
  //       this.formGroup.get('dateControl').setValue(_moment(date), { emitEvent: false });
  //     }
  //   }
  // }
  writeValue(value) {
    this.value = value;
    this.formGroup.get('dateControl').setValue(this.value);
}
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this._picker.disabled = true : this._picker.disabled = false;

    isDisabled ?  this.formGroup.get('dateControl').disable() :  this.formGroup.get('dateControl').enable();
  }

  _yearSelectedHandler(chosenDate: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    if (!this._isYearEnabled(chosenDate.year())) {
      datepicker.close();
      return;
    }

    this.formGroup.get('dateControl').setValue(chosenDate, { emitEvent: false });
    this.onChange(chosenDate.toDate());
    this.onTouched();
    datepicker.close();
  }

  _openDatepickerOnClick(datepicker: MatDatepicker<_moment.Moment>) {
    if (!datepicker.opened) {
      datepicker.open();
    }
  }

  _openDatepickerOnFocus(datepicker: MatDatepicker<_moment.Moment>) {
    setTimeout(() => {
      if (!datepicker.opened) {
        datepicker.open();
      }
    });
  }

  /** Whether the given year is enabled. */
  private _isYearEnabled(year: number) {
    // disable if the year is greater than maxDate lower than minDate
    if (year === undefined || year === null ||
      (this._max && year > this._max.year()) ||
      (this._min && year < this._min.year())) {
      return false;
    }

    return true;
  }

}
