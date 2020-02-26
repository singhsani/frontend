import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalPondCancellationComponent } from './animal-pond-cancellation.component';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AddressComponent } from '../../../../../shared/components/address/address.component';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';

describe('AnimalPondCancellationComponent', () => {
  let component: AnimalPondCancellationComponent;
  let fixture: ComponentFixture<AnimalPondCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnimalPondCancellationComponent,
        TitleBarComponent,
        ControlMessagesComponent,
        AddressComponent,
        ValidationFieldsDirective,
        GujInputSourceDirective,
        GujInputTargetDirective,
        ActionBarComponent,
        FileUploadComponent
      ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        NgSelectModule,
        MaterialModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          timeOut: 5000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
          progressBar: true,
          closeButton: true
        })
      ],
      providers: [
        ValidationService,
        CommonService,
        HttpService,
        FormsActionsService,
        SessionStorageService,
        ToastrService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalPondCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
