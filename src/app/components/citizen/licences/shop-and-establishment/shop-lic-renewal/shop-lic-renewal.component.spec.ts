import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLicRenewalComponent } from './shop-lic-renewal.component';

describe('ShopLicRenewalComponent', () => {
  let component: ShopLicRenewalComponent;
  let fixture: ComponentFixture<ShopLicRenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopLicRenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLicRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
