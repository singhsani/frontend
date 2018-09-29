import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { HosMyApplicationsComponent } from './hos-my-applications.component';
import { MaterialModule } from '../../../shared/modules/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../../shared/services/common.service';
import { BsModalService, ModalModule } from 'ngx-bootstrap';

describe('Hospital Module : HosMyApplicationsComponent', () => {
  let component: HosMyApplicationsComponent;
  let fixture: ComponentFixture<HosMyApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ModalModule.forRoot()
      ],
      declarations: [HosMyApplicationsComponent],
      providers: [HosFormActionsService,
        SessionStorageService,
        CommonService,
        BsModalService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosMyApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
