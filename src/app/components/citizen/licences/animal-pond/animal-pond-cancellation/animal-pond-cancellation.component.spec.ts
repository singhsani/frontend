import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalPondCancellationComponent } from './animal-pond-cancellation.component';

describe('AnimalPondCancellationComponent', () => {
  let component: AnimalPondCancellationComponent;
  let fixture: ComponentFixture<AnimalPondCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalPondCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalPondCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
