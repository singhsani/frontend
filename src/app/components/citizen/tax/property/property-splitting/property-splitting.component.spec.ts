import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySplittingComponent } from './property-splitting.component';

describe('PropertySplittingComponent', () => {
  let component: PropertySplittingComponent;
  let fixture: ComponentFixture<PropertySplittingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertySplittingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertySplittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
