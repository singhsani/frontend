import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLicDuplicateComponent } from './shop-lic-duplicate.component';

describe('ShopLicDuplicateComponent', () => {
  let component: ShopLicDuplicateComponent;
  let fixture: ComponentFixture<ShopLicDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopLicDuplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLicDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
