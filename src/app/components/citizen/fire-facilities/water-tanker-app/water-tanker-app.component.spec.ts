import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterTankerAppComponent } from './water-tanker-app.component';

describe('WaterTankerAppComponent', () => {
  let component: WaterTankerAppComponent;
  let fixture: ComponentFixture<WaterTankerAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterTankerAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterTankerAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
