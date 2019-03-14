import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimmingPoolComponent } from './swimming-pool.component';

describe('SwimmingPoolComponent', () => {
  let component: SwimmingPoolComponent;
  let fixture: ComponentFixture<SwimmingPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwimmingPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimmingPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
