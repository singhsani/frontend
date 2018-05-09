import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyVacantPremisesAppComponent } from './property-vacant-premises-app.component';

describe('PropertyVacantPremisesAppComponent', () => {
  let component: PropertyVacantPremisesAppComponent;
  let fixture: ComponentFixture<PropertyVacantPremisesAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyVacantPremisesAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyVacantPremisesAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
