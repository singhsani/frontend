import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalPondDuplicateComponent } from './animal-pond-duplicate.component';

describe('AnimalPondDuplicateComponent', () => {
  let component: AnimalPondDuplicateComponent;
  let fixture: ComponentFixture<AnimalPondDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalPondDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalPondDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
