import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmailMobileComponent } from './update-email-mobile.component';

describe('UpdateEmailMobileComponent', () => {
  let component: UpdateEmailMobileComponent;
  let fixture: ComponentFixture<UpdateEmailMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEmailMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEmailMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
