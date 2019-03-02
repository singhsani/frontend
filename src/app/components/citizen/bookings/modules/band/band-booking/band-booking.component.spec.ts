import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandBookingComponent } from './band-booking.component';

xdescribe('Band Booking : BandBookingComponent', () => {
  let component: BandBookingComponent;
  let fixture: ComponentFixture<BandBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
