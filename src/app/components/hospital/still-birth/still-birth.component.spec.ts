import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StillBirthComponent } from './still-birth.component';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AmazingTimePickerModule, AmazingTimePickerService } from 'amazing-time-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule } from '../../../shared/modules/translate/translate.module';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { CommonService } from '../../../shared/services/common.service';
import { HttpService } from '../../../shared/services/http.service';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { HosTitleBarComponent } from '../../../shared/components/hos-title-bar/hos-title-bar.component';
import { HosFileUploadComponent } from '../../../shared/components/hos-file-upload/hos-file-upload.component';
import { ControlMessagesComponent } from '../../../shared/components/control-messages/control-messages.component';
import { GujInputSourceDirective } from '../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../shared/directives/guj-input-target.directive';
import { ValidationFieldsDirective } from '../../../shared/directives/validation-fields.directive';
import { HosActionBarComponent } from '../../../shared/components/hos-action-bar/hos-action-bar.component';
import { AddressComponent } from '../../../shared/components/address/address.component';

describe('Hospital Module : StillBirthComponent', () => {
  let component: StillBirthComponent;
  let fixture: ComponentFixture<StillBirthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        NgSelectModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        AmazingTimePickerModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        TranslateModule],
      declarations: [StillBirthComponent,
        HosTitleBarComponent,
        HosActionBarComponent,
        AddressComponent,
        HosFileUploadComponent,
        ControlMessagesComponent,
        GujInputSourceDirective,
        GujInputTargetDirective,
        ValidationFieldsDirective],
      providers: [
        HosFormActionsService,
        AmazingTimePickerService,
        CommonService,
        ToastrService,
        HttpService,
        FormsActionsService,
        SessionStorageService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StillBirthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
