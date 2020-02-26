import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireCertificateComponent } from './fire-certificate.component';

describe('FireCertificateComponent', () => {
  let component: FireCertificateComponent;
  let fixture: ComponentFixture<FireCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
