import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosLoginLayoutComponent } from './hos-login-layout.component';

describe('HosLoginLayoutComponent', () => {
  let component: HosLoginLayoutComponent;
  let fixture: ComponentFixture<HosLoginLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosLoginLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosLoginLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
