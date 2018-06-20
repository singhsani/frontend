import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTheaterComponent } from './book-theater.component';

describe('BookTheaterComponent', () => {
  let component: BookTheaterComponent;
  let fixture: ComponentFixture<BookTheaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookTheaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookTheaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
