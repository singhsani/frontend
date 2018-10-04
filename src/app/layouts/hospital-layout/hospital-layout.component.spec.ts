import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { HospitalLayoutComponent } from './hospital-layout.component';
import { MaterialModule } from '../../shared/modules/material/material.module';
import { HosAppService } from '../../core/services/hospital/app-services/hos-app.service';
import { SessionStorageService } from 'angular-web-storage';
import { HosFormActionsService } from '../../core/services/hospital/data-services/hos-form-actions.service';
import { CommonService } from '../../shared/services/common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Layouts : HospitalLayoutComponent', () => {
  let component: HospitalLayoutComponent;
  let fixture: ComponentFixture<HospitalLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule],
      declarations: [HospitalLayoutComponent],
      providers: [HosAppService,
        HosFormActionsService,
        CommonService,
        SessionStorageService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
