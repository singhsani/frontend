import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDocumentUploadComponent } from './transfer-document-upload.component';

describe('TransferDocumentUploadComponent', () => {
  let component: TransferDocumentUploadComponent;
  let fixture: ComponentFixture<TransferDocumentUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferDocumentUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
