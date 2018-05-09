import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLicModificationComponent } from './shop-lic-modification.component';

describe('ShopLicModificationComponent', () => {
  let component: ShopLicModificationComponent;
  let fixture: ComponentFixture<ShopLicModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopLicModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLicModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
