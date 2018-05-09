import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginThroughAdminComponent } from './login-through-admin.component';

describe('LoginThroughAdminComponent', () => {
  let component: LoginThroughAdminComponent;
  let fixture: ComponentFixture<LoginThroughAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginThroughAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginThroughAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
