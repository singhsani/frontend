import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodNewComponent } from './food-new.component';

describe('FoodNewComponent', () => {
  let component: FoodNewComponent;
  let fixture: ComponentFixture<FoodNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
