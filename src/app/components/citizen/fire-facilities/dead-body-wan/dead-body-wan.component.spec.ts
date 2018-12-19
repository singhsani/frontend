import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadBodyWanComponent } from './dead-body-wan.component';

describe('DeadBodyWanComponent', () => {
  let component: DeadBodyWanComponent;
  let fixture: ComponentFixture<DeadBodyWanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeadBodyWanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadBodyWanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
