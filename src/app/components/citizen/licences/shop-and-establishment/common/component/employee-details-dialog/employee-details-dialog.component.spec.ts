import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailsDialogComponent } from './employee-details-dialog.component';

describe('EmployeeDetailsDialogComponent', () => {
  let component: EmployeeDetailsDialogComponent;
  let fixture: ComponentFixture<EmployeeDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
