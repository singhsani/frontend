import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthDuplicateComponent } from './birth-duplicate.component';

describe('BirthDuplicateComponent', () => {
  let component: BirthDuplicateComponent;
  let fixture: ComponentFixture<BirthDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
