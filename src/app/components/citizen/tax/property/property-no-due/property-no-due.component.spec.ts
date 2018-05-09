import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyNoDueComponent } from './property-no-due.component';

describe('PropertyNoDueComponent', () => {
  let component: PropertyNoDueComponent;
  let fixture: ComponentFixture<PropertyNoDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyNoDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyNoDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
