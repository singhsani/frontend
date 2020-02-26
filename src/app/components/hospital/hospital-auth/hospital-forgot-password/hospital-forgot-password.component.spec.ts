import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalForgotPasswordComponent } from './hospital-forgot-password.component';

describe('HospitalForgotPasswordComponent', () => {
  let component: HospitalForgotPasswordComponent;
  let fixture: ComponentFixture<HospitalForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalForgotPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
