import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainageDisconnectionComponent } from './drainage-disconnection.component';

describe('DrainageDisconnectionComponent', () => {
  let component: DrainageDisconnectionComponent;
  let fixture: ComponentFixture<DrainageDisconnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrainageDisconnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrainageDisconnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
