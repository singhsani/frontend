import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalLayoutComponent } from './hospital-layout.component';

describe('HospitalLayoutComponent', () => {
  let component: HospitalLayoutComponent;
  let fixture: ComponentFixture<HospitalLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
