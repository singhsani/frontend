import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PecRegistrationComponent } from './pec-registration.component';

describe('PecRegistrationComponent', () => {
  let component: PecRegistrationComponent;
  let fixture: ComponentFixture<PecRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PecRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PecRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
