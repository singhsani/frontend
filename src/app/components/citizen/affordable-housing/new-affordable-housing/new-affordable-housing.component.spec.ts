import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAffordableHousingComponent } from './new-affordable-housing.component';

describe('NewAffordableHousingComponent', () => {
  let component: NewAffordableHousingComponent;
  let fixture: ComponentFixture<NewAffordableHousingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAffordableHousingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAffordableHousingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
