import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketingFileUploadComponent } from './ticketing-file-upload.component';

describe('TicketingFileUploadComponent', () => {
  let component: TicketingFileUploadComponent;
  let fixture: ComponentFixture<TicketingFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketingFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketingFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
