import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPaymentGatewayComponent } from './select-payment-gateway.component';

describe('SelectPaymentGatewayComponent', () => {
  let component: SelectPaymentGatewayComponent;
  let fixture: ComponentFixture<SelectPaymentGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPaymentGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPaymentGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
