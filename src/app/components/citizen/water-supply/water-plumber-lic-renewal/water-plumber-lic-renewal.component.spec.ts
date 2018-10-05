import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterPlumberLicRenewalComponent } from './water-plumber-lic-renewal.component';

 describe('WaterPlumberLicRenewalComponent', () => {
  let component: WaterPlumberLicRenewalComponent;
  let fixture: ComponentFixture<WaterPlumberLicRenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterPlumberLicRenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterPlumberLicRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
