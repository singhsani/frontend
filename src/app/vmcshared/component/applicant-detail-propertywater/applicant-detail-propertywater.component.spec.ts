import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantDetailPropertywaterComponent } from './applicant-detail-propertywater.component';

describe('ApplicantDetailPropertywaterComponent', () => {
  let component: ApplicantDetailPropertywaterComponent;
  let fixture: ComponentFixture<ApplicantDetailPropertywaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantDetailPropertywaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantDetailPropertywaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
