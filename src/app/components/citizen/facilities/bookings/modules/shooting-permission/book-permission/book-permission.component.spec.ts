import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPermissionComponent } from './book-permission.component';

describe('BookPermissionComponent', () => {
  let component: BookPermissionComponent;
  let fixture: ComponentFixture<BookPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
