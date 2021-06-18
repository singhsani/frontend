import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalAdoptionComponent } from './animal-adoption.component';

describe('AnimalAdoptionComponent', () => {
  let component: AnimalAdoptionComponent;
  let fixture: ComponentFixture<AnimalAdoptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalAdoptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalAdoptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
