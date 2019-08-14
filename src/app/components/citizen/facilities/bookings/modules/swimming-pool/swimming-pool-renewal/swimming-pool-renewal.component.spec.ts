import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimmingPoolRenewalComponent } from './swimming-pool-renewal.component';

describe('SwimmingPoolRenewalComponent', () => {
  let component: SwimmingPoolRenewalComponent;
  let fixture: ComponentFixture<SwimmingPoolRenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimmingPoolRenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimmingPoolRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
