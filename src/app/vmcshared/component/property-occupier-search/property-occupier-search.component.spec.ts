import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyOccupierSearchComponent } from './property-occupier-search.component';

describe('ProeprtyOccupierSearchComponent', () => {
  let component: PropertyOccupierSearchComponent;
  let fixture: ComponentFixture<PropertyOccupierSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyOccupierSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyOccupierSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
