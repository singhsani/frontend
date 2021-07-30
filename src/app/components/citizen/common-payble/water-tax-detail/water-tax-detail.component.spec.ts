import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterTaxDetailComponent } from './water-tax-detail.component';

describe('WaterTaxDetailComponent', () => {
  let component: WaterTaxDetailComponent;
  let fixture: ComponentFixture<WaterTaxDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterTaxDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterTaxDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
