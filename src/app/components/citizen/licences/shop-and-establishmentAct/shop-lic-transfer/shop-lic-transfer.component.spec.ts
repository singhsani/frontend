import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLicTransferComponent } from './shop-lic-transfer.component';

describe('ShopLicTransferComponent', () => {
  let component: ShopLicTransferComponent;
  let fixture: ComponentFixture<ShopLicTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopLicTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLicTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
