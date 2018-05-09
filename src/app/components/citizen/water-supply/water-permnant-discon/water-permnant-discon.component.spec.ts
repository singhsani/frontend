import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterPermnantDisconComponent } from './water-permnant-discon.component';

describe('WaterPermnantDisconComponent', () => {
  let component: WaterPermnantDisconComponent;
  let fixture: ComponentFixture<WaterPermnantDisconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterPermnantDisconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterPermnantDisconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
