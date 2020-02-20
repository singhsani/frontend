import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainagePipelineConnectionComponent } from './drainage-pipeline-connection.component';

describe('DrainagePipelineConnectionComponent', () => {
  let component: DrainagePipelineConnectionComponent;
  let fixture: ComponentFixture<DrainagePipelineConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrainagePipelineConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrainagePipelineConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
