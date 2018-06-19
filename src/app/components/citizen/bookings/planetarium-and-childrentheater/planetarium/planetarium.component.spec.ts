import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetariumComponent } from './planetarium.component';

describe('PlanetariumComponent', () => {
  let component: PlanetariumComponent;
  let fixture: ComponentFixture<PlanetariumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanetariumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetariumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
