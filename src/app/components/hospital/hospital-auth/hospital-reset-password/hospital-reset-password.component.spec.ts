import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalResetPasswordComponent } from './hospital-reset-password.component';

describe('HospitalResetPasswordComponent', () => {
  let component: HospitalResetPasswordComponent;
  let fixture: ComponentFixture<HospitalResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
