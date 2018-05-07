import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoBirthRecordComponent } from './no-birth-record.component';

describe('NoBirthRecordComponent', () => {
  let component: NoBirthRecordComponent;
  let fixture: ComponentFixture<NoBirthRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoBirthRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoBirthRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
