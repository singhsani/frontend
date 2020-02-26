import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFileUploadComponent } from './booking-file-upload.component';

describe('BookingFileUploadComponent', () => {
  let component: BookingFileUploadComponent;
  let fixture: ComponentFixture<BookingFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
