import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopEstablishLicenceComponent } from './shop-establish.component';

describe('ShopEstablishLicenceComponent', () => {
  let component: ShopEstablishLicenceComponent;
  let fixture: ComponentFixture<ShopEstablishLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopEstablishLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopEstablishLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
