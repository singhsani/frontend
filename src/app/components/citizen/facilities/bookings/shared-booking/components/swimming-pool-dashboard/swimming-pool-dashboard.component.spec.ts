import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimmingPoolDashboardComponent } from './swimming-pool-dashboard.component';

describe('SwimmingPoolDashboardComponent', () => {
  let component: SwimmingPoolDashboardComponent;
  let fixture: ComponentFixture<SwimmingPoolDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimmingPoolDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimmingPoolDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
