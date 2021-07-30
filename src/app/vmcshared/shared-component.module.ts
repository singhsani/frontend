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
import { MaskPropertyNoWithOccuiperCodeDirective } from './Directives/mask-propertyNoWithOccupierCode.directive';
import { DigitsOnlyDirective } from './Directives/digitsOnlyDirective';
import { PropertyOccupierSearchComponent } from './component/property-occupier-search/property-occupier-search.component';
import { VmcTitleBarComponent } from './component/title-bar/title-bar.component';
import { FileUploadComponentWaterTax } from './component/file-upload/file-upload.component';
import { SelectPaymentGatewayPropertyComponent } from './component/select-payment-gateway-property/select-payment-gateway-property.component';
import { TranslateModule } from '../shared/modules/translate/translate.module';



@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MaterialsComponentModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
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
    MaskPropertyNoWithOccuiperCodeDirective,
    PaymentComponent,
    ResponseDownloadListComponent,
    CreateFormulaComponent,
    PropertySearchComponent,
    VmcTitleBarComponent,
    // PropertyOccupierSearchComponent,
    FileUploadComponentWaterTax,
    SelectPaymentGatewayPropertyComponent
  ],
  exports: [
    MaterialsComponentModule,
    NgSelectModule,
    PaymentComponent,
    ResponseDownloadListComponent,
    CreateFormulaComponent,
    PropertySearchComponent,
    VmcTitleBarComponent,
    // PropertyOccupierSearchComponent,
    FileUploadComponentWaterTax,
    SelectPaymentGatewayPropertyComponent,
    CommonModule,
    NumberOnlyDirective,
    LetterOnlyDirective,
    LetterAndDigitsOnlyDirective,
    DigitsOnlyDirective,
    TrimDirective,
    MaskDateDirective,
    MaskCensusNoDirective,
    MaskPropertyNoDirective,
    MaskPropertyNoWithOccuiperCodeDirective,
    TranslateModule
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
