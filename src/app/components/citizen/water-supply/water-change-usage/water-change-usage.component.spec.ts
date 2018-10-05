import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterChangeUsageComponent } from './water-change-usage.component';

 describe('WaterChangeUsageComponent', () => {
  let component: WaterChangeUsageComponent;
  let fixture: ComponentFixture<WaterChangeUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterChangeUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterChangeUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
