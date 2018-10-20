import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodRenewComponent } from './food-renew.component';

describe('FoodRenewComponent', () => {
  let component: FoodRenewComponent;
  let fixture: ComponentFixture<FoodRenewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodRenewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
