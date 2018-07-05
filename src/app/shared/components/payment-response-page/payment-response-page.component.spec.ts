import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentResponsePageComponent } from './payment-response-page.component';

describe('PaymentResponsePageComponent', () => {
  let component: PaymentResponsePageComponent;
  let fixture: ComponentFixture<PaymentResponsePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentResponsePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentResponsePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
