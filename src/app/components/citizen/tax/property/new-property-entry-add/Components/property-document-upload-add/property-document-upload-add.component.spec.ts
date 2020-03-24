import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDocumentUploadAddComponent } from './property-document-upload-add.component';

describe('PropertyDocumentUploadAddComponent', () => {
  let component: PropertyDocumentUploadAddComponent;
  let fixture: ComponentFixture<PropertyDocumentUploadAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDocumentUploadAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDocumentUploadAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
