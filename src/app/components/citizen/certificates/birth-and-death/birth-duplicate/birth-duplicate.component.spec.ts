import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { BirthDuplicateComponent } from './birth-duplicate.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { RecordSearchComponent } from '../record-search/record-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonService } from '../../../../../shared/services/common.service';
import { SessionStorageService } from 'angular-web-storage';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('Component : BirthDuplicateComponent', () => {
  let component: BirthDuplicateComponent;
  let fixture: ComponentFixture<BirthDuplicateComponent>;

  const createComponent = () => {
    fixture = TestBed.createComponent(BirthDuplicateComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule,
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgSelectModule,
        ToastrModule.forRoot(),
        MaterialModule],
      declarations: [BirthDuplicateComponent,
        ActionBarComponent,
        RecordSearchComponent,
        ControlMessagesComponent,
        TitleBarComponent],
      providers: [
        FormsActionsService,
        ToastrService,
        HttpService,
        Location,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CommonService,
        SessionStorageService]
    })
      .compileComponents().then(() => {
        createComponent();
      });
  }));


  it('should create',inject([Location], (location: Location) => {
    expect(component).toBeTruthy();
  }));
});
