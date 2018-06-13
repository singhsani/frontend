import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandBookingListComponent } from './band-booking-list.component';

describe('BandBookingListComponent', () => {
  let component: BandBookingListComponent;
  let fixture: ComponentFixture<BandBookingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandBookingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
