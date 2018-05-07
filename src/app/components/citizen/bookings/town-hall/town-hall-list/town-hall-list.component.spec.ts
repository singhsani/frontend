import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TownHallListComponent } from './town-hall-list.component';

describe('TownHallListComponent', () => {
  let component: TownHallListComponent;
  let fixture: ComponentFixture<TownHallListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TownHallListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TownHallListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
