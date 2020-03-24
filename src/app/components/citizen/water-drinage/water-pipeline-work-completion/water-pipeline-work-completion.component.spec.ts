import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterPipelineWorkCompletionComponent } from './water-pipeline-work-completion.component';

describe('WaterPipelineWorkCompletionComponent', () => {
  let component: WaterPipelineWorkCompletionComponent;
  let fixture: ComponentFixture<WaterPipelineWorkCompletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterPipelineWorkCompletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterPipelineWorkCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
