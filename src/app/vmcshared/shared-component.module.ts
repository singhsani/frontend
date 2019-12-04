import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberOnlyDirective } from './Directives/numberonly.directive';
import { LetterOnlyDirective } from './Directives/letteronly.directive';
import { LetterAndDigitsOnlyDirective } from './Directives/letteranddigitsonly.directive';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatIconModule } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from './Constants';
import { PaymentComponent } from './component/payment/payment.component';
import { ResponseDownloadListComponent } from './component/payment/response.download.list.component';
import { MaterialsComponentModule } from './materials-component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrimDirective } from './Directives/trim.directive';
import { CreateFormulaComponent } from './component/create-formula/create-formula.component';
import { PropertySearchComponent } from './component/property-search/property-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { APP_DATE_FORMATS, CustomeDateAdapter } from './custome-date-adapter';
import { MaskDateDirective } from './Directives/mask-date.directive';
import { MaskCensusNoDirective } from './Directives/mask-censusNo.directive';
import { MaskPropertyNoDirective } from './Directives/mask-propertyNo.directive';
import { DigitsOnlyDirective } from './Directives/digitsOnlyDirective';
import { PropertyOccupierSearchComponent } from './component/property-occupier-search/property-occupier-search.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MaterialsComponentModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    MaskDateDirective,
    NumberOnlyDirective,
    LetterOnlyDirective,
    LetterAndDigitsOnlyDirective,
    DigitsOnlyDirective,
    TrimDirective,
    MaskCensusNoDirective,
    MaskPropertyNoDirective,
    PaymentComponent,
    ResponseDownloadListComponent,
    CreateFormulaComponent,
    PropertySearchComponent,
    PropertyOccupierSearchComponent
  ],
  exports: [
    MaterialsComponentModule,
    NgSelectModule,
    PaymentComponent,
    ResponseDownloadListComponent,
    CreateFormulaComponent,
    PropertySearchComponent,
    PropertyOccupierSearchComponent,
    CommonModule,
    NumberOnlyDirective,
    LetterOnlyDirective,
    LetterAndDigitsOnlyDirective,
    DigitsOnlyDirective,
    TrimDirective,
    MaskDateDirective,
    MaskCensusNoDirective,
    MaskPropertyNoDirective
  ],
  providers: [
   // { provide: MAT_DATE_LOCALE, useValue: 'en' }, //you can change useValue
    // { provide: DateAdapter, useClass: MomentDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }

     { provide: DateAdapter, useClass: CustomeDateAdapter },
     { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],

})
export class SharedComponentModule { }
