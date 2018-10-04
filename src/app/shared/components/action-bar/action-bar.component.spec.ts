import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from "@angular/router/testing";

import { ActionBarComponent } from './action-bar.component';
import { SessionStorageService } from 'angular-web-storage';
import { ToastrService, ToastrModule } from 'ngx-toastr';

import { FormsActionsService } from './../../../core/services/citizen/data-services/forms-actions.service';
import { TranslateModule } from '../../modules/translate/translate.module';
import { MaterialModule } from '../../modules/material/material.module';
import { HttpService } from '../../services/http.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonService } from '../../services/common.service';

describe('Shared : ActionBarComponent', () => {
  let component: ActionBarComponent;
  let fixture: ComponentFixture<ActionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule],
      declarations: [ActionBarComponent],
      providers: [SessionStorageService,
        CommonService,
        FormsActionsService,
        HttpService,
        ToastrService
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(ActionBarComponent);
      component = fixture.componentInstance;
    })
  }));


  it('should create Action Bar', async() => {
    const step: string = "step1";
    component.step = step;
    const apiType = new FormControl('apiType');
    const form = new FormGroup({ apiType: apiType });
    component.form = form;
    expect(component).toBeTruthy();
  });
});
