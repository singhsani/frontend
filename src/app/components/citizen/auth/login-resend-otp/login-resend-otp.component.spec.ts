import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginResendOTPComponent } from './login-resend-otp.component';

describe('LoginResendOTPComponent', () => {
  let component: LoginResendOTPComponent;
  let fixture: ComponentFixture<LoginResendOTPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginResendOTPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginResendOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
