import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosPaymentResponsePageComponent } from './hos-payment-response-page.component';

describe('HosPaymentResponsePageComponent', () => {
  let component: HosPaymentResponsePageComponent;
  let fixture: ComponentFixture<HosPaymentResponsePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosPaymentResponsePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosPaymentResponsePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
