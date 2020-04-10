import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainagePipelineWorkCompletionComponent } from './drainage-pipeline-work-completion.component';

describe('DrainagePipelineWorkCompletionComponent', () => {
  let component: DrainagePipelineWorkCompletionComponent;
  let fixture: ComponentFixture<DrainagePipelineWorkCompletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrainagePipelineWorkCompletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrainagePipelineWorkCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
