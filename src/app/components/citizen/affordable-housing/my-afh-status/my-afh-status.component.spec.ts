import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAfhStatusComponent } from './my-afh-status.component';

describe('MyAfhStatusComponent', () => {
  let component: MyAfhStatusComponent;
  let fixture: ComponentFixture<MyAfhStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAfhStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAfhStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
