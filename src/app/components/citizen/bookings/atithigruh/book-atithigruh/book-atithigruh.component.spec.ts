import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAtithigruhComponent } from './book-atithigruh.component';

describe('BookAtithigruhComponent', () => {
  let component: BookAtithigruhComponent;
  let fixture: ComponentFixture<BookAtithigruhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookAtithigruhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAtithigruhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
