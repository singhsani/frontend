import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcavenuePaymentPageComponent } from './ccavenue-payment-page.component';

describe('CcavenuePaymentPageComponent', () => {
  let component: CcavenuePaymentPageComponent;
  let fixture: ComponentFixture<CcavenuePaymentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcavenuePaymentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcavenuePaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
