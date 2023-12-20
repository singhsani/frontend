import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntimationToRegistrationComponent } from './intimation-to-registration.component';

describe('IntimationToRegistrationComponent', () => {
  let component: IntimationToRegistrationComponent;
  let fixture: ComponentFixture<IntimationToRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntimationToRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntimationToRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
