import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookStadiumComponent } from './book-stadium.component';

describe('BookStadiumComponent', () => {
  let component: BookStadiumComponent;
  let fixture: ComponentFixture<BookStadiumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookStadiumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookStadiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
