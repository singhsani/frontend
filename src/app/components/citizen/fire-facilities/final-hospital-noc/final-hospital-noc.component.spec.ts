import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalHospitalNocComponent } from './final-hospital-noc.component';

describe('FinalHospitalNocComponent', () => {
  let component: FinalHospitalNocComponent;
  let fixture: ComponentFixture<FinalHospitalNocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalHospitalNocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalHospitalNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
