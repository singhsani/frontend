import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TownHallComponent } from './town-hall.component';

describe('TownHallComponent', () => {
  let component: TownHallComponent;
  let fixture: ComponentFixture<TownHallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TownHallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TownHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
