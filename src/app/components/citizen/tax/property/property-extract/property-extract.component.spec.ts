import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyExtractComponent } from './property-extract.component';

describe('PropertyExtractComponent', () => {
  let component: PropertyExtractComponent;
  let fixture: ComponentFixture<PropertyExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
