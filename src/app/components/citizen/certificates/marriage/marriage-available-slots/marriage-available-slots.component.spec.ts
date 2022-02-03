import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageAvailableSlotsComponent } from './marriage-available-slots.component';

describe('MarriageAvailableSlotsComponent', () => {
  let component: MarriageAvailableSlotsComponent;
  let fixture: ComponentFixture<MarriageAvailableSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarriageAvailableSlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarriageAvailableSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
