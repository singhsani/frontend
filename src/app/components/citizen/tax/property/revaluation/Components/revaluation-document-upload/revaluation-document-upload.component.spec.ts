import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevaluationDocumentUploadComponent } from './revaluation-document-upload.component';

describe('RevaluationDocumentUploadComponent', () => {
  let component: RevaluationDocumentUploadComponent;
  let fixture: ComponentFixture<RevaluationDocumentUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevaluationDocumentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevaluationDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
