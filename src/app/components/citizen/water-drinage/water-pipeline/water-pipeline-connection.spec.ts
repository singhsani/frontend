import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WaterPipelineConnection } from './water-pipeline-connection';

describe('WaterPipelineConnection', () => {
  let component: WaterPipelineConnection;
  let fixture: ComponentFixture<WaterPipelineConnection>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterPipelineConnection ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterPipelineConnection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
