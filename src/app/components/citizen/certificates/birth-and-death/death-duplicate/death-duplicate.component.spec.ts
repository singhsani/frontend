import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathDuplicateComponent } from './death-duplicate.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { RecordSearchComponent } from '../record-search/record-search.component';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CommonService } from '../../../../../shared/services/common.service';
import { SessionStorageService } from 'angular-web-storage';

describe('Component : DeathDuplicateComponent', () => {
  let component: DeathDuplicateComponent;
  let fixture: ComponentFixture<DeathDuplicateComponent>;
  const createComponent = () => {
    fixture = TestBed.createComponent(DeathDuplicateComponent);
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
      declarations: [DeathDuplicateComponent, 
        ActionBarComponent,
        RecordSearchComponent,
        ControlMessagesComponent,
        TitleBarComponent], providers: [
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
