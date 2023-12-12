import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLicCloseComponent } from './shop-lic-close.component';

describe('ShopLicCloseComponent', () => {
  let component: ShopLicCloseComponent;
  let fixture: ComponentFixture<ShopLicCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopLicCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLicCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
