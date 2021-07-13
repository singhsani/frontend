import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyTaxDetailComponent } from './property-tax-detail.component';

describe('PropertyTaxDetailComponent', () => {
  let component: PropertyTaxDetailComponent;
  let fixture: ComponentFixture<PropertyTaxDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyTaxDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyTaxDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
