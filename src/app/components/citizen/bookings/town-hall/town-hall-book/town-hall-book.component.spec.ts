import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TownHallBookComponent } from './town-hall-book.component';

describe('TownHallBookComponent', () => {
  let component: TownHallBookComponent;
  let fixture: ComponentFixture<TownHallBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TownHallBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TownHallBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
