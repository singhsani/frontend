import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrcRegistrationComponent } from './prc-registration.component';

describe('PrcRegistrationComponent', () => {
  let component: PrcRegistrationComponent;
  let fixture: ComponentFixture<PrcRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrcRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrcRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
