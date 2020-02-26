import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HosPaymentResponsePageComponent } from './hos-payment-response-page.component';
import { MaterialModule } from '../../modules/material/material.module';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';
import { HosHttpService } from '../../services/hos-http.service';
import { SessionStorageService } from 'angular-web-storage';

describe('Shared : HosPaymentResponsePageComponent', () => {
  let component: HosPaymentResponsePageComponent;
  let fixture: ComponentFixture<HosPaymentResponsePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ HosPaymentResponsePageComponent ],
      providers: [HosFormActionsService, SessionStorageService, HosHttpService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosPaymentResponsePageComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
