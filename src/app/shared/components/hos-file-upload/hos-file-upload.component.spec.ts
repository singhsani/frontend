import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosFileUploadComponent } from './hos-file-upload.component';

describe('HosFileUploadComponent', () => {
  let component: HosFileUploadComponent;
  let fixture: ComponentFixture<HosFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
