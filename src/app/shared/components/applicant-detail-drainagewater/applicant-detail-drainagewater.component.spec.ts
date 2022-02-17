import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantDetailDrainagewaterComponent } from './applicant-detail-drainagewater.component';

describe('ApplicantDetailDrainagewaterComponent', () => {
  let component: ApplicantDetailDrainagewaterComponent;
  let fixture: ComponentFixture<ApplicantDetailDrainagewaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantDetailDrainagewaterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantDetailDrainagewaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
