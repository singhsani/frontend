import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenTheaterComponent } from './children-theater.component';

describe('ChildrenTheaterComponent', () => {
  let component: ChildrenTheaterComponent;
  let fixture: ComponentFixture<ChildrenTheaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildrenTheaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenTheaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
