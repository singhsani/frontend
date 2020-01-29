import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathRegistrationComponent } from './death-registration.component';

describe('DeathRegistrationComponent', () => {
  let component: DeathRegistrationComponent;
  let fixture: ComponentFixture<DeathRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeathRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeathRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
