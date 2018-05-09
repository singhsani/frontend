import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyNewAssessmentComponent } from './property-new-assessment.component';

describe('PropertyNewAssessmentComponent', () => {
  let component: PropertyNewAssessmentComponent;
  let fixture: ComponentFixture<PropertyNewAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyNewAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyNewAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
