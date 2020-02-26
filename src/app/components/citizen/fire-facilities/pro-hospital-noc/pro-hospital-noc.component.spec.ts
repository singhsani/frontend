import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProHospitalNocComponent } from './pro-hospital-noc.component';

describe('ProHospitalNocComponent', () => {
  let component: ProHospitalNocComponent;
  let fixture: ComponentFixture<ProHospitalNocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProHospitalNocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProHospitalNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
