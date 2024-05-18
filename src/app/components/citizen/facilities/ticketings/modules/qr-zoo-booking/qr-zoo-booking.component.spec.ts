import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZooBookingComponent } from './zoo-booking.component';

describe('ZooBookingComponent', () => {
  let component: ZooBookingComponent;
  let fixture: ComponentFixture<ZooBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZooBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZooBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
