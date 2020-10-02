import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailsBookingComponent } from './bank-details-booking.component';

describe('BankDetailsBookingComponent', () => {
  let component: BankDetailsBookingComponent;
  let fixture: ComponentFixture<BankDetailsBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankDetailsBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailsBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
