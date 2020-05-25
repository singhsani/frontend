import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainageReconnectionComponent } from './drainage-reconnection.component';

describe('DrainageReconnectionComponent', () => {
  let component: DrainageReconnectionComponent;
  let fixture: ComponentFixture<DrainageReconnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrainageReconnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrainageReconnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
