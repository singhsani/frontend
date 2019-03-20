import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPlanetariumComponent } from './book-planetarium.component';

describe('BookPlanetariumComponent', () => {
  let component: BookPlanetariumComponent;
  let fixture: ComponentFixture<BookPlanetariumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookPlanetariumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookPlanetariumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
