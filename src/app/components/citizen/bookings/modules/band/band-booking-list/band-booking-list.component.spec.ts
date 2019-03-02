import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing'

import { BandBookingListComponent } from './band-booking-list.component';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { AmazingTimePickerService, AmazingTimePickerModule } from 'amazing-time-picker';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../../../../shared/services/common.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Band Booking : BandBookingListComponent', () => {
  let component: BandBookingListComponent;
  let fixture: ComponentFixture<BandBookingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule,
        MaterialModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        AmazingTimePickerModule,
        NgSelectModule],
      declarations: [BandBookingListComponent,
        GujInputTargetDirective,
        GujInputSourceDirective,
        ValidationFieldsDirective,
        TitleBarComponent,
        ControlMessagesComponent],
      providers: [
        AmazingTimePickerService,
        BookingService,
        HttpService,
        SessionStorageService,
        CommonService,
        ToastrService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
