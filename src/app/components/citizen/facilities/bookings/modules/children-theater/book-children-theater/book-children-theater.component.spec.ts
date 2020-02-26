import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookChildrenTheaterComponent } from './book-children-theater.component';

describe('BookChildrenTheaterComponent', () => {
  let component: BookChildrenTheaterComponent;
  let fixture: ComponentFixture<BookChildrenTheaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookChildrenTheaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookChildrenTheaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
