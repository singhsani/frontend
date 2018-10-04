import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';


import { NoBirthRecordComponent } from './no-birth-record.component';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { AddressComponent } from '../../../../../shared/components/address/address.component';
import { BasicDetailsComponent } from '../../../../../shared/components/basic-details/basic-details.component';
import { RecordSearchComponent } from '../record-search/record-search.component';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../../../../shared/services/http.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('Component : NoBirthRecordComponent', () => {
  let component: NoBirthRecordComponent;
  let fixture: ComponentFixture<NoBirthRecordComponent>;

  const createComponent = () => {
    fixture = TestBed.createComponent(NoBirthRecordComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        TranslateModule,
        NgSelectModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule],
      declarations: [NoBirthRecordComponent,
        TitleBarComponent,
        ControlMessagesComponent,
        FileUploadComponent,
        ActionBarComponent,
        AddressComponent,
        GujInputSourceDirective,
        GujInputTargetDirective,
        ValidationFieldsDirective,
        RecordSearchComponent,
        BasicDetailsComponent],
      providers: [
        Location,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        SessionStorageService,
        HttpService,
        FormsActionsService,
        CommonService,
        ToastrService
      ]
    }).compileComponents().then(() => {
      createComponent();
    });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
