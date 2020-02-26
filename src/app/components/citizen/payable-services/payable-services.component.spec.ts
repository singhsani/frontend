import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableServicesComponent } from './payable-services.component';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ControlMessagesComponent } from '../../../shared/components/control-messages/control-messages.component';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { CommonService } from '../../../shared/services/common.service';
import { HttpService } from '../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

 describe('Comopnent : PayableServicesComponent', () => {
  let component: PayableServicesComponent;
  let fixture: ComponentFixture<PayableServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        NgSelectModule],
      declarations: [PayableServicesComponent,
        ControlMessagesComponent,],
      providers: [FormsActionsService,
        CommonService,
        HttpService,
        SessionStorageService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayableServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
