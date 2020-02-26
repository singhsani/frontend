import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SessionStorageService } from 'angular-web-storage';

import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//services
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { CommonService } from '../../../../../shared/services/common.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { ValidationService } from '../../../../../shared/services/validation.service';

import { FoodService } from '../common/services/food.service';
import { FoodDuplicateComponent } from './food-duplicate.component';

describe('FoodDuplicateComponent', () => {
  let component: FoodDuplicateComponent;
  let fixture: ComponentFixture<FoodDuplicateComponent>;
  let service: FormsActionsService;
  const createCompo = () => {
    fixture = TestBed.createComponent(FoodDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        NgSelectModule,
        TranslateModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          timeOut: 5000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
          progressBar: true,
          closeButton: true
        })],
      declarations: [
        FoodDuplicateComponent,
        TitleBarComponent,
        FileUploadComponent,
        ActionBarComponent,
        GujInputSourceDirective,
        GujInputTargetDirective,
        ValidationFieldsDirective,
        ControlMessagesComponent],
      providers: [
        CommonService,
        SessionStorageService,
        FormsActionsService,
        HttpService,
        FoodService,
        ValidationService
      ]
    })
      .compileComponents().then(() => {
        createCompo();
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
