import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeathCertificateComponent } from './death-certificate.component';

describe('DeathCertificateComponent', () => {
  let component: DeathCertificateComponent;
  let fixture: ComponentFixture<DeathCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeathCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeathCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
