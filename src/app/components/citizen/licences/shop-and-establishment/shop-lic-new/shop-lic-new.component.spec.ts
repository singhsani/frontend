import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLicNewComponent } from './shop-lic-new.component';

describe('ShopLicNewComponent', () => {
  let component: ShopLicNewComponent;
  let fixture: ComponentFixture<ShopLicNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopLicNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLicNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
